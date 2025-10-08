import { ref, computed } from 'vue';
import { emailTrackerService } from '../core/services';
import { EmailRecordRules } from '../core/validators';
import type { EmailRecord, EmailProvider } from '../core/models';

/**
 * useEmailTracker composable
 * Reactive business logic for email tracking
 */
export function useEmailTracker() {
  const currentRecord = ref<EmailRecord | undefined>();
  const currentDomain = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  const hasEmail = computed(() => !!currentRecord.value);

  /**
   * Load current tab and check for existing email
   */
  async function loadCurrentTab() {
    loading.value = true;
    error.value = null;

    try {
      const tab = await emailTrackerService.getCurrentTab();
      if (!tab) {
        error.value = 'Could not get current tab';
        return;
      }

      currentDomain.value = emailTrackerService.extractDomain(tab.url);
      currentRecord.value = await emailTrackerService.getEmailForCurrentTab();

      // Mark as used if record exists
      if (currentRecord.value) {
        await emailTrackerService.markAsUsed(currentDomain.value);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tab';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Save new email for current domain
   */
  async function saveEmail(data: {
    email: string;
    provider: EmailProvider;
    notes?: string;
  }) {
    loading.value = true;
    error.value = null;

    try {
      await emailTrackerService.saveEmail(
        currentDomain.value,
        data.email,
        data.provider,
        data.notes,
      );

      // Reload to get updated record
      await loadCurrentTab();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update existing email record
   */
  async function updateEmail(updates: Partial<Omit<EmailRecord, 'domain' | 'dateAdded'>>) {
    loading.value = true;
    error.value = null;

    try {
      await emailTrackerService.updateEmail(currentDomain.value, updates);
      await loadCurrentTab();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete current email record
   */
  async function deleteEmail() {
    loading.value = true;
    error.value = null;

    try {
      await emailTrackerService.deleteEmail(currentDomain.value);
      currentRecord.value = undefined;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Suggest email provider based on email address
   */
  function suggestProvider(email: string): EmailProvider {
    return EmailRecordRules.suggestProvider(email);
  }

  return {
    currentRecord,
    currentDomain,
    loading,
    error,
    hasEmail,
    loadCurrentTab,
    saveEmail,
    updateEmail,
    deleteEmail,
    suggestProvider,
  };
}

