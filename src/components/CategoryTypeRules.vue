<template>
  <div class="card">
    <div class="card-header" />

    <div class="card-body">
      <div class="rules-section">
        <div class="table-wrapper">
          <table class="table">
            <colgroup>
              <col style="width: 53%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 2%" />
            </colgroup>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Type</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in rules" :key="row._key" :class="{ deleted: row._isDeleted }">
                <!-- KEYWORD -->
                <td>
                  <input
                    v-model="row.keyword"
                    :disabled="row._isDeleted"
                    type="text"
                    class="cell-input"
                    :class="{ required: !row.keyword }"
                    placeholder="e.g. NETFLIX"
                    @change="row._isEdited = true"
                  />
                </td>

                <!-- TYPE -->
                <td>
                  <select
                    v-model="row.type_id"
                    :disabled="row._isDeleted"
                    class="cell-select"
                    :class="{ required: !row.type_id }"
                    @change="row._isEdited = true"
                  >
                    <option value=""></option>
                    <option v-for="type in props.types" :key="type.id" :value="type.id">
                      {{ type.type }}
                    </option>
                  </select>
                </td>

                <!-- CATEGORY -->
                <td>
                  <select
                    v-model="row.category_id"
                    :disabled="row._isDeleted"
                    class="cell-select"
                    @change="handleCategoryChange(row)"
                  >
                    <option value=""></option>
                    <option v-for="category in props.categories" :key="category.id" :value="category.id">
                      {{ category.category }}
                    </option>
                  </select>
                </td>

                <!-- SUBCATEGORY -->
                <td>
                  <select
                    v-model="row.subCategory_id"
                    class="cell-select"
                    :disabled="!row.category_id || row._isDeleted"
                    @change="row._isEdited = true"
                  >
                    <option value=""></option>
                    <option
                      v-for="subcategory in getRowSubcategories(row)"
                      :key="subcategory.id"
                      :value="subcategory.id"
                    >
                      {{ subcategory.subcategory }}
                    </option>
                  </select>
                </td>

                <!-- REMOVE BTN -->
                <td class="col-action">
                  <button class="col-action-btn" @click="toggleDelete(row)">{{ row._isDeleted ? '↺' : '✕' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions">
          <button class="btn btn-outline" @click="addRule">+ Add Rule</button>

          <button class="btn" :disabled="apiStatus.isLoading || !hasChanges" @click="saveCategories">
            <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
            <span v-else>Save Rules</span>
          </button>
        </div>

        <div v-if="apiStatus.isError" class="alert alert-error">
          <span class="alert-icon">⚠️</span>
          {{ apiStatus.message }}
        </div>

        <div v-if="apiStatus.isSuccess && apiStatus.message" class="alert alert-success">
          <span class="alert-icon">✓</span>
          {{ apiStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type {
  CategoryRule,
  UpdateCategoryRulePayload,
  ApiResponseStatus,
  Type,
  Category,
  SubcategoriesByCategory,
  Subcategory,
} from '@/types';
import api from '@/services/api';
import { getCategoryName, getSubcategories } from '@/utils/utils';
import { computed } from 'vue';

const props = defineProps<{ types: Type[]; categories: Category[]; subcategories: SubcategoriesByCategory[] }>();

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

interface Rule extends CategoryRule {
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _isDeleted: boolean;
}

const rules = ref<Rule[]>([]);

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

const hasChanges = computed(() => {
  return rules.value.some((r) => r._isNew || r._isEdited || r._isDeleted);
});

async function fetchCategoryRules(): Promise<void> {
  apiStatus.value = { isLoading: false, isSuccess: false, isError: false };

  try {
    const categpryRules = await api.getCategoryRules();

    rules.value = categpryRules.map((rule) => ({
      ...rule,
      _key: rule.id ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _isDeleted: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load category rules.',
    };
  }
}

function getRowSubcategories(row: Rule): Subcategory[] {
  if (!row.category_id) return [];

  const categoryName = getCategoryName(props.categories, row.category_id);
  const result = getSubcategories(props.subcategories, categoryName);

  return result;
}

async function handleCategoryChange(row: Rule): Promise<void> {
  row.subCategory_id = '';
  row._isEdited = true;
}

function addRule(): void {
  rules.value.push({
    keyword: '',
    type_id: '',
    category_id: '',
    subCategory_id: '',
    _key: nextKey(),
    _isNew: true,
    _isEdited: true,
    _isDeleted: false,
  });
}

function toggleDelete(row: Rule): void {
  row._isDeleted = !row._isDeleted;
}

async function saveCategories(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };
  try {
    const updatePayload: UpdateCategoryRulePayload[] = rules.value
      .filter((rule) => !rule._isDeleted && (rule._isNew || rule._isEdited))
      .map((rule) => ({
        id: rule.id,
        keyword: rule.keyword,
        typeId: rule.type_id,
        categoryId: rule.category_id,
        subcategoryId: rule.subCategory_id,
      }));

    const deletePayload: string[] = rules.value.filter((rule) => rule._isDeleted).map((rule) => rule.id!);

    await api.updateCategoryRules(updatePayload);
    await api.deleteCategoryRules(deletePayload);
    await fetchCategoryRules();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Category rules updated successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to update category rules.',
    };
  }
}

onMounted(fetchCategoryRules);
</script>

<style scoped lang="scss">
.rules-section {
  width: 100%;
}
</style>
