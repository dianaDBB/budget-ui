<template>
  <div class="card">
    <div class="card-header" />

    <div class="card-body">
      <p class="card-body-description">Clear the server-side cache to force a fresh reload of all data</p>
      <button class="btn" :disabled="apiStatus.isLoading" @click="clearCache">
        <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
        <span v-else>Clear cache</span>
      </button>

      <div v-if="apiStatus.isError" class="alert alert-error">
        <span>⚠️</span>
        {{ apiStatus.message }}
      </div>

      <div v-if="apiStatus.isSuccess" class="alert alert-success">
        <span>✓</span>
        {{ apiStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ApiResponseStatus } from '@/types';
import api from '@/services/api';

const apiStatus = ref<ApiResponseStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

async function clearCache() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await api.refreshCache();
    apiStatus.value = { isLoading: false, isSuccess: true, isError: false, message: 'Cache cleared successfully.' };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to clear cache. Please try again.',
    };
  }
}
</script>

<style scoped lang="scss">
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
