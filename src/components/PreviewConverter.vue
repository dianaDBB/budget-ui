<template>
  <div class="preview-converter-card" data-testid="preview-converter-card">
    <div class="card-header">
      <div class="icon">
        <img :src="'/logo.png'" width="50" height="50" />
      </div>
      <div class="header-text">
        <h3 data-testid="preview-header">Convert &amp; Categorize</h3>
        <p data-testid="preview-header-description">
          Upload files, preview transactions, adjust categories and export to Excel
        </p>
      </div>
    </div>

    <div class="card-body">
      <!-- File Upload -->
      <div class="files-grid">
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="file-input-group"
          :data-testid="`preview-bank-${bank.id}-card`"
        >
          <label :for="`preview-file-${bank.id}`" class="bank-label">
            <span v-if="bank.logo" class="bank-logo">
              <img :src="bank.logo" :alt="bank.name" />
            </span>
            <span v-else class="bank-icon">{{ bank.icon }}</span>
            <span class="bank-name">{{ bank.name }}</span>
          </label>
          <input
            :id="`preview-file-${bank.id}`"
            type="file"
            class="file-input"
            data-testid="preview-file-input"
            @change="(e) => handleFileSelect(e, bank.id)"
          />
          <div class="file-display" data-testid="preview-selected-file-label">
            <span v-if="selectedFiles[bank.id]" class="file-name">✓ {{ selectedFiles[bank.id]?.name }}</span>
            <span v-else class="placeholder">No file selected</span>
          </div>
        </div>
      </div>

      <button
        :disabled="!hasFiles || previewStatus.isLoading"
        class="btn btn-primary"
        data-testid="generate-preview-button"
        @click="handleGeneratePreview"
      >
        <span v-if="previewStatus.isLoading" class="spinner">⚙️</span>
        <span v-else>Generate Preview</span>
      </button>

      <div v-if="previewStatus.isError" class="alert alert-error" data-testid="preview-error-alert">
        <span class="alert-icon">⚠️</span>
        {{ previewStatus.message }}
      </div>

      <!-- Preview Table -->
      <div v-if="previewData.length > 0" class="preview-section" data-testid="preview-section">
        <h4 class="preview-title" data-testid="preview-table-title">Preview ({{ previewData.length }} transactions)</h4>

        <div class="table-wrapper">
          <table class="preview-table" data-testid="preview-table">
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
              <tr v-for="(tx, idx) in previewData" :key="idx" :data-testid="`preview-row-${idx}`">
                <td data-testid="preview-bank-name">
                  <select
                    v-model="tx.bankName"
                    class="cell-select"
                    :class="{ 'cell--required': !tx.bankName }"
                    data-testid="preview-bank-name-select"
                  >
                    <option value=""></option>
                    <option v-for="opt in bankNameOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </td>
                <td data-testid="preview-date">
                  <input
                    v-model="tx.date"
                    type="date"
                    class="cell-input cell-input--date"
                    :class="{ 'cell--required': !tx.date }"
                    data-testid="preview-date-input"
                  />
                </td>
                <td data-testid="preview-description">
                  <input
                    v-model="tx.originalDescription"
                    type="text"
                    class="cell-input cell-input--description"
                    :class="{ 'cell--required': !tx.originalDescription }"
                    data-testid="preview-description-input"
                  />
                </td>
                <td data-testid="preview-amount">
                  <input
                    :value="tx.value.toFixed(2)"
                    type="text"
                    inputmode="decimal"
                    class="cell-input cell-input--amount"
                    :class="[
                      tx.value < 0 ? 'cell-input--negative' : 'cell-input--positive',
                      { 'cell--required': tx.value === 0 },
                    ]"
                    data-testid="preview-amount-input"
                    @blur="(e) => { const raw = (e.target as HTMLInputElement).value.replace(',', '.'); const v = parseFloat(raw); tx.value = isNaN(v) ? tx.value : parseFloat(v.toFixed(2)); (e.target as HTMLInputElement).value = tx.value.toFixed(2); }"
                  />
                </td>
                <td>
                  <select
                    v-model="tx.type"
                    class="cell-select"
                    :class="{ 'cell--required': !tx.type }"
                    data-testid="preview-type-select"
                  >
                    <option value=""></option>
                    <option v-for="opt in typeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </td>
                <td>
                  <select
                    v-model="tx.category"
                    class="cell-select"
                    data-testid="preview-category-select"
                    @change="handleCategoryChange(tx, tx.category)"
                  >
                    <option value=""></option>
                    <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </td>
                <td>
                  <select
                    v-model="tx.subCategory"
                    class="cell-select cell-select--small"
                    data-testid="preview-subcategory-select"
                    :disabled="!tx.category || loadingSubcategoryFor.has(tx.category)"
                  >
                    <option value=""></option>
                    <option v-for="opt in getSubcategoryOptions(tx.category)" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </td>
                <td class="col-action">
                  <button class="btn-add-row" data-testid="add-row-button" @click="insertRowAfter(idx)">+</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          :disabled="excelStatus.isLoading"
          class="btn btn-success"
          data-testid="generate-excel-button"
          @click="handleGenerateExcel"
        >
          <span v-if="excelStatus.isLoading" class="spinner">⚙️</span>
          <span v-else>Generate Excel File</span>
        </button>

        <div v-if="excelStatus.isError" class="alert alert-error" data-testid="excel-error-alert">
          <span class="alert-icon">⚠️</span>
          {{ excelStatus.message }}
        </div>

        <div v-if="excelStatus.isSuccess" class="alert alert-success" data-testid="excel-success-alert">
          <span class="alert-icon">✓</span>
          {{ excelStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { BankOption, TransactionPreview } from '@/types';
import api from '@/services/api';
import { downloadFile } from '@/utils/fileDownload';

const props = defineProps<{ banks: BankOption[] }>();

const selectedFiles = ref<Record<string, File | null>>({});
const previewData = ref<TransactionPreview[]>([]);

const typeOptions = ref<string[]>([]);
const categoryOptions = ref<string[]>([]);
const bankNameOptions = ref<string[]>([]);
const categorySubcategoryMap = ref<Record<string, string[]>>({});
const loadingSubcategoryFor = ref(new Set<string>());

const previewStatus = ref({ isLoading: false, isError: false, message: '' });
const excelStatus = ref({ isLoading: false, isSuccess: false, isError: false, message: '' });

onMounted(async () => {
  try {
    const [types, categories, configs] = await Promise.all([
      api.getAllTypes(),
      api.getAllCategories(),
      api.getAllBankConfigs(),
    ]);
    typeOptions.value = types.map((t) => t.type).sort();
    categoryOptions.value = categories.map((c) => c.category);
    bankNameOptions.value = [...configs.map((c) => c.bankName).sort(), 'Cash'];
  } catch {
    // Dropdowns will be empty; user can still interact
  }
});

const hasFiles = computed(() => Object.values(selectedFiles.value).some((f) => f !== null));

function handleFileSelect(event: Event, bankId: string): void {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    selectedFiles.value[bankId] = files[0];
    previewStatus.value.isError = false;
  }
}

function getSubcategoryOptions(category: string | null | undefined): string[] {
  if (!category) return [];
  return categorySubcategoryMap.value[category] ?? [];
}

async function loadSubcategoriesFor(category: string): Promise<void> {
  if (categorySubcategoryMap.value[category]) return;
  loadingSubcategoryFor.value = new Set([...loadingSubcategoryFor.value, category]);
  try {
    const subs = await api.getSubcategoriesByCategory(category);
    categorySubcategoryMap.value = { ...categorySubcategoryMap.value, [category]: subs.map((s) => s.subcategory) };
  } catch {
    categorySubcategoryMap.value = { ...categorySubcategoryMap.value, [category]: [] };
  } finally {
    const next = new Set(loadingSubcategoryFor.value);
    next.delete(category);
    loadingSubcategoryFor.value = next;
  }
}

async function handleCategoryChange(tx: TransactionPreview, category: string | null | undefined): Promise<void> {
  tx.subCategory = null;
  if (!category) return;
  await loadSubcategoriesFor(category);
}

function normalizeDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function insertRowAfter(idx: number): void {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const emptyRow: TransactionPreview = {
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

  previewStatus.value = { isLoading: true, isError: false, message: '' };
  previewData.value = [];
  excelStatus.value = { isLoading: false, isSuccess: false, isError: false, message: '' };

  try {
    const files = Object.entries(selectedFiles.value)
      .filter((entry): entry is [string, File] => entry[1] !== null)
      .map(([bankName, file]) => ({ bankName, file }));

    previewData.value = (await api.previewAllBankFiles(files)).map((tx) => ({
      ...tx,
      date: normalizeDate(tx.date),
      value: parseFloat(tx.value.toFixed(2)),
    }));

    // Merge values from preview data into dropdown options so existing
    // assignments are always selectable even if absent from category rules.
    const merge = (existing: string[], fromData: (string | null | undefined)[]) => {
      const extra = fromData.filter((v): v is string => !!v);
      return [...new Set([...existing, ...extra])].sort();
    };
    typeOptions.value = merge(
      typeOptions.value,
      previewData.value.map((t) => t.type),
    );
    categoryOptions.value = merge(
      categoryOptions.value,
      previewData.value.map((t) => t.category),
    );

    const uniqueCategories = [...new Set(previewData.value.map((t) => t.category).filter((c): c is string => !!c))];
    await Promise.all(uniqueCategories.map((cat) => loadSubcategoriesFor(cat)));

    previewStatus.value.isLoading = false;
  } catch (error: unknown) {
    previewStatus.value = {
      isLoading: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to generate preview',
    };
  }
}

async function handleGenerateExcel(): Promise<void> {
  excelStatus.value = { isLoading: true, isSuccess: false, isError: false, message: '' };

  try {
    const blob = await api.generateExcelFromPreview(previewData.value);
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `budget_${timestamp}.xlsx`;
    downloadFile(blob, fileName);

    excelStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: `✓ Excel file generated! Downloaded: ${fileName}`,
    };
  } catch (error: unknown) {
    excelStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to generate Excel file',
    };
  }
}
</script>

<style scoped lang="scss">
.preview-converter-card {
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
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #667eea;
    transition: all 0.3s;

    &:hover {
      border-color: #764ba2;
      background: #eef2ff;
    }

    .bank-icon {
      font-size: 20px;
    }

    .bank-logo img {
      max-width: 24px;
      max-height: 24px;
      object-fit: contain;
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

  &.btn-success {
    background: linear-gradient(135deg, #1d4ed8 0%, #6366f1 100%);
    color: white;
    margin-top: 16px;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
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

.preview-section {
  margin-top: 24px;
}

.preview-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    background: #f9fafb;
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;

    &:nth-child(2) {
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #f9fafb;
  }

  .negative {
    color: #dc2626;
    font-weight: 500;
  }

  .positive {
    color: #16a34a;
    font-weight: 500;
  }
}

.cell-select {
  width: 100%;
  min-width: 120px;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }
}

.cell-input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
  background: white;

  &:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }
}

.cell--required {
  border-color: #ef4444 !important;
  background-color: #fff5f5 !important;
}

.cell-input--date {
  min-width: 100px;
  max-width: 110px;
}

.cell-input--amount {
  min-width: 70px;
  max-width: 90px;
  text-align: right;
}

.cell-input--negative {
  color: #dc2626;
  font-weight: 500;
}

.cell-input--positive {
  color: #16a34a;
  font-weight: 500;
}

.cell-input--description {
  min-width: 300px;
}

.cell-select--small {
  min-width: 80px;
}

.col-action {
  width: 32px;
  padding: 4px 6px;
}

.btn-add-row {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid #c4b5fd;
  border-radius: 4px;
  background: #f5f7ff;
  color: #667eea;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
