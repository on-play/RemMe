<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useEmailTracker } from '../../composables/useEmailTracker';
import { useToast } from '../../composables/useToast';
import { EmailProvider } from '../../core/models';

const {
  currentRecord,
  currentDomain,
  loading,
  error,
  hasEmail,
  loadCurrentTab,
  saveEmail,
  deleteEmail,
  suggestProvider,
} = useEmailTracker();

const { showToast } = useToast();

// Form state
const showForm = ref(false);
const email = ref('');
const provider = ref<EmailProvider>(EmailProvider.Google);
const notes = ref('');
const isSubmitting = ref(false);

const providers = computed(() => Object.values(EmailProvider));

const emailError = ref('');

onMounted(async () => {
  await loadCurrentTab();
});

function validateEmail() {
  if (!email.value) {
    emailError.value = '';
    return;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
    // Auto-suggest provider
    provider.value = suggestProvider(email.value);
  }
}

async function handleSave() {
  validateEmail();

  if (emailError.value || !email.value) return;

  isSubmitting.value = true;

  try {
    await saveEmail({
      email: email.value.trim(),
      provider: provider.value,
      notes: notes.value.trim() || undefined,
    });

    showToast('Email saved successfully!', 'success');
    showForm.value = false;
    email.value = '';
    notes.value = '';
  } catch (err) {
    showToast('Failed to save email', 'error');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete() {
  if (!confirm(`Delete email for ${currentDomain.value}?`)) return;

  try {
    await deleteEmail();
    showToast('Email deleted', 'success');
  } catch (err) {
    showToast('Failed to delete email', 'error');
  }
}

async function copyEmail() {
  if (!currentRecord.value) return;

  try {
    await navigator.clipboard.writeText(currentRecord.value.email);
    showToast('Email copied to clipboard', 'success');
  } catch (err) {
    showToast('Failed to copy email', 'error');
  }
}
</script>

<template>
  <div class="w-[400px] min-h-[300px] p-4 bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">RemMe</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Remember your emails</p>
      </div>
    </header>

    <!-- Current Domain Display -->
    <div v-if="currentDomain" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p class="text-xs text-gray-600 dark:text-gray-400">Current site:</p>
      <p class="font-medium text-gray-900 dark:text-white truncate">{{ currentDomain }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Email Exists: Show Card -->
    <div v-else-if="hasEmail && currentRecord" class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">You used:</p>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-lg font-semibold text-gray-900 dark:text-white break-all">
          {{ currentRecord.email }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ currentRecord.provider }} • Added {{ new Date(currentRecord.dateAdded).toLocaleDateString() }}
        </p>
      </div>

      <div v-if="currentRecord.notes" class="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <p class="text-sm text-gray-600 dark:text-gray-300 italic">
          "{{ currentRecord.notes }}"
        </p>
      </div>

      <div class="flex space-x-2">
        <button
          @click="copyEmail"
          class="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          Copy Email
        </button>

        <button
          @click="handleDelete"
          class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- No Email: Show Form or Empty State -->
    <div v-else class="text-center py-8">
      <div v-if="!showForm">
        <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No email saved
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Which email did you use for <strong>{{ currentDomain }}</strong>?
        </p>

        <button
          @click="showForm = true"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Email
        </button>
      </div>

      <form v-else @submit.prevent="handleSave" class="text-left space-y-4">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            @blur="validateEmail"
            @input="validateEmail"
            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            :class="{
              'border-gray-300 dark:border-gray-600': !emailError,
              'border-red-500': emailError
            }"
            autocomplete="email"
            autofocus
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-600 dark:text-red-400">
            {{ emailError }}
          </p>
        </div>

        <!-- Provider Select -->
        <div>
          <label for="provider" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Provider *
          </label>
          <select
            id="provider"
            v-model="provider"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="p in providers" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </div>

        <!-- Notes (Optional) -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            v-model="notes"
            placeholder="e.g., Work account, Personal, etc."
            rows="2"
            maxlength="500"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ notes.length }}/500
          </p>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2 pt-2">
          <button
            type="submit"
            :disabled="!email || !!emailError || isSubmitting"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Email' }}
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

