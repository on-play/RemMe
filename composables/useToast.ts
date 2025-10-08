import { ref } from 'vue';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = ref<Toast[]>([]);
let nextId = 1;

/**
 * useToast composable
 * Simple toast notification system
 */
export function useToast() {
  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = nextId++;
    toasts.value.push({ id, message, type });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3000);
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return {
    toasts,
    showToast,
    removeToast,
  };
}

