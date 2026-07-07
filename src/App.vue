<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1 data-testid="app-header">Budget</h1>
        <p data-testid="app-subtitle">Unify different bank extracts to a standardized format</p>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div>
          <nav class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              data-testid="tab"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>

          <!-- Convert -->
          <section v-if="activeTab === 'convert'" class="tab-body">
            <ConvertAndCategorize
              :banks="banks"
              :types="types"
              :categories="categories"
              :subcategories="subcategories"
            />
          </section>

          <!-- Convert (without preview) -->
          <section v-if="activeTab === 'multi'" class="tab-body">
            <ConvertMultipleFiles :banks="banks" />
          </section>

          <!-- Rules -->
          <section v-if="activeTab === 'categories'" class="tab-body">
            <Rules :types="types" :categories="categories" :subcategories="subcategories" />
          </section>

          <!-- File Config -->
          <section v-if="activeTab === 'file-config'" class="tab-body">
            <FileConfig :banks="banks" />
          </section>

          <!-- Cache -->
          <section v-if="activeTab === 'cache'" class="tab-body">
            <Cache />
          </section>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 Budget. Process your bank statements with ease.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConvertAndCategorize from '@/components/ConvertAndCategorize.vue';
import ConvertMultipleFiles from '@/components/ConvertMultipleFiles.vue';
import Rules from './components/Rules.vue';
import FileConfig from '@/components/FileConfig.vue';
import Cache from '@/components/Cache.vue';
import api from '@/services/api';
import type { ApiResponseStatus, Bank, Category, SubcategoriesByCategory, Type } from '@/types';

const tabs = [
  { id: 'convert', label: 'Convert & Categorize' },
  { id: 'multi', label: 'Convert Multiple Files' },
  { id: 'categories', label: 'Rules' },
  { id: 'file-config', label: 'File Config' },
  { id: 'cache', label: 'Cache Management' },
];

const apiStatus = ref<ApiResponseStatus>({
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const activeTab = ref('convert');

const banks = ref<Bank[]>([]);
const types = ref<Type[]>([]);
const categories = ref<Category[]>([]);
const subcategories = ref<SubcategoriesByCategory[]>([]);

onMounted(async () => {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const fileConfigs = await api.getAllFilesConfigs();
    banks.value = fileConfigs.map((config) => ({
      name: config.bankName,
    }));

    await getTypes();
    await getCategories();
    await getSubcategories();

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to get configurations.',
    };
  }
});

async function getTypes() {
  types.value = await api.getAllTypes();
}

async function getCategories() {
  categories.value = await api.getAllCategories();
}

async function getSubcategories() {
  const subcategoriesByCategory: SubcategoriesByCategory[] = [];

  for (let index = 0; index < categories.value.length; index++) {
    const category = categories.value[index];
    const subcategories = await api.getSubcategoriesByCategory(category.category);
    subcategoriesByCategory.push({ category: category.category, subcategories: subcategories });
  }

  subcategories.value = subcategoriesByCategory;
}
</script>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 20px;
  text-align: center;

  .header-content {
    max-width: 800px;
    margin: 0 auto;

    h1 {
      margin: 0;
      font-size: 70px;
      font-weight: 700;
      margin-bottom: 8px;
      display: 'inline';
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
  }
}

.app-main {
  flex: 1;
  padding: 40px 20px;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 8px 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 0;
  overflow-x: auto;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: #6b7280;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;

  &:hover:not(.active) {
    background: #f3f4f6;
    color: #6b7280;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-color: transparent;
  }
}

.tab-body {
  margin-bottom: 40px;
  background: white;
  border-radius: 0 0px 12px 12px;
  padding: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 13px;

  p {
    margin: 0;
  }
}
</style>
