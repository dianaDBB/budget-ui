<template>
  <div class="multi-converter-card">
    <div class="card-header">
      <div class="icon">
        <img :src="'/logo.png'" width="50" height="50"/>
      </div>
      <div class="header-text">
        <h3>Convert Multiple Files</h3>
        <p>Upload files from multiple banks and convert them together</p>
      </div>
    </div>

    <div class="card-body">
      <div class="files-grid">
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="file-input-group"
        >
          <label :for="`file-${bank.id}`" class="bank-label">
            <span v-if="bank.logo" class="bank-logo">
              <img :src="bank.logo" :alt="bank.name" />
            </span>
            <span v-else class="bank-icon">{{ bank.icon }}</span>
            <span class="bank-name">{{ bank.name }}</span>
          </label>
          <input
            :id="`file-${bank.id}`"
            type="file"
            @change="(e) => handleFileSelect(e, bank.id)"
            class="file-input"
          />
          <div class="file-display">
            <span v-if="selectedFiles[bank.id]" class="file-name">
              ✓ {{ selectedFiles[bank.id]?.name }}
            </span>
            <span v-else class="placeholder">No file selected</span>
          </div>
        </div>
      </div>

      <button
        @click="handleConvertAll"
        :disabled="!hasFiles || status.isLoading"
        class="btn btn-primary"
      >
        <span v-if="status.isLoading" class="spinner">⚙️</span>
        <span v-else>Convert All</span>
      </button>

      <div v-if="status.isError" class="alert alert-error">
        <span class="alert-icon">⚠️</span>
        {{ status.message }}
      </div>

      <div v-if="status.isSuccess" class="alert alert-success">
        <span class="alert-icon">✓</span>
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BankOption, ConversionStatus } from '@/types'
import api from '@/services/api'
import { downloadFile } from '@/utils/fileDownload'

const banks: BankOption[] = [
  {
    id: 'activoBank',
    name: 'ActivoBank',
    endpoint: '/file/activoBank',
    description: 'ActivoBank CSV',
    logo: '/AB.png'
  },
  {
    id: 'creditoAgricola',
    name: 'Crédito Agrícola',
    endpoint: '/file/creditoAgricola',
    description: 'Crédito Agrícola CSV',
    logo: '/CA.png'
  },
  {
    id: 'cryptoCom',
    name: 'Crypto.com',
    endpoint: '/file/cryptoCom',
    description: 'Crypto.com CSV',
    logo: '/CY.png'
  }
]

const selectedFiles = ref<Record<string, File | null>>({
  activoBank: null,
  creditoAgricola: null,
  cryptoCom: null
})

const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false
})

const hasFiles = computed(() => {
  return Object.values(selectedFiles.value).some(file => file !== null)
})

function handleFileSelect(event: Event, bankId: string): void {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    selectedFiles.value[bankId] = files[0]
    status.value.isError = false
    status.value.isSuccess = false
  }
}

async function handleConvertAll(): Promise<void> {
  if (!hasFiles.value) return

  status.value.isLoading = true
  status.value.isError = false
  status.value.isSuccess = false

  try {
    const blob = await api.convertAllBankFiles(
      selectedFiles.value.activoBank || undefined,
      selectedFiles.value.creditoAgricola || undefined,
      selectedFiles.value.cryptoCom || undefined
    )

    const timestamp = new Date().toISOString().split('T')[0]
    const fileName = `all_banks_budget_${timestamp}.xlsx`
    downloadFile(blob, fileName)

    status.value.isSuccess = true
    status.value.message = `✓ All files converted successfully! Downloaded: ${fileName}`

    // Reset files
    selectedFiles.value = {
      activoBank: null,
      creditoAgricola: null,
      cryptoCom: null
    }

    // Reset file inputs
    document.querySelectorAll('.file-input').forEach((input: Element) => {
      (input as HTMLInputElement).value = ''
    })
  } catch (error: any) {
    status.value.isError = true
    if (error.response?.status === 400) {
      status.value.message = `Bad request: ${error.response?.data?.message || 'Invalid file format'}`
    } else if (error.message === 'Network Error') {
      status.value.message = 'Network Error - Make sure the API is running'
    } else {
      status.value.message = error instanceof Error ? error.message : 'Failed to convert files'
    }
    console.error('Conversion error:', error)
  } finally {
    status.value.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.multi-converter-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
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
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.file-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .file-input {
    display: none;
  }

  .bank-label {
    display: flex;
    padding: 12px;
    border: 2px solid #c4b5fd;
    border-radius: 8px;
    background: #f5f7ff;
    cursor: pointer;
    transition: all 0.3s;

    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #667eea;

    &:hover {
        border-color: #764ba2;
        background: #eef2ff;
    }

    .bank-icon {
      font-size: 20px;
    }

    .bank-logo {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 24px;
        max-height: 24px;
        width: auto;
        height: auto;
        object-fit: contain;
      }
    }

    .bank-name {
      font-size: 14px;
    }
  }

  .file-display {
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    min-height: 20px;
    display: flex;
    align-items: center;

    .file-name {
      color: #667eea;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .placeholder {
      color: #9ca3af;
      font-style: italic;
    }
  }
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

  &.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
    margin-right: 6px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.alert {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  animation: slideIn 0.3s ease-out;

  .alert-icon {
    font-size: 18px;
    min-width: 20px;
  }

  &.alert-error {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
  }

  &.alert-success {
    background: #efe;
    color: #3c3;
    border: 1px solid #cfc;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
