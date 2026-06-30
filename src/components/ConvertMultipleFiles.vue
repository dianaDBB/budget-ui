<template>
  <div class="card">
    <div class="card-header" />

    <FileFormatInfoPopover
      v-if="fileInfoPopover.state.open"
      :loading="fileInfoPopover.state.loading"
      :error="fileInfoPopover.state.error"
      max-width="760px"
      @close="fileInfoPopover.close()"
    >
      <template #title>
        <span>Example of input files</span>
      </template>

      <div class="bank-format-section">
        <p>{{ fileInfoPopover.state.format?.fileFormat }}</p>

        <div v-if="fileInfoPopover.state.format?.html" v-html="fileInfoPopover.state.format.html" />
      </div>
    </FileFormatInfoPopover>

    <div class="card-body">
      <div class="card-form">
        <div class="fields-grid">
          <div v-for="bank in banks" :key="bank.name" class="field-group">
            <div class="field-label-row">
              <label :for="`file-${bank.name}`" class="field-label">{{ bank.name }}</label>

              <button type="button" class="info-btn" @click="openFileInfo(bank.name)">i</button>
            </div>

            <input
              :id="`file-${bank.name}`"
              type="file"
              class="field-file-input"
              @change="handleFileSelect($event, bank.name)"
            />
            <label :for="`file-${bank.name}`" class="file-btn" :class="{ selected: selectedFiles[bank.name] }">
              {{ selectedFiles[bank.name]?.name ?? 'Select file' }}
            </label>
          </div>
        </div>
      </div>

      <button class="btn" :disabled="!hasFiles || apiStatus.isLoading" @click="handleConvertAll">
        <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
        <span v-else>Convert All</span>
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
import { ref, computed } from 'vue';
import FileFormatInfoPopover from './FileFormatInfoPopover.vue';
import type { Bank, ApiResponseStatus } from '@/types';
import api from '@/services/api';
import { downloadFile } from '@/utils/fileDownload';
import { useFileInfoPopover } from '@/composables/useFileInfoPopover.ts';

const props = defineProps<{ banks: Bank[] }>();

const selectedFiles = ref<Record<string, File>>({});

const apiStatus = ref<ApiResponseStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const hasFiles = computed(() => {
  return Object.values(selectedFiles.value).some((file) => file !== null);
});

const fileInfoPopover = useFileInfoPopover();

async function openFileInfo(bankName: string): Promise<void> {
  const bank = props.banks.find((bank) => bank.name === bankName);

  if (!bank) return;

  fileInfoPopover.open(bank);

  await fileInfoPopover.load(async (b) => {
    const result = await api.getFileConfig(b.name);

    return {
      html: result.htmlExample,
      fileFormat: result.fileFormat,
    };
  });
}

function handleFileSelect(event: Event, bankName: string): void {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    selectedFiles.value[bankName] = files[0];
    apiStatus.value.isError = false;
    apiStatus.value.isSuccess = false;
  }
}

async function handleConvertAll(): Promise<void> {
  if (!hasFiles.value) return;

  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const files = Object.entries(selectedFiles.value)
      .filter((entry): entry is [string, File] => entry[1] !== null)
      .map(([bankName, file]) => ({ bankName, file }));

    const blob = await api.convertMultipleFiles(files);

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `all_banks_${timestamp}.xlsx`;
    downloadFile(blob, fileName);

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: `All files converted successfully! Downloaded: ${fileName}`,
    };

    // Reset files
    Object.keys(selectedFiles.value).forEach((key) => {
      delete selectedFiles.value[key];
    });

    // Reset file inputs
    document.querySelectorAll('.field-file-input').forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to convert files.',
    };
  }
}
</script>

<style scoped lang="scss">
.format-html {
  padding: 10px 10px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
