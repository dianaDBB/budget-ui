<template>
  <div class="admin-panel" data-testid="admin-panel">
    <div class="bank-tabs">
      <button
        v-for="bank in banks"
        :key="bank.id"
        class="tab-btn"
        :class="{ active: activeTab === bank.id }"
        :data-testid="`admin-tab-${bank.id}`"
        @click="activeTab = bank.id"
      >
        <img v-if="bank.logo" :src="bank.logo" :alt="bank.name" class="tab-logo" />
        <span>{{ bank.name }}</span>
      </button>
      <button
        class="tab-btn tab-btn--categories"
        :class="{ active: activeTab === 'categories' }"
        data-testid="admin-tab-categories"
        @click="activeTab = 'categories'"
      >
        <span>Categories</span>
      </button>
    </div>

    <!-- Bank config form -->
    <div v-if="activeTab !== 'categories' && selectedBank" class="config-form" :data-testid="`admin-form-${activeTab}`">
      <h3 class="form-title">{{ selectedBank.name }} Configuration</h3>

      <div class="fields-grid">
        <div class="field-group">
          <label :for="`${activeTab}-firstLine`" class="field-label">First Data Line</label>
          <input
            :id="`${activeTab}-firstLine`"
            v-model.number="form.firstLine"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${activeTab}-firstLine`"
            placeholder="e.g. 1"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.firstDataLine ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-delimiter`" class="field-label">Delimiter</label>
          <input
            :id="`${activeTab}-delimiter`"
            v-model="form.delimiter"
            type="text"
            maxlength="5"
            class="field-input"
            :data-testid="`${activeTab}-delimiter`"
            placeholder="e.g. ,"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.delimiter ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-dateFormat`" class="field-label">Date Format</label>
          <input
            :id="`${activeTab}-dateFormat`"
            v-model="form.dateFormat"
            type="text"
            class="field-input"
            :data-testid="`${activeTab}-dateFormat`"
            placeholder="e.g. dd/MM/yyyy"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.dateFormat ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-dateColumnPosition`" class="field-label">Date Column Position</label>
          <input
            :id="`${activeTab}-dateColumnPosition`"
            v-model.number="form.dateColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${activeTab}-dateColumnPosition`"
            placeholder="e.g. 0"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.dateColumnPosition ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-amountColumnPosition`" class="field-label">Amount Column Position</label>
          <input
            :id="`${activeTab}-amountColumnPosition`"
            v-model.number="form.amountColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${activeTab}-amountColumnPosition`"
            placeholder="e.g. 1"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.amountColumnPosition ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-descriptionColumnPosition`" class="field-label">Description Column Position</label>
          <input
            :id="`${activeTab}-descriptionColumnPosition`"
            v-model.number="form.descColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${activeTab}-descriptionColumnPosition`"
            placeholder="e.g. 2"
          />
          <p class="field-current">
            Current: {{ configLoading ? '…' : currentConfig?.descriptionColumnPosition ?? '—' }}
          </p>
        </div>

        <div class="field-group">
          <label :for="`${activeTab}-cdColumnPosition`" class="field-label">Credit/Debit Column Position</label>
          <input
            :id="`${activeTab}-cdColumnPosition`"
            v-model.number="form.cdColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${activeTab}-cdColumnPosition`"
            placeholder="e.g. 3"
          />
          <p class="field-current">
            Current: {{ configLoading ? '…' : currentConfig?.creditDebitColumnPosition ?? '—' }}
          </p>
        </div>
      </div>

      <div class="form-actions">
        <button
          class="btn btn-primary"
          :disabled="status.isLoading"
          :data-testid="`${activeTab}-save-btn`"
          @click="handleSave"
        >
          <span v-if="status.isLoading" class="spinner">⚙️</span>
          <span v-else>Save Configuration</span>
        </button>
      </div>

      <div v-if="status.isError" class="alert alert-error" :data-testid="`${activeTab}-error-alert`">
        <span class="alert-icon">⚠️</span>
        {{ status.message }}
      </div>

      <div v-if="status.isSuccess" class="alert alert-success" :data-testid="`${activeTab}-success-alert`">
        <span class="alert-icon">✓</span>
        {{ status.message }}
      </div>
    </div>

    <!-- Categories editor -->
    <div v-else-if="activeTab === 'categories'" class="config-form" data-testid="admin-form-categories">
      <h3 class="form-title">Category Rules</h3>
      <p v-if="categoriesLoading" class="field-current">Loading…</p>
      <template v-else>
        <div class="categories-table-wrapper">
          <table class="categories-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Category</th>
                <th>Sub-category</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rule, i) in categoryRules" :key="i">
                <td><input v-model="rule.keyword" class="field-input" placeholder="e.g. NETFLIX" /></td>
                <td><input v-model="rule.category" class="field-input" placeholder="e.g. Entertainment" /></td>
                <td><input v-model="rule.subCategory" class="field-input" placeholder="e.g. Streaming" /></td>
                <td><input v-model="rule.type" class="field-input" placeholder="e.g. Expense" /></td>
                <td>
                  <button class="btn-icon" title="Remove rule" @click="removeRule(i)">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="form-actions categories-actions">
          <button class="btn btn-outline" data-testid="add-rule-btn" @click="addRule">+ Add Rule</button>
          <button
            class="btn btn-primary"
            :disabled="categoriesStatus.isLoading"
            data-testid="save-categories-btn"
            @click="saveCategories"
          >
            <span v-if="categoriesStatus.isLoading" class="spinner">⚙️</span>
            <span v-else>Save Rules</span>
          </button>
        </div>

        <div v-if="categoriesStatus.isError" class="alert alert-error" data-testid="categories-error-alert">
          <span class="alert-icon">⚠️</span>
          {{ categoriesStatus.message }}
        </div>

        <div v-if="categoriesStatus.isSuccess" class="alert alert-success" data-testid="categories-success-alert">
          <span class="alert-icon">✓</span>
          {{ categoriesStatus.message }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { BankConfigRequest, BankFormat, CategoryRule, ConversionStatus } from '@/types';
import api from '@/services/api';

const banks = [
  { id: 'ActivoBank', name: 'ActivoBank', logo: '/AB.png' },
  { id: 'CreditoAgricola', name: 'Crédito Agrícola', logo: '/CA.png' },
  { id: 'CryptoCom', name: 'Crypto.com', logo: '/CY.png' },
];

const activeTab = ref<string>(banks[0].id);
const selectedBank = computed(() => banks.find((b) => b.id === activeTab.value));

// ── Bank config ───────────────────────────────────────────────────────────────

const emptyForm = (): BankConfigRequest => ({
  firstLine: undefined,
  delimiter: undefined,
  dateFormat: undefined,
  amountColumnPosition: undefined,
  dateColumnPosition: undefined,
  descColumnPosition: undefined,
  cdColumnPosition: undefined,
});

const form = ref<BankConfigRequest>(emptyForm());

const status = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const currentConfig = ref<BankFormat | null>(null);
const configLoading = ref(false);
const configError = ref<string | null>(null);

async function fetchCurrentConfig(bankId: string): Promise<void> {
  currentConfig.value = null;
  configError.value = null;
  configLoading.value = true;
  try {
    currentConfig.value = await api.getBankFormat(bankId);
  } catch {
    configError.value = 'Could not load current configuration.';
  } finally {
    configLoading.value = false;
  }
}

watch(
  activeTab,
  (tab) => {
    if (tab === 'categories') {
      fetchCategoryRules();
    } else {
      form.value = emptyForm();
      status.value = { isLoading: false, isSuccess: false, isError: false };
      fetchCurrentConfig(tab);
    }
  },
  { immediate: true },
);

async function handleSave(): Promise<void> {
  status.value = { isLoading: true, isSuccess: false, isError: false };

  const payload: BankConfigRequest = {};
  if (form.value.firstLine !== undefined && form.value.firstLine !== null) payload.firstLine = form.value.firstLine;
  if (form.value.delimiter) payload.delimiter = form.value.delimiter;
  if (form.value.dateFormat) payload.dateFormat = form.value.dateFormat;
  if (form.value.amountColumnPosition !== undefined && form.value.amountColumnPosition !== null)
    payload.amountColumnPosition = form.value.amountColumnPosition;
  if (form.value.dateColumnPosition !== undefined && form.value.dateColumnPosition !== null)
    payload.dateColumnPosition = form.value.dateColumnPosition;
  if (form.value.descColumnPosition !== undefined && form.value.descColumnPosition !== null)
    payload.descColumnPosition = form.value.descColumnPosition;
  if (form.value.cdColumnPosition !== undefined && form.value.cdColumnPosition !== null)
    payload.cdColumnPosition = form.value.cdColumnPosition;

  try {
    await api.updateBankConfig(activeTab.value, payload);
    status.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: `${selectedBank.value?.name} configuration updated successfully.`,
    };
  } catch (error: unknown) {
    status.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to update configuration.',
    };
  }
}

// ── Category rules ────────────────────────────────────────────────────────────

const categoryRules = ref<CategoryRule[]>([]);
const categoriesLoading = ref(false);
const categoriesStatus = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

async function fetchCategoryRules(): Promise<void> {
  categoriesLoading.value = true;
  categoriesStatus.value = { isLoading: false, isSuccess: false, isError: false };
  try {
    categoryRules.value = await api.getCategoryRules();
  } catch {
    categoriesStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: 'Could not load category rules.',
    };
  } finally {
    categoriesLoading.value = false;
  }
}

function addRule(): void {
  categoryRules.value.push({ keyword: '', category: '', subCategory: '', type: '' });
}

function removeRule(index: number): void {
  categoryRules.value.splice(index, 1);
}

async function saveCategories(): Promise<void> {
  categoriesStatus.value = { isLoading: true, isSuccess: false, isError: false };
  try {
    await api.updateCategoryRules(categoryRules.value);
    categoriesStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Category rules updated successfully.',
    };
  } catch (error: unknown) {
    categoriesStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to update category rules.',
    };
  }
}
</script>

<style scoped lang="scss">
.admin-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.bank-tabs {
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: auto;
  overflow-y: hidden;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: white;
  }

  &.active {
    color: white;
    font-weight: 700;
    border-bottom-color: white;
  }

  .tab-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}

.config-form {
  padding: 30px;
}

.form-title {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.field-input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;

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
    opacity: 0.9;
  }
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;

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

@media (max-width: 768px) {
  .config-form {
    padding: 20px;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

.field-current {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  font-family: ui-monospace, monospace;
}

.tab-btn--categories {
  margin-left: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.categories-table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f9fafb;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 6px 8px;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      width: 40px;
      text-align: center;
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  .field-input {
    width: 100%;
    box-sizing: border-box;
  }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #dc2626;
    background: #fef2f2;
  }
}

.btn-outline {
  background: white;
  border: 1.5px solid #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #667eea;
    color: white;
  }
}

.categories-actions {
  justify-content: space-between;
}
</style>
