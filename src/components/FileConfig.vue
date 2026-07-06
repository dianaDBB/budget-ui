<template>
  <div class="card">
    <div class="card-header" />

    <div class="card-body">
      <div class="card-tabs">
        <button
          v-for="bank in props.banks"
          :key="bank.name"
          class="card-tab-btn"
          :class="{ active: activeTab === bank.name }"
          @click="activeTab = bank.name"
        >
          <span>{{ bank.name }}</span>
        </button>

        <button class="card-tab-btn add-new" :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">
          <span>+ Add New</span>
        </button>
      </div>

      <div v-if="selectedBank || isNewMode" class="card-form">
        <div class="fields-grid">
          <div v-if="isNewMode" class="field-group">
            <label class="field-label">Bank Name</label>
            <input v-model="form.bankName" class="field-input" />
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-bankName`" class="field-label">Bank Name</label>
            <input
              :id="`${activeTab}-bankName`"
              v-model="form.bankName"
              type="text"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.bankName) }"
              disabled
            />
            <p class="field-tip">Bank name (not editable)</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-fileFormat`" class="field-label">File format</label>
            <select v-model="form.fileFormat" class="field-input">
              <option v-for="format in fileFormats" :key="format" :value="format">
                {{ format }}
              </option>
            </select>
            <p class="field-tip">File format</p>
          </div>
        </div>

        <hr />

        <div class="fields-grid">
          <div class="field-group">
            <label :for="`${activeTab}-firstDataLine`" class="field-label">First Data Line</label>
            <input
              v-model.number="form.firstLine"
              type="number"
              min="0"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.firstLine) }"
            />
            <p class="field-tip">First line with data (0 index)</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-dateColumnPosition`" class="field-label">Date Column Position</label>
            <input
              :id="`${activeTab}-dateColumnPosition`"
              v-model.number="form.dateColumnPos"
              type="number"
              min="0"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.dateColumnPos) }"
            />
            <p class="field-tip">Column pos for date value (0 index)</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-amountColumnPosition`" class="field-label">Amount Column Position</label>
            <input
              :id="`${activeTab}-amountColumnPosition`"
              v-model.number="form.amountColumnPos"
              type="number"
              min="0"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.amountColumnPos) }"
            />
            <p class="field-tip">Column pos for amount value (0 index)</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-descriptionColumnPosition`" class="field-label"
              >Description Column Position</label
            >
            <input
              :id="`${activeTab}-descriptionColumnPosition`"
              v-model.number="form.descColumnPos"
              type="number"
              min="0"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.descColumnPos) }"
            />
            <p class="field-tip">Column pos for description value (0 index)</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-creditDebitColumnPosition`" class="field-label"
              >Credit/Debit Column Position</label
            >
            <input
              :id="`${activeTab}-creditDebitColumnPosition`"
              v-model.number="form.creditDebitColumnPos"
              type="number"
              min="0"
              class="field-input"
            />
            <p class="field-tip">Column pos for credit/debit value (0 index)</p>
          </div>
        </div>

        <hr />

        <div class="fields-grid">
          <div class="field-group">
            <label :for="`${activeTab}-dateFormat`" class="field-label">Date Format</label>
            <input
              :id="`${activeTab}-dateFormat`"
              v-model="form.dateFormat"
              type="text"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.dateFormat) }"
            />
            <p class="field-tip">Date format</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-delimiter`" class="field-label">Delimiter</label>
            <input
              :id="`${activeTab}-delimiter`"
              v-model="form.delimiter"
              type="text"
              maxlength="5"
              class="field-input"
            />
            <p class="field-tip">Char used as delimiter</p>
          </div>

          <div class="field-group">
            <label :for="`${activeTab}-ignoreValues`" class="field-label">Ignore values</label>
            <input
              :id="`${activeTab}-ignoreValues`"
              v-model="form.ignoreValues"
              type="text"
              class="field-input"
              :class="{ 'field-error': isInvalid(form.dateFormat) }"
            />
            <p class="field-tip">List of values to ignore (split by `,`)</p>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-outline" :disabled="apiStatus.isLoading || isNewMode" @click="handleDelete">
            <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
            <span v-else>Delete Configuration</span>
          </button>

          <button class="btn" :disabled="apiStatus.isLoading || !isFormValid" @click="handleSave">
            <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
            <span v-else>Save Configuration</span>
          </button>
        </div>

        <div v-if="apiStatus.isError" class="alert alert-error">
          <span>⚠️</span>
          {{ apiStatus.message }}
        </div>

        <div v-if="apiStatus.isSuccess && apiStatus.message" class="alert alert-success">
          <span>✓</span>
          {{ apiStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FileConfig, UpdateFileConfigPayload, Bank, ApiResponseStatus } from '@/types';
import { isValidNumber, isInvalid } from '@/composables/useFormValidation';
import api from '@/services/api';

const props = defineProps<{ banks: Bank[] }>();

const fileFormats = ['CSV', 'XLSX'] as const;

const activeTab = ref<string | 'new'>(props.banks[0].name);

const isNewMode = computed(() => activeTab.value === 'new');
const selectedBank = computed(() =>
  activeTab.value === 'new' ? null : props.banks.find((b) => b.name === activeTab.value) ?? null,
);

const emptyForm = (): UpdateFileConfigPayload => ({
  bankName: undefined,
  fileFormat: undefined,
  firstLine: undefined,
  dateColumnPos: undefined,
  amountColumnPos: undefined,
  descColumnPos: undefined,
  creditDebitColumnPos: undefined,
  dateFormat: undefined,
  delimiter: undefined,
  ignoreValues: undefined,
});

const form = ref<UpdateFileConfigPayload>(emptyForm());

const apiStatus = ref<ApiResponseStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const currentFileConfig = ref<FileConfig | null>(null);

watch(
  activeTab,
  (tab) => {
    apiStatus.value = { isLoading: false, isSuccess: false, isError: false };

    if (tab === 'new') {
      form.value = emptyForm();
      return;
    }

    fetchCurrentConfig(tab);
  },
  { immediate: true },
);

async function fetchCurrentConfig(bankName: string): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };
  currentFileConfig.value = null;

  try {
    currentFileConfig.value = await api.getFileConfig(bankName);

    form.value = {
      id: currentFileConfig.value.fileConfigDto.id,
      bankName: currentFileConfig.value.fileConfigDto.bankName,
      fileFormat: currentFileConfig.value.fileConfigDto.fileFormat,
      firstLine: currentFileConfig.value.fileConfigDto.firstLine,
      dateColumnPos: currentFileConfig.value.fileConfigDto.dateColumnPos,
      amountColumnPos: currentFileConfig.value.fileConfigDto.amountColumnPos,
      descColumnPos: currentFileConfig.value.fileConfigDto.descColumnPos,
      creditDebitColumnPos: currentFileConfig.value.fileConfigDto.creditDebitColumnPos,
      dateFormat: currentFileConfig.value.fileConfigDto.dateFormat,
      delimiter: currentFileConfig.value.fileConfigDto.delimiter,
      ignoreValues: currentFileConfig.value.fileConfigDto.ignoreValues,
    };

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load file configuration.',
    };
  }
}

const isFormValid = computed(() => {
  if (isNewMode.value) {
    return (
      !!form.value.bankName?.trim() &&
      isValidNumber(form.value.firstLine) &&
      !!form.value.dateFormat?.trim() &&
      isValidNumber(form.value.amountColumnPos) &&
      isValidNumber(form.value.dateColumnPos) &&
      isValidNumber(form.value.descColumnPos)
    );
  }

  return (
    isValidNumber(form.value.firstLine) &&
    !!form.value.dateFormat?.trim() &&
    isValidNumber(form.value.amountColumnPos) &&
    isValidNumber(form.value.dateColumnPos) &&
    isValidNumber(form.value.descColumnPos)
  );
});

async function handleSave(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (isNewMode.value) {
      await api.addFileConfig(form.value);
    } else {
      await api.updateFileConfig(activeTab.value, form.value);
    }

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: isNewMode.value
        ? 'Bank configuration created successfully.'
        : `${selectedBank.value?.name} configuration updated successfully.`,
    };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to update configuration.',
    };
  }
}

async function handleDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (isNewMode.value) {
      await api.addFileConfig(form.value);
    } else {
      await api.deleteFileConfig(activeTab.value);
    }

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: `${selectedBank.value?.name} configuration deleted successfully.`,
    };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to delete configuration.',
    };
  }
}
</script>

<style scoped lang="scss">
hr {
  border: none;
  height: 0.5px;
  background-color: #6b7280;
  width: 100%;
  margin: 10px auto;
}
</style>
