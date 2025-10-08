<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { emailTrackerService } from '../../core/services';
import { useToast } from '../../composables/useToast';
import type { EmailRecord, DomainStats } from '../../core/models';

const { showToast } = useToast();

const records = ref<EmailRecord[]>([]);
const stats = ref<DomainStats | null>(null);
const loading = ref(true);
const searchQuery = ref('');

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value;

  const query = searchQuery.value.toLowerCase();
  return records.value.filter((record) =>
    record.domain.toLowerCase().includes(query) ||
    record.email.toLowerCase().includes(query) ||
    record.notes?.toLowerCase().includes(query) ||
    record.provider.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await loadRecords();
});

async function loadRecords() {
  loading.value = true;
  try {
    records.value = await emailTrackerService.searchRecords('');
    stats.value = await emailTrackerService.getStats();
  } catch (error) {
    showToast('Failed to load records', 'error');
  } finally {
    loading.value = false;
  }
}

async function handleDelete(domain: string) {
  if (!confirm(`Delete email for ${domain}?`)) return;

  try {
    await emailTrackerService.deleteEmail(domain);
    await loadRecords();
    showToast('Record deleted', 'success');
  } catch (error) {
    showToast('Failed to delete record', 'error');
  }
}

async function handleExport() {
  try {
    const json = await emailTrackerService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `remme-backup-${new Date().toISOString().split('T')[0]}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
  } catch (error) {
    showToast('Failed to export data', 'error');
  }
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();
    const count = await emailTrackerService.importData(text);
    await loadRecords();
    showToast(`Imported ${count} records`, 'success');
  } catch (error) {
    showToast('Failed to import data', 'error');
  }

  // Reset file input
  input.value = '';
}

async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard', 'success');
  } catch (error) {
    showToast('Failed to copy email', 'error');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">RemMe - Manage Emails</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          View and manage all your saved email-to-website mappings
        </p>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Stats Section -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ stats.totalRecords }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Emails</h3>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ stats.uniqueEmails }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used</h3>
          <p class="text-lg font-semibold text-gray-900 dark:text-white mt-2 truncate" :title="stats.mostUsedEmail">
            {{ stats.mostUsedEmail || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by domain, email, or notes..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="handleExport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export
            </button>

            <label class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Import
              <input
                type="file"
                accept=".json"
                @change="handleImport"
                class="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Records List -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading records...</p>
      </div>

      <div v-else-if="filteredRecords.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'No results found' : 'No records yet. Visit a website and save your first email!' }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="record in filteredRecords"
          :key="record.domain"
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ record.domain }}
                </h3>
                <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                  {{ record.provider }}
                </span>
              </div>

              <p class="text-gray-700 dark:text-gray-300 font-medium break-all mb-1">
                {{ record.email }}
              </p>

              <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                <span>Added {{ new Date(record.dateAdded).toLocaleDateString() }}</span>
                <span v-if="record.lastUsed">
                  • Last used {{ new Date(record.lastUsed).toLocaleDateString() }}
                </span>
              </div>

              <p v-if="record.notes" class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                "{{ record.notes }}"
              </p>
            </div>

            <div class="flex space-x-2 ml-4">
              <button
                @click="copyEmail(record.email)"
                class="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title="Copy email"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>

              <button
                @click="handleDelete(record.domain)"
                class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>All data is stored locally in your browser. No external servers involved.</p>
        <p class="mt-1">
          Showing {{ filteredRecords.length }} of {{ records.length }} records
        </p>
      </div>
    </main>
  </div>
</template>

