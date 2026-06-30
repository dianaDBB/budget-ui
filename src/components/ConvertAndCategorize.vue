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

      <button
        class="btn"
        :disabled="!hasFiles || previewApiStatus.isLoading || previewData.length > 0"
        @click="handleGeneratePreview"
      >
        <span v-if="previewApiStatus.isLoading" class="spinner">⚙️</span>
        <span v-else>Generate Preview</span>
      </button>

      <div v-if="previewApiStatus.isError" class="alert alert-error">
        <span>⚠️</span>
        {{ previewApiStatus.message }}
      </div>

      <!-- Preview Table -->
      <div v-if="previewData.length > 0" class="preview-section">
        <div class="table-wrapper">
          <table class="table">
            <colgroup>
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 38%" />
              <col style="width: 5%" />
              <col style="width: 10%" />
              <col style="width: 15%" />
              <col style="width: 10%" />
              <col style="width: 2%" />
            </colgroup>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount (€)</th>
                <th>Type</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tx, idx) in previewData" :key="idx">
                <!-- BANK NAME -->
                <td>
                  <select v-model="tx.bankName" class="cell-select" :class="{ required: !tx.bankName }">
                    <option value=""></option>
                    <option v-for="bank in bankOptions" :key="bank.name" :value="bank.name">{{ bank.name }}</option>
                  </select>
                </td>

                <!-- DATE -->
                <td>
                  <input v-model="tx.date" type="date" class="cell-input" :class="{ required: !tx.date }" />
                </td>

                <!-- DESCRIPTION -->
                <td>
                  <input
                    v-model="tx.originalDescription"
                    type="text"
                    class="cell-input"
                    :class="{ required: !tx.originalDescription }"
                  />
                </td>

                <!-- AMOUNT -->
                <td>
                  <input
                    :value="tx.value.toFixed(2)"
                    type="text"
                    inputmode="decimal"
                    class="cell-input"
                    :class="[tx.value < 0 ? 'negative' : 'positive', { required: tx.value === 0 }]"
                    @blur="(e) => { const raw = (e.target as HTMLInputElement).value.replace(',', '.'); const v = parseFloat(raw); tx.value = isNaN(v) ? tx.value : parseFloat(v.toFixed(2)); (e.target as HTMLInputElement).value = tx.value.toFixed(2); }"
                  />
                </td>

                <!-- TYPE -->
                <td>
                  <select v-model="tx.type" class="cell-select" :class="{ required: !tx.type }">
                    <option value=""></option>
                    <option v-for="type in props.types" :key="type.id" :value="type.type">{{ type.type }}</option>
                  </select>
                </td>

                <!-- CATEGORY -->
                <td>
                  <select v-model="tx.category" class="cell-select" @change="handleCategoryChange(tx)">
                    <option value=""></option>
                    <option v-for="category in props.categories" :key="category.id" :value="category.category">
                      {{ category.category }}
                    </option>
                  </select>
                </td>

                <!-- SUBCATEGORY -->
                <td>
                  <select v-model="tx.subCategory" class="cell-select" :disabled="!tx.category">
                    <option value=""></option>
                    <option
                      v-for="subcategory in getRowSubcategories(tx)"
                      :key="subcategory.id"
                      :value="subcategory.subcategory"
                    >
                      {{ subcategory.subcategory }}
                    </option>
                  </select>
                </td>

                <!-- ADD NEW ROW -->
                <td class="col-action">
                  <button class="col-action-btn" @click="insertRowAfter(idx)">+</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
        v-if="previewData.length > 0"
        class="btn"
        :disabled="generateExcelApiStatus.isLoading"
        @click="handleGenerateExcel"
      >
        <span v-if="generateExcelApiStatus.isLoading" class="spinner">⚙️</span>
        <span v-else>Generate Excel File</span>
      </button>

      <div v-if="generateExcelApiStatus.isError" class="alert alert-error">
        <span>⚠️</span>
        {{ generateExcelApiStatus.message }}
      </div>

      <div v-if="generateExcelApiStatus.isSuccess" class="alert alert-success">
        <span>✓</span>
        {{ generateExcelApiStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import FileFormatInfoPopover from './FileFormatInfoPopover.vue';
import type {
  ApiResponseStatus,
  Bank,
  Category,
  PreviewData,
  SubcategoriesByCategory,
  Subcategory,
  Type,
} from '@/types';
import api from '@/services/api';
import { downloadFile } from '@/utils/fileDownload';
import { useFileInfoPopover } from '@/composables/useFileInfoPopover.ts';
import { getSubcategories, normalizeDate } from '@/utils/utils.ts';

const props = defineProps<{
  banks: Bank[];
  types: Type[];
  categories: Category[];
  subcategories: SubcategoriesByCategory[];
}>();

const bankOptions = computed(() => [...props.banks, { name: 'Cash' }]);

const selectedFiles = ref<Record<string, File | null>>({});
const previewData = ref<PreviewData[]>([]);

const previewApiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const generateExcelApiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const hasFiles = computed(() => Object.values(selectedFiles.value).some((f) => f !== null));

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
    previewApiStatus.value.isError = false;
  }
}

function getRowSubcategories(row: PreviewData): Subcategory[] {
  if (!row.category) return [];

  const result = getSubcategories(props.subcategories, row.category);
  return result;
}

async function handleCategoryChange(tx: PreviewData): Promise<void> {
  tx.subCategory = null;
}

function insertRowAfter(idx: number): void {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const emptyRow: PreviewData = {
    bankName: '',
    date: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
    type: '',
    category: null,
    subCategory: null,
    value: 0,
    originalDescription: '',
  };
  previewData.value.splice(idx + 1, 0, emptyRow);
}

async function handleGeneratePreview(): Promise<void> {
  if (!hasFiles.value) return;

  previewApiStatus.value = { isLoading: false, isSuccess: false, isError: false };
  generateExcelApiStatus.value = { isLoading: false, isSuccess: false, isError: false, message: '' };

  previewData.value = [];

  try {
    const files = Object.entries(selectedFiles.value)
      .filter((entry): entry is [string, File] => entry[1] !== null)
      .map(([bankName, file]) => ({ bankName, file }));

    previewData.value = (await api.previewMultipleFiles(files)).map((previewData) => ({
      ...previewData,
      date: normalizeDate(previewData.date),
      value: parseFloat(previewData.value.toFixed(2)),
    }));

    previewApiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    previewApiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to generate preview.',
    };
  }
}

async function handleGenerateExcel(): Promise<void> {
  generateExcelApiStatus.value = { isLoading: true, isSuccess: false, isError: false, message: '' };

  try {
    const blob = await api.previewToExcel(previewData.value);
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `budget_${timestamp}.xlsx`;
    downloadFile(blob, fileName);

    generateExcelApiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: `Excel file generated! Downloaded: ${fileName}`,
    };
  } catch (error: unknown) {
    generateExcelApiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to generate Excel file',
    };
  }
}
</script>

<style scoped lang="scss">
.preview-section {
  width: 100%;
}
</style>
