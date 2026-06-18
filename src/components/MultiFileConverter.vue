<template>
  <div class="multi-converter-card" data-testid="multi-file-card">
    <div class="card-header">
      <div class="icon">
        <img :src="'/logo.png'" width="50" height="50" />
      </div>
      <div class="header-text">
        <h3 data-testid="header">Convert Multiple Files</h3>
        <p data-testid="header-description">Upload files from multiple banks and convert them together</p>
      </div>
      <button class="info-btn" data-testid="format-info-button" @click.stop="toggleFormatInfo">ⓘ</button>
    </div>

    <FormatInfoPopover
      v-if="showFormatInfo"
      :loading="formatsLoading"
      :error="formatsError"
      max-width="760px"
      @close="showFormatInfo = false"
    >
      <template #title>
        <span data-testid="header">Example of input files</span>
      </template>
      <div v-for="bank in banks" :key="bank.id" class="bank-format-section" :data-testid="`bank-${bank.id}-section`">
        <div class="bank-format-title">
          <span v-if="bank.logo" class="bank-logo-sm"><img :src="bank.logo" :alt="bank.name" /></span>
          <strong>{{ bank.name }}</strong>
          <span v-if="formatsData[bank.id]?.fileFormat" class="format-badge" data-testid="file-extension-badge">{{
            formatsData[bank.id]?.fileFormat
          }}</span>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-if="formatsData[bank.id]?.html"
          class="format-html"
          data-testid="example-html"
          v-html="formatsData[bank.id]?.html"
        />
      </div>
    </FormatInfoPopover>

    <div class="card-body">
      <div class="files-grid">
        <div v-for="bank in banks" :key="bank.id" class="file-input-group" :data-testid="`bank-${bank.id}-card`">
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
            class="file-input"
            data-testid="file-input"
            @change="(e) => handleFileSelect(e, bank.id)"
          />
          <div class="file-display" data-testid="selected-file-label">
            <span v-if="selectedFiles[bank.id]" class="file-name"> ✓ {{ selectedFiles[bank.id]?.name }} </span>
            <span v-else class="placeholder">No file selected</span>
          </div>
        </div>
      </div>

      <button
        :disabled="!hasFiles || status.isLoading"
        class="btn btn-primary"
        data-testid="convert-all-button"
        @click="handleConvertAll"
      >
        <span v-if="status.isLoading" class="spinner">⚙️</span>
        <span v-else>Convert All</span>
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
import { ref, computed } from 'vue';
import FormatInfoPopover from './FormatInfoPopover.vue';
import type { BankOption, ConversionStatus } from '@/types';
import api from '@/services/api';
import { downloadFile } from '@/utils/fileDownload';

const showFormatInfo = ref(false);
const formatsLoading = ref(false);
const formatsError = ref<string | null>(null);
const formatsData = ref<Record<string, { html: string; fileFormat: string }>>({});

async function toggleFormatInfo(): Promise<void> {
  showFormatInfo.value = !showFormatInfo.value;
  if (showFormatInfo.value && Object.keys(formatsData.value).length === 0 && !formatsLoading.value) {
    formatsLoading.value = true;
    formatsError.value = null;
    try {
      const results = await Promise.all(banks.map((b) => api.getBankFormat(b.id)));
      banks.forEach((b, i) => {
        formatsData.value[b.id] = { html: results[i].htmlExample, fileFormat: results[i].fileFormat };
      });
    } catch {
      formatsError.value = 'Could not load format info.';
    } finally {
      formatsLoading.value = false;
    }
  }
}

const banks: BankOption[] = [
  {
    id: 'ActivoBank',
    name: 'ActivoBank',
    endpoint: '/budget/file/ActivoBank',
    description: 'ActivoBank CSV',
    logo: '/AB.png',
  },
  {
    id: 'CreditoAgricola',
    name: 'Crédito Agrícola',
    endpoint: '/budget/file/CreditoAgricola',
    description: 'Crédito Agrícola CSV',
    logo: '/CA.png',
  },
  {
    id: 'CryptoCom',
    name: 'Crypto.com',
    endpoint: '/budget/file/CryptoCom',
    description: 'Crypto.com CSV',
    logo: '/CY.png',
  },
];

const selectedFiles = ref<Record<string, File | null>>({
  activoBank: null,
  creditoAgricola: null,
  cryptoCom: null,
});

const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const hasFiles = computed(() => {
  return Object.values(selectedFiles.value).some((file) => file !== null);
});

function handleFileSelect(event: Event, bankId: string): void {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    selectedFiles.value[bankId] = files[0];
    status.value.isError = false;
    status.value.isSuccess = false;
  }
}

async function handleConvertAll(): Promise<void> {
  if (!hasFiles.value) return;

  status.value.isLoading = true;
  status.value.isError = false;
  status.value.isSuccess = false;

  try {
    const files = Object.entries(selectedFiles.value)
      .filter((entry): entry is [string, File] => entry[1] !== null)
      .map(([bankName, file]) => ({ bankName, file }));

    const blob = await api.convertAllBankFiles(files);

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `all_banks_${timestamp}.xlsx`;
    downloadFile(blob, fileName);

    status.value.isSuccess = true;
    status.value.message = `✓ All files converted successfully! Downloaded: ${fileName}`;

    // Reset files
    selectedFiles.value = {
      activoBank: null,
      creditoAgricola: null,
      cryptoCom: null,
    };

    // Reset file inputs
    document.querySelectorAll('.file-input').forEach((input: Element) => {
      (input as HTMLInputElement).value = '';
    });
  } catch (error: unknown) {
    status.value.isError = true;
    status.value.message = error instanceof Error ? error.message : 'Failed to convert files';
  } finally {
    status.value.isLoading = false;
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

  .info-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
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

.bank-format-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bank-format-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;

  .bank-logo-sm img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    vertical-align: middle;
  }

  .format-badge {
    display: inline-block;
    padding: 1px 7px;
    background: #ede9fe;
    border: 1px solid #c4b5fd;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #6d28d9;
    text-transform: uppercase;
  }
}

.format-html {
  font-size: 12px;
  overflow-x: auto;
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
