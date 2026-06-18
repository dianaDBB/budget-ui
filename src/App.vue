<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title" data-testid="app-title">Budget</h1>
        <p class="app-subtitle" data-testid="app-subtitle">Unify different bank extracts to a standardized format</p>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="intro-section">
          <h2 data-testid="intro-header">Welcome to Budget Application</h2>
          <p data-testid="intro-desc">
            Convert different extract files from your bank account to a standardized format. Choose to convert
            individual bank files or process multiple banks at once.
          </p>
        </div>

        <!-- Loading / error state for bank configurations -->
        <div v-if="banksLoading" class="banks-status" data-testid="banks-loading">Loading banks…</div>
        <div v-else-if="banksError" class="banks-status banks-status--error" data-testid="banks-error">
          {{ banksError }}
        </div>

        <template v-else>
          <!-- Multiple File Conversion -->
          <section class="converters-section" data-testid="multi-file-section">
            <h2 class="section-title" data-testid="main-header">Multiple File Conversion</h2>
            <MultiFileConverter :banks="banks" />
          </section>

          <!-- Single File Conversion -->
          <section class="converters-section" data-testid="single-file-section">
            <h2 class="section-title" data-testid="main-header">Single File Conversion</h2>
            <div class="converters-grid">
              <SingleFileConverter v-for="bank in banks" :key="bank.id" :bank="bank" />
            </div>
          </section>

          <!-- Admin -->
          <section class="converters-section" data-testid="admin-section">
            <h2 class="section-title" data-testid="admin-header">Admin</h2>
            <AdminPanel />
          </section>
        </template>
      </div>
    </main>

    <footer class="app-footer">
      <p data-testid="footer">&copy; 2024 Budget. Process your bank statements with ease.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SingleFileConverter from '@/components/SingleFileConverter.vue';
import MultiFileConverter from '@/components/MultiFileConverter.vue';
import AdminPanel from '@/components/AdminPanel.vue';
import api from '@/services/api';
import type { BankOption } from '@/types';

// Known banks get a dedicated logo; any other bank falls back to a generic icon.
const BANK_LOGOS: Record<string, string> = {
  ActivoBank: '/AB.png',
  CreditoAgricola: '/CA.png',
  CryptoCom: '/CY.png',
};

// Display names for known banks (API bankName → human-readable label)
const BANK_DISPLAY_NAMES: Record<string, string> = {
  ActivoBank: 'ActivoBank',
  CreditoAgricola: 'Crédito Agrícola',
  CryptoCom: 'Crypto.com',
};

const banks = ref<BankOption[]>([]);
const banksLoading = ref(true);
const banksError = ref<string | null>(null);

onMounted(async () => {
  try {
    const configs = await api.getAllBankConfigs();
    banks.value = configs.map((config) => ({
      id: config.bankName,
      name: BANK_DISPLAY_NAMES[config.bankName] ?? config.bankName,
      endpoint: `/budget/file/${config.bankName}`,
      description: `Convert ${config.bankName} ${config.fileFormat} files`,
      logo: BANK_LOGOS[config.bankName],
      icon: BANK_LOGOS[config.bankName] ? undefined : '🏦',
    }));
  } catch {
    banksError.value = 'Could not load bank configurations.';
  } finally {
    banksLoading.value = false;
  }
});
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
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .header-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .app-title {
    margin: 0;
    font-size: 70px;
    font-weight: 700;
    margin-bottom: 8px;
    display: 'inline';
  }

  .app-subtitle {
    margin: 0;
    font-size: 16px;
    opacity: 0.95;
  }
}

.app-main {
  flex: 1;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.intro-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    margin-top: 0;
    color: #1f2937;
    font-size: 24px;
  }

  p {
    color: #6b7280;
    font-size: 15px;
    line-height: 1.6;
  }
}

.banks-status {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  color: #6b7280;
  font-size: 15px;

  &--error {
    color: #c33;
  }
}

.converters-section {
  margin-bottom: 40px;

  .section-title {
    color: #1f2937;
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 20px 0;
  }
}

.converters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
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

@media (max-width: 768px) {
  .app-header {
    padding: 30px 15px;

    .app-title {
      font-size: 28px;
    }

    .app-subtitle {
      font-size: 14px;
    }
  }

  .app-main {
    padding: 20px 15px;
  }

  .intro-section {
    padding: 20px;

    h2 {
      font-size: 20px;
    }

    p {
      font-size: 14px;
    }
  }

  .converters-section {
    .section-title {
      font-size: 18px;
    }
  }

  .info-section {
    padding: 20px;

    h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
