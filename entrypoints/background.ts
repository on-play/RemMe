export default defineBackground(() => {
  console.log('[RemMe] Background service worker started');

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_EMAIL') {
      handleSaveEmail(message.data, sender.tab?.id)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
    }

    if (message.type === 'CHECK_EMAIL_EXISTS') {
      handleCheckEmail(message.domain)
        .then((exists) => sendResponse({ exists }))
        .catch(() => sendResponse({ exists: false }));
      return true;
    }

    if (message.type === 'OPEN_POPUP') {
      chrome.action.openPopup();
      sendResponse({ success: true });
      return true;
    }
  });
});

async function handleSaveEmail(data: { domain: string; email: string; provider: string; notes?: string }, tabId?: number) {
  // Import service dynamically to avoid issues in background context
  const { emailTrackerService } = await import('../core/services');
  const { EmailProvider } = await import('../core/models');

  await emailTrackerService.saveEmail(
    data.domain,
    data.email,
    data.provider as EmailProvider,
    data.notes
  );

  console.log('[RemMe] Email saved:', data);
}

async function handleCheckEmail(domain: string) {
  const { emailTrackerService } = await import('../core/services');
  return await emailTrackerService.hasEmail(domain);
}

