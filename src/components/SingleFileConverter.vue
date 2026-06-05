<template>
  <div class="converter-card">
    <div class="card-header">
      <div class="icon">
        <img v-if="bankOption.logo" :src="bankOption.logo" :alt="bankOption.name" class="logo-img" />
        <span v-else>{{ bankOption.icon }}</span>
      </div>
      <div class="header-text">
        <h3>{{ bankOption.name }}</h3>
        <p>{{ bankOption.description }}</p>
      </div>
    </div>

    <div class="card-body">
      <div class="file-input-wrapper">
        <input
          :id="`file-input-${bankOption.id}`"
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          class="file-input"
        />
        <label :for="`file-input-${bankOption.id}`" class="file-label">
          <span v-if="!selectedFile" class="label-text">
            <span class="upload-icon">🗀</span>
            Click to select file
          </span>
          <span v-else class="label-text selected">
            <span class="check-icon">✓</span>
            {{ selectedFile.name }}
          </span>
        </label>
      </div>

      <button
        @click="handleConvert"
        :disabled="!selectedFile || status.isLoading"
        class="btn btn-primary"
      >
        <span v-if="status.isLoading" class="spinner">⚙️</span>
        <span v-else>Convert</span>
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
import { ref } from 'vue'
import type { BankOption, ConversionStatus } from '@/types'
import api from '@/services/api'
import { downloadFile, generateFileName } from '@/utils/fileDownload'

interface Props {
  bankOption: BankOption
}

const props = defineProps<Props>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false
})

function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    status.value.isError = false
    status.value.isSuccess = false
  }
}

async function handleConvert(): Promise<void> {
  if (!selectedFile.value) return

  status.value.isLoading = true
  status.value.isError = false
  status.value.isSuccess = false

  try {
    let blob: Blob

    switch (props.bankOption.id) {
      case 'cryptoCom':
        blob = await api.convertCryptoComFile(selectedFile.value)
        break
      case 'creditoAgricola':
        blob = await api.convertCreditoAgricolaFile(selectedFile.value)
        break
      case 'activoBank':
        blob = await api.convertActivoBankFile(selectedFile.value)
        break
      default:
        throw new Error('Unknown bank option')
    }

    const fileName = generateFileName(props.bankOption.name)
    downloadFile(blob, fileName)

    status.value.isSuccess = true
    status.value.message = `File converted successfully: ${fileName}`
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error: any) {
    status.value.isError = true
    if (error.response?.status === 400) {
      status.value.message = `Bad request: ${error.response?.data?.message || 'Invalid file format'}`
    } else if (error.message === 'Network Error') {
      status.value.message = 'Network Error - Make sure the API is running'
    } else {
      status.value.message = error instanceof Error ? error.message : 'Failed to convert file'
    }
    console.error('Conversion error:', error)
  } finally {
    status.value.isLoading = false
  }
}
</script>

<style scoped lang="scss">
.converter-card {
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
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-img {
      max-width: 50px;
      max-height: 50px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
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

.file-input-wrapper {
  margin-bottom: 15px;

  .file-input {
    display: none;
  }

  .file-label {
    display: block;
    padding: 20px;
    border: 2px dashed #c4b5fd;
    border-radius: 8px;
    background: #f5f7ff;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #764ba2;
      background: #eef2ff;
    }

    .label-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #667eea;
      font-weight: 500;
      font-size: 14px;

      &.selected {
        color: #10b981;

        .check-icon {
          font-size: 18px;
        }
      }
    }

    .upload-icon {
      font-size: 24px;
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
