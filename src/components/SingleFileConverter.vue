<template>
  <div class="converter-card" :data-testid="`bank-${bank.id}-card`">
    <div class="card-header">
      <div class="icon">
        <img v-if="bank.logo" :src="bank.logo" :alt="bank.name" class="logo-img" />
        <span v-else>{{ bank.icon }}</span>
      </div>
      <div class="header-text">
        <h3>{{ bank.name }}</h3>
        <p>{{ bank.description }}</p>
      </div>
      <button class="info-btn" data-testid="format-info-button" @click.stop="toggleFormatInfo">ⓘ</button>
    </div>

    <FormatInfoPopover
      v-if="showFormatInfo"
      :loading="formatLoading"
      :error="formatError"
      @close="showFormatInfo = false"
    >
      <template #title>
        <span data-testid="header">
          Example of input file for {{ bank.name }}
          <span v-if="formatFileFormat" class="format-badge" data-testid="file-extension-badge">{{
            formatFileFormat
          }}</span>
        </span>
      </template>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="formatHtml" class="format-html" data-testid="example-html" v-html="formatHtml" />
    </FormatInfoPopover>

    <div class="card-body">
      <div class="file-input-wrapper">
        <input
          :id="`file-input-${bank.id}`"
          ref="fileInput"
          type="file"
          class="file-input"
          @change="handleFileSelect"
        />
        <label :for="`file-input-${bank.id}`" class="file-label" data-testid="file-input">
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
        :disabled="!selectedFile || status.isLoading"
        class="btn btn-primary"
        data-testid="convert-button"
        @click="handleConvert"
      >
        <span v-if="status.isLoading" class="spinner">⚙️</span>
        <span v-else>Convert</span>
      </button>

      <div v-if="status.isError" class="alert alert-error" data-testid="error-alert">
        <span class="alert-icon">⚠️</span>
        {{ status.message }}
      </div>

      <div v-if="status.isSuccess" class="alert alert-success" data-testid="success-alert">
        <span class="alert-icon">✓</span>
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FormatInfoPopover from './FormatInfoPopover.vue';
import type { BankOption, ConversionStatus } from '@/types';
import api from '@/services/api';
import { downloadFile, generateFileName } from '@/utils/fileDownload';

const showFormatInfo = ref(false);
const formatHtml = ref<string | null>(null);
const formatFileFormat = ref<string | null>(null);
const formatLoading = ref(false);
const formatError = ref<string | null>(null);

async function toggleFormatInfo(): Promise<void> {
  showFormatInfo.value = !showFormatInfo.value;
  if (showFormatInfo.value && formatHtml.value === null && !formatLoading.value) {
    formatLoading.value = true;
    formatError.value = null;
    try {
      const data = await api.getBankFormat(props.bank.id);
      formatHtml.value = data.htmlExample;
      formatFileFormat.value = data.fileFormat;
    } catch {
      formatError.value = 'Could not load format info.';
    } finally {
      formatLoading.value = false;
    }
  }
}

interface Props {
  bank: BankOption;
}

const props = defineProps<Props>();

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
    status.value.isError = false;
    status.value.isSuccess = false;
  }
}

async function handleConvert(): Promise<void> {
  if (!selectedFile.value) return;

  status.value.isLoading = true;
  status.value.isError = false;
  status.value.isSuccess = false;

  try {
    const blob = await api.convertBankFile(props.bank.id, selectedFile.value);

    const fileName = generateFileName(props.bank.name);
    downloadFile(blob, fileName);

    status.value.isSuccess = true;
    status.value.message = `File converted successfully: ${fileName}`;
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error: unknown) {
    status.value.isError = true;
    status.value.message = error instanceof Error ? error.message : 'Failed to convert file';
  } finally {
    status.value.isLoading = false;
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

  .info-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.35);
    }
  }
}

.format-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  vertical-align: middle;
  text-transform: uppercase;
}

.format-html {
  font-size: 12px;
  overflow-x: auto;
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
