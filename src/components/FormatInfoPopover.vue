<template>
  <div class="format-popover" @click.self="emit('close')">
    <div class="format-popover-content" data-testid="format-info-popover" :style="{ maxWidth }">
      <div class="format-popover-header">
        <span><slot name="title" /></span>
        <button class="close-btn" data-testid="close-button" @click="emit('close')">✕</button>
      </div>
      <div class="format-popover-body">
        <div v-if="loading" class="format-loading">Loading…</div>
        <div v-else-if="error" class="format-error">{{ error }}</div>
        <slot v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  error: string | null;
  maxWidth?: string;
}

withDefaults(defineProps<Props>(), {
  maxWidth: '700px',
});

const emit = defineEmits<{ close: [] }>();
</script>

<style scoped lang="scss">
.format-popover {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  .format-popover-content {
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .format-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
      opacity: 0.8;
      flex-shrink: 0;

      &:hover {
        opacity: 1;
      }
    }
  }

  .format-popover-body {
    padding: 16px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .format-loading,
  .format-error {
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 20px;
  }

  .format-error {
    color: #c33;
  }
}
</style>
