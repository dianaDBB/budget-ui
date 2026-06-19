<template>
  <div class="cache-card" data-testid="admin-form-cache">
    <div class="card-header">
      <div class="icon">🗄️</div>
      <div class="header-text">
        <h3>Cache Management</h3>
      </div>
    </div>

    <div class="card-body">
      <p class="body-description">Clear the server-side cache to force a fresh reload of all data</p>
      <button class="btn btn-primary" data-testid="clear-cache-btn" :disabled="status.isLoading" @click="clearCache">
        <span v-if="status.isLoading" class="spinner">⚙️</span>
        <span v-else>Clear cache</span>
      </button>

      <div v-if="status.isError" class="alert alert-error" data-testid="cache-error">
        <span class="alert-icon">⚠️</span>
        {{ status.message }}
      </div>

      <div v-if="status.isSuccess" class="alert alert-success" data-testid="cache-success">
        <span class="alert-icon">✓</span>
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ConversionStatus } from '@/types';
import api from '@/services/api';

const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

async function clearCache() {
  status.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await api.refreshCache();
    status.value = { isLoading: false, isSuccess: true, isError: false, message: 'Cache cleared successfully.' };
  } catch (error: unknown) {
    status.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to clear cache. Please try again.',
    };
  }
}
</script>

<style scoped lang="scss">
.cache-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    font-size: 40px;
    min-width: 50px;
  }

  .header-text {
    flex: 1;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }
  }
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.body-description {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;

  .alert-icon {
    font-size: 16px;
  }
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.spinner {
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
