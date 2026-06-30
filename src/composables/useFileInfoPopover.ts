import { reactive } from 'vue';
import type { Bank } from '@/types';

type FormatData = {
  html: string;
  fileFormat: string;
};

export function useFileInfoPopover() {
  const state = reactive({
    open: false,
    loading: false,
    error: null as string | null,
    bank: null as Bank | null,
    format: null as FormatData | null,
  });

  function open(bank: Bank) {
    state.open = true;
    state.loading = true;
    state.error = null;
    state.bank = bank;
    state.format = null;
  }

  function close() {
    state.open = false;
  }

  async function load(loadFn: (bank: Bank) => Promise<FormatData>) {
    if (!state.bank) return;

    try {
      state.format = await loadFn(state.bank);
    } catch {
      state.error = 'Could not load format info.';
    } finally {
      state.loading = false;
    }
  }

  return {
    state,
    open,
    close,
    load,
  };
}
