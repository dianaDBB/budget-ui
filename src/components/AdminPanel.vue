<template>
  <div class="admin-panel" data-testid="admin-panel">
    <div class="bank-tabs">
      <button
        v-for="bank in banks"
        :key="bank.id"
        class="tab-btn"
        :class="{ active: selectedBankId === bank.id }"
        :data-testid="`admin-tab-${bank.id}`"
        @click="selectBank(bank.id)"
      >
        <img v-if="bank.logo" :src="bank.logo" :alt="bank.name" class="tab-logo" />
        <span>{{ bank.name }}</span>
      </button>
    </div>

    <div v-if="selectedBank" class="config-form" :data-testid="`admin-form-${selectedBankId}`">
      <h3 class="form-title">{{ selectedBank.name }} Configuration</h3>

      <div class="fields-grid">
        <div class="field-group">
          <label :for="`${selectedBankId}-firstLine`" class="field-label">First Data Line</label>
          <input
            :id="`${selectedBankId}-firstLine`"
            v-model.number="form.firstLine"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${selectedBankId}-firstLine`"
            placeholder="e.g. 1"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.firstDataLine ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-delimiter`" class="field-label">Delimiter</label>
          <input
            :id="`${selectedBankId}-delimiter`"
            v-model="form.delimiter"
            type="text"
            maxlength="5"
            class="field-input"
            :data-testid="`${selectedBankId}-delimiter`"
            placeholder="e.g. ,"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.delimiter ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-dateFormat`" class="field-label">Date Format</label>
          <input
            :id="`${selectedBankId}-dateFormat`"
            v-model="form.dateFormat"
            type="text"
            class="field-input"
            :data-testid="`${selectedBankId}-dateFormat`"
            placeholder="e.g. dd/MM/yyyy"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.dateFormat ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-dateColumnPosition`" class="field-label">Date Column Position</label>
          <input
            :id="`${selectedBankId}-dateColumnPosition`"
            v-model.number="form.dateColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${selectedBankId}-dateColumnPosition`"
            placeholder="e.g. 0"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.dateColumnPosition ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-amountColumnPosition`" class="field-label">Amount Column Position</label>
          <input
            :id="`${selectedBankId}-amountColumnPosition`"
            v-model.number="form.amountColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${selectedBankId}-amountColumnPosition`"
            placeholder="e.g. 1"
          />
          <p class="field-current">Current: {{ configLoading ? '…' : currentConfig?.amountColumnPosition ?? '—' }}</p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-descriptionColumnPosition`" class="field-label"
            >Description Column Position</label
          >
          <input
            :id="`${selectedBankId}-descriptionColumnPosition`"
            v-model.number="form.descriptionColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${selectedBankId}-descriptionColumnPosition`"
            placeholder="e.g. 2"
          />
          <p class="field-current">
            Current: {{ configLoading ? '…' : currentConfig?.descriptionColumnPosition ?? '—' }}
          </p>
        </div>

        <div class="field-group">
          <label :for="`${selectedBankId}-cdColumnPosition`" class="field-label">Credit/Debit Column Position</label>
          <input
            :id="`${selectedBankId}-cdColumnPosition`"
            v-model.number="form.cdColumnPosition"
            type="number"
            min="0"
            class="field-input"
            :data-testid="`${selectedBankId}-cdColumnPosition`"
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
          :data-testid="`${selectedBankId}-save-btn`"
          @click="handleSave"
        >
          <span v-if="status.isLoading" class="spinner">⚙️</span>
          <span v-else>Save Configuration</span>
        </button>
      </div>

      <div v-if="status.isError" class="alert alert-error" :data-testid="`${selectedBankId}-error-alert`">
        <span class="alert-icon">⚠️</span>
        {{ status.message }}
      </div>

      <div v-if="status.isSuccess" class="alert alert-success" :data-testid="`${selectedBankId}-success-alert`">
        <span class="alert-icon">✓</span>
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { BankConfigRequest, BankFormat, ConversionStatus } from '@/types';
import api from '@/services/api';

const banks = [
  { id: 'activoBank', name: 'ActivoBank', logo: '/AB.png' },
  { id: 'creditoAgricola', name: 'Crédito Agrícola', logo: '/CA.png' },
  { id: 'cryptoCom', name: 'Crypto.com', logo: '/CY.png' },
];

const selectedBankId = ref<string>(banks[0].id);
const selectedBank = computed(() => banks.find((b) => b.id === selectedBankId.value));

const emptyForm = (): BankConfigRequest => ({
  firstLine: undefined,
  delimiter: undefined,
  dateFormat: undefined,
  amountColumnPosition: undefined,
  dateColumnPosition: undefined,
  descriptionColumnPosition: undefined,
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

function selectBank(bankId: string): void {
  selectedBankId.value = bankId;
}

watch(
  selectedBankId,
  (bankId) => {
    form.value = emptyForm();
    status.value = { isLoading: false, isSuccess: false, isError: false };
    fetchCurrentConfig(bankId);
  },
  { immediate: true },
);

async function handleSave(): Promise<void> {
  status.value = { isLoading: true, isSuccess: false, isError: false };

  // Build payload with only filled-in fields
  const payload: BankConfigRequest = {};
  if (form.value.firstLine !== undefined && form.value.firstLine !== null) payload.firstLine = form.value.firstLine;
  if (form.value.delimiter) payload.delimiter = form.value.delimiter;
  if (form.value.dateFormat) payload.dateFormat = form.value.dateFormat;
  if (form.value.amountColumnPosition !== undefined && form.value.amountColumnPosition !== null)
    payload.amountColumnPosition = form.value.amountColumnPosition;
  if (form.value.dateColumnPosition !== undefined && form.value.dateColumnPosition !== null)
    payload.dateColumnPosition = form.value.dateColumnPosition;
  if (form.value.descriptionColumnPosition !== undefined && form.value.descriptionColumnPosition !== null)
    payload.descriptionColumnPosition = form.value.descriptionColumnPosition;
  if (form.value.cdColumnPosition !== undefined && form.value.cdColumnPosition !== null)
    payload.cdColumnPosition = form.value.cdColumnPosition;

  try {
    await api.updateBankConfig(selectedBankId.value, payload);
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
</style>
