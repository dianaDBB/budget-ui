<template>
  <div class="config-form" data-testid="admin-form-categories">
    <h3 class="form-title">Category Rules</h3>
    <p v-if="categoriesLoading" class="field-current">Loading…</p>
    <template v-else>
      <div class="categories-table-wrapper">
        <table class="categories-table">
          <colgroup>
            <col />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 60px" />
          </colgroup>
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Type</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in categoryRules" :key="row._key">
              <td>
                <span v-if="!row._isEditing" class="cell-text">{{ row.keyword }}</span>
                <input
                  v-else
                  v-model="row.keyword"
                  class="cell-input"
                  :class="{ 'cell--required': !row.keyword }"
                  placeholder="e.g. NETFLIX"
                />
              </td>
              <td>
                <span v-if="!row._isEditing" class="cell-text">{{ getTypeName(row.type_id) }}</span>
                <select v-else v-model="row.type_id" class="cell-select">
                  <option value=""></option>
                  <option v-for="t in typeOptions" :key="t.id" :value="t.id">{{ t.type }}</option>
                </select>
              </td>
              <td>
                <span v-if="!row._isEditing" class="cell-text">{{ getCategoryName(row.category_id) }}</span>
                <select v-else v-model="row.category_id" class="cell-select" @change="handleCategoryChange(row)">
                  <option value=""></option>
                  <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">{{ opt.category }}</option>
                </select>
              </td>
              <td>
                <span v-if="!row._isEditing" class="cell-text">{{
                  getSubcategoryName(row.category_id, row.subCategory_id)
                }}</span>
                <select
                  v-else
                  v-model="row.subCategory_id"
                  class="cell-select"
                  :disabled="!row.category_id || loadingSubcategoryFor.has(getCategoryName(row.category_id))"
                >
                  <option value=""></option>
                  <option v-for="opt in getSubcategoryOptions(row.category_id)" :key="opt.id" :value="opt.id">
                    {{ opt.subcategory }}
                  </option>
                </select>
              </td>
              <td>
                <button v-if="row._isNew" class="btn-icon btn-icon--delete" title="Remove rule" @click="removeRule(i)">
                  ✕
                </button>
                <button
                  v-else
                  class="btn-icon btn-icon--edit"
                  :title="row._isEditing ? 'Done editing' : 'Edit rule'"
                  @click="toggleEdit(row)"
                >
                  {{ row._isEditing ? '✓' : '✎' }}
                </button>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CategoryRule, CategoryRuleSavePayload, BudgetType, ConversionStatus } from '@/types';
import api from '@/services/api';

interface CategoryRuleRow extends CategoryRule {
  _key: string;
  _isNew: boolean;
  _isEditing: boolean;
  _isDirty: boolean;
}

const categoryRules = ref<CategoryRuleRow[]>([]);
const typeOptions = ref<BudgetType[]>([]);
const categoryOptions = ref<{ id: string; category: string }[]>([]);
const categorySubcategoryMap = ref<Record<string, { id: string; subcategory: string }[]>>({});
const loadingSubcategoryFor = ref(new Set<string>());
const categoriesLoading = ref(false);
const categoriesStatus = ref<ConversionStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

async function fetchCategoryRules(): Promise<void> {
  categoriesLoading.value = true;
  categoriesStatus.value = { isLoading: false, isSuccess: false, isError: false };
  try {
    const [rules, types, categories] = await Promise.all([
      api.getCategoryRules(),
      api.getAllTypes(),
      api.getAllCategories(),
    ]);
    typeOptions.value = types;
    categoryOptions.value = categories;
    categoryRules.value = rules.map((r) => ({
      ...r,
      _key: r.id ?? nextKey(),
      _isNew: false,
      _isEditing: false,
      _isDirty: false,
    }));
    // Pre-load subcategories for categories already in use
    const usedCategories = [...new Set(categoryRules.value.map((r) => r.category).filter((c): c is string => !!c))];
    await Promise.all(usedCategories.map((cat) => loadSubcategoriesFor(cat)));
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

function getTypeName(typeId: string | undefined): string {
  return typeOptions.value.find((t) => t.id === typeId)?.type ?? '';
}

function getCategoryName(categoryId: string | undefined): string {
  return categoryOptions.value.find((c) => c.id === categoryId)?.category ?? '';
}

function getSubcategoryName(categoryId: string | undefined, subcategoryId: string | undefined): string {
  if (!categoryId || !subcategoryId) return '';
  const catName = getCategoryName(categoryId);
  return categorySubcategoryMap.value[catName]?.find((s) => s.id === subcategoryId)?.subcategory ?? '';
}

function getSubcategoryOptions(categoryId: string | null | undefined): { id: string; subcategory: string }[] {
  if (!categoryId) return [];
  const catName = getCategoryName(categoryId);
  return categorySubcategoryMap.value[catName] ?? [];
}

async function loadSubcategoriesFor(category: string): Promise<void> {
  if (categorySubcategoryMap.value[category]) return;
  loadingSubcategoryFor.value = new Set([...loadingSubcategoryFor.value, category]);
  try {
    const subs = await api.getSubcategoriesByCategory(category);
    categorySubcategoryMap.value = { ...categorySubcategoryMap.value, [category]: subs };
  } catch {
    categorySubcategoryMap.value = { ...categorySubcategoryMap.value, [category]: [] };
  } finally {
    const next = new Set(loadingSubcategoryFor.value);
    next.delete(category);
    loadingSubcategoryFor.value = next;
  }
}

async function handleCategoryChange(row: CategoryRuleRow): Promise<void> {
  row.subCategory_id = '';
  if (!row.category_id) return;
  const catName = getCategoryName(row.category_id);
  if (!catName) return;
  await loadSubcategoriesFor(catName);
}

function addRule(): void {
  categoryRules.value.push({
    keyword: '',
    type_id: '',
    category_id: '',
    subCategory_id: '',
    _key: nextKey(),
    _isNew: true,
    _isEditing: true,
    _isDirty: true,
  });
}

function toggleEdit(row: CategoryRuleRow): void {
  if (!row._isEditing) {
    row._isDirty = true;
  }
  row._isEditing = !row._isEditing;
}

function removeRule(index: number): void {
  categoryRules.value.splice(index, 1);
}

async function saveCategories(): Promise<void> {
  categoriesStatus.value = { isLoading: true, isSuccess: false, isError: false };
  try {
    const rules: CategoryRuleSavePayload[] = categoryRules.value
      .filter((row) => row._isNew || row._isDirty)
      .map(
        ({
          _key: _k,
          _isNew: _n,
          _isEditing: _e,
          _isDirty: _d,
          type: _t,
          category: _c,
          subCategory: _sc,
          type_id,
          category_id,
          subCategory_id,
          ...rest
        }): CategoryRuleSavePayload => ({
          ...rest,
          typeId: type_id,
          categoryId: category_id,
          subcategoryId: subCategory_id,
        }),
      );
    await api.updateCategoryRules(rules);
    await fetchCategoryRules();
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

onMounted(fetchCategoryRules);
</script>

<style scoped lang="scss">
.config-form {
  padding: 30px;
}

.form-title {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.field-current {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  font-family: ui-monospace, monospace;
}

.cell-input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
  background: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #764ba2;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.cell--required {
  border-color: #ef4444 !important;
  background-color: #fff5f5 !important;
}

.cell-select {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
  background: white;
  cursor: pointer;
  box-sizing: border-box;

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

.form-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.categories-actions {
  justify-content: space-between;
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

.cell-text {
  display: block;
  padding: 4px 6px;
  font-size: 12px;
  color: #374151;
  min-height: 26px;
  line-height: 18px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;

  &--delete {
    color: #9ca3af;

    &:hover {
      color: #dc2626;
      background: #fef2f2;
    }
  }

  &--edit {
    color: #667eea;

    &:hover {
      color: #764ba2;
      background: #f5f3ff;
    }
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
}

@media (max-width: 768px) {
  .config-form {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
