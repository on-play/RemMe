export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('[RemMe] OAuth-aware content script loaded');

    let oauthDetected = false;
    const domain = window.location.hostname.replace(/^www\./, '');

    // Detect OAuth login attempts
    function detectOAuthButtons() {
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      
      buttons.forEach((button) => {
        if (button.dataset.remmeTracked) return;
        
        const text = button.textContent?.toLowerCase() || '';
        const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
        const className = button.className?.toLowerCase() || '';
        
        const isOAuthButton = 
          text.includes('sign in with') ||
          text.includes('log in with') ||
          text.includes('continue with') ||
          text.includes('login with') ||
          ariaLabel.includes('sign in with') ||
          className.includes('oauth') ||
          className.includes('google') ||
          className.includes('social');

        if (isOAuthButton) {
          button.dataset.remmeTracked = 'true';
          button.addEventListener('click', handleOAuthClick);
          console.log('[RemMe] OAuth button detected:', text.substring(0, 30));
        }
      });
    }

    function handleOAuthClick() {
      console.log('[RemMe] OAuth login initiated');
      oauthDetected = true;
      
      // Store in session storage to persist across redirects
      sessionStorage.setItem('remme_oauth_started', Date.now().toString());
      sessionStorage.setItem('remme_oauth_domain', domain);
    }

    // Try to find email on the page (after OAuth login, many sites display it)
    function scrapeEmailFromPage(): string | null {
      console.log('[RemMe] 🔍 Attempting to scrape email from page...');
      
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      
      // Strategy 1: Look for visible text containing emails
      const textNodes: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent?.trim();
        if (text && text.length < 100 && text.includes('@')) {
          textNodes.push(text);
        }
      }
      
      // Strategy 2: Check common selectors
      const selectors = [
        '[data-user-email]',
        '[data-email]',
        '.user-email',
        '.email',
        '[aria-label*="email" i]',
        '[title*="email" i]',
        'button[aria-label*="@"]',
        'div[class*="profile"]',
        'div[class*="user"]',
        'span[class*="email"]',
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.trim() || el.getAttribute('data-email') || el.getAttribute('data-user-email');
          if (text) textNodes.push(text);
        });
      }
      
      // Find emails in collected text
      const foundEmails: string[] = [];
      for (const text of textNodes) {
        const match = text.match(emailRegex);
        if (match) {
          foundEmails.push(match[0]);
          console.log('[RemMe] 📧 Found email in page:', match[0]);
        }
      }
      
      // Return the first valid email that's not a generic one
      const genericEmails = ['example@example.com', 'noreply@', 'support@'];
      for (const email of foundEmails) {
        const isGeneric = genericEmails.some(g => email.includes(g));
        if (!isGeneric) {
          console.log('[RemMe] ✓ Scraped email from page:', email);
          return email;
        }
      }
      
      console.log('[RemMe] ⚠️ No email found on page');
      return null;
    }

    // Check if we just came back from OAuth
    function checkOAuthReturn() {
      const oauthStarted = sessionStorage.getItem('remme_oauth_started');
      const oauthDomain = sessionStorage.getItem('remme_oauth_domain');
      
      console.log('[RemMe] checkOAuthReturn called - oauthStarted:', oauthStarted, 'oauthDomain:', oauthDomain, 'currentDomain:', domain);
      
      if (!oauthStarted || oauthDomain !== domain) {
        console.log('[RemMe] No OAuth session found for this domain');
        return;
      }
      
      const startTime = parseInt(oauthStarted);
      const now = Date.now();
      const elapsed = now - startTime;
      
      console.log('[RemMe] OAuth elapsed time:', elapsed, 'ms');
      
      // If OAuth was started in last 60 seconds, likely just returned
      if (elapsed < 60000) {
        console.log('[RemMe] ✓ Detected return from OAuth (within 60s window)');
        
        // Clear the flag
        sessionStorage.removeItem('remme_oauth_started');
        sessionStorage.removeItem('remme_oauth_domain');
        
        // Check if email already saved
        console.log('[RemMe] Checking if email already saved...');
        chrome.runtime.sendMessage({
          type: 'CHECK_EMAIL_EXISTS',
          domain: domain,
        }).then((response) => {
          console.log('[RemMe] Email exists check response:', response);
          if (!response.exists) {
            // Try to scrape email from page first
            const scrapedEmail = scrapeEmailFromPage();
            
            console.log('[RemMe] Email NOT saved, showing prompt in 2s...');
            setTimeout(() => {
              console.log('[RemMe] Now calling showOAuthSavePrompt() with email:', scrapedEmail || 'none');
              showOAuthSavePrompt(scrapedEmail || '');
            }, 2000);
          } else {
            console.log('[RemMe] Email already saved, skipping prompt');
          }
        }).catch((error) => {
          console.log('[RemMe] Error checking email, showing prompt anyway:', error);
          const scrapedEmail = scrapeEmailFromPage();
          setTimeout(() => {
            console.log('[RemMe] Now calling showOAuthSavePrompt() with email:', scrapedEmail || 'none');
            showOAuthSavePrompt(scrapedEmail || '');
          }, 2000);
        });
      } else {
        console.log('[RemMe] OAuth session too old:', elapsed, 'ms');
      }
    }

    function showOAuthSavePrompt(prefilledEmail: string = '') {
      console.log('[RemMe] 🎨 showOAuthSavePrompt() called with email:', prefilledEmail || 'empty');
      
      // Don't show if already showing
      if (document.getElementById('remme-oauth-prompt')) {
        console.log('[RemMe] ⚠️ Prompt already showing, skipping');
        return;
      }

      console.log('[RemMe] Creating notification container...');
      const container = document.createElement('div');
      container.id = 'remme-oauth-prompt';
      container.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2147483647;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 380px;
          animation: remmeSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div>
              <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">💾 Save Your Email</div>
              <div style="font-size: 13px; opacity: 0.9;">Quick save for <strong>${domain}</strong></div>
            </div>
            <button id="remme-close-x" style="
              background: rgba(255,255,255,0.2);
              border: none;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 18px;
              line-height: 1;
              transition: all 0.2s;
            ">×</button>
          </div>
          
          <div id="remme-form-container">
            <input 
              type="email" 
              id="remme-email-input"
              placeholder="your@email.com"
              style="
                width: 100%;
                padding: 10px 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                margin-bottom: 10px;
                box-sizing: border-box;
                font-family: inherit;
              "
              autocomplete="email"
            />
            <div style="display: flex; gap: 8px;">
              <button id="remme-save-quick" style="
                flex: 1;
                background: white;
                color: #667eea;
                border: none;
                padding: 10px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: transform 0.1s;
              ">Save</button>
              <button id="remme-dismiss" style="
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: transform 0.1s;
              ">Later</button>
            </div>
            <div id="remme-error" style="
              margin-top: 8px;
              font-size: 12px;
              color: #ffcccc;
              display: none;
            "></div>
          </div>
          
          <div id="remme-success-msg" style="display: none; text-align: center;">
            <div style="font-size: 40px; margin-bottom: 8px;">✓</div>
            <div style="font-size: 16px; font-weight: 600;">Saved!</div>
          </div>
        </div>
      `;

      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes remmeSlideIn {
          from {
            transform: translateX(450px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes remmeSlideOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(450px) scale(0.8);
            opacity: 0;
          }
        }
        #remme-oauth-prompt button:hover {
          transform: scale(1.05);
        }
        #remme-oauth-prompt button:active {
          transform: scale(0.95);
        }
        #remme-email-input:focus {
          outline: 2px solid white;
          outline-offset: 2px;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(container);
      
      console.log('[RemMe] ✅ Notification added to page! Should be visible now.');

      // Wire up events
      const emailInput = document.getElementById('remme-email-input') as HTMLInputElement;
      const saveBtn = document.getElementById('remme-save-quick');
      const dismissBtn = document.getElementById('remme-dismiss');
      const closeBtn = document.getElementById('remme-close-x');
      const errorDiv = document.getElementById('remme-error')!;
      const formContainer = document.getElementById('remme-form-container')!;
      const successMsg = document.getElementById('remme-success-msg')!;

      // Pre-fill email if we scraped it from the page
      if (prefilledEmail && emailInput) {
        emailInput.value = prefilledEmail;
        if (saveBtn) {
          saveBtn.textContent = 'Confirm & Save';
        }
        console.log('[RemMe] ✅ Pre-filled email input with scraped email');
      }

      // Auto-focus email input
      setTimeout(() => emailInput?.focus(), 100);

      function closePrompt() {
        const prompt = document.getElementById('remme-oauth-prompt');
        if (prompt) {
          const mainDiv = prompt.firstElementChild as HTMLElement;
          mainDiv.style.animation = 'remmeSlideOut 0.3s ease-out';
          setTimeout(() => prompt.remove(), 300);
        }
      }

      function showError(message: string) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
      }

      function hideError() {
        errorDiv.style.display = 'none';
      }

      async function handleSave() {
        const email = emailInput.value.trim();
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          showError('Please enter your email');
          emailInput.focus();
          return;
        }
        
        if (!emailRegex.test(email)) {
          showError('Please enter a valid email');
          emailInput.focus();
          return;
        }

        hideError();
        saveBtn!.textContent = 'Saving...';
        saveBtn!.setAttribute('disabled', 'true');

        // Auto-detect provider
        const provider = detectProvider(email);

        try {
          const response = await chrome.runtime.sendMessage({
            type: 'SAVE_EMAIL',
            data: {
              domain: domain,
              email: email,
              provider: provider,
              notes: 'Saved after OAuth login'
            }
          });

          if (response.success) {
            // Show success
            formContainer.style.display = 'none';
            successMsg.style.display = 'block';
            
            // Close after 1.5 seconds
            setTimeout(closePrompt, 1500);
          } else {
            showError('Failed to save. Please try again.');
            saveBtn!.textContent = 'Save';
            saveBtn!.removeAttribute('disabled');
          }
        } catch (error) {
          console.error('[RemMe] Save error:', error);
          showError('Error saving. Please try again.');
          saveBtn!.textContent = 'Save';
          saveBtn!.removeAttribute('disabled');
        }
      }

      function detectProvider(email: string): string {
        const domain = email.split('@')[1]?.toLowerCase();
        const providerMap: Record<string, string> = {
          'gmail.com': 'Google',
          'googlemail.com': 'Google',
          'outlook.com': 'Outlook',
          'hotmail.com': 'Outlook',
          'live.com': 'Outlook',
          'yahoo.com': 'Yahoo',
          'ymail.com': 'Yahoo',
          'protonmail.com': 'ProtonMail',
          'proton.me': 'ProtonMail',
          'pm.me': 'ProtonMail',
          'icloud.com': 'iCloud',
          'me.com': 'iCloud',
          'mac.com': 'iCloud',
        };
        return providerMap[domain] || 'Custom';
      }

      saveBtn?.addEventListener('click', handleSave);
      dismissBtn?.addEventListener('click', closePrompt);
      closeBtn?.addEventListener('click', closePrompt);
      
      // Submit on Enter
      emailInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSave();
        }
      });

      // Auto-dismiss after 30 seconds
      setTimeout(closePrompt, 30000);
    }

    // Detect traditional email/password forms
    let lastDetectedEmail = '';
    
    function detectEmailForms() {
      const emailInputs = document.querySelectorAll<HTMLInputElement>(
        'input[type="email"], input[name*="email" i], input[id*="email" i], input[autocomplete="email"], ' +
        'input[autocomplete="username"], input[name="login"], input[id="login_field"], ' +
        'input[name="username"], input[id="username"], input[type="text"][name*="login" i]'
      );

      // Filter out RemMe's own inputs from debug output
      const realInputs = Array.from(emailInputs).filter(input => 
        input.id !== 'remme-email-input' && !input.closest('#remme-oauth-prompt')
      );
      
      console.log('[RemMe] Found username/email inputs:', realInputs.length);
      
      // Debug: show what we found
      realInputs.forEach((input, i) => {
        console.log(`[RemMe] Input ${i + 1}:`, {
          type: input.type,
          name: input.name,
          id: input.id,
          autocomplete: input.autocomplete
        });
      });

      emailInputs.forEach((input) => {
        if (input.dataset.remmeTracked) return;
        
        // Skip RemMe's own inputs!
        if (input.id === 'remme-email-input' || input.closest('#remme-oauth-prompt')) {
          return;
        }
        
        input.dataset.remmeTracked = 'true';

        // Capture email on blur (when user leaves the field)
        input.addEventListener('blur', () => {
          const value = input.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (value && emailRegex.test(value)) {
            lastDetectedEmail = value;
            console.log('[RemMe] Email captured from input:', value);
          } else if (value && value.length > 3) {
            // Might be username, still capture it
            console.log('[RemMe] Username/value captured (might be email on submit):', value.substring(0, 20) + '...');
          }
        });

        // Capture email on input (as they type)
        input.addEventListener('input', () => {
          const value = input.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (value && emailRegex.test(value)) {
            lastDetectedEmail = value;
            console.log('[RemMe] Email detected while typing');
          }
        });

        const form = input.closest('form');
        if (form && !form.dataset.remmeTracked) {
          form.dataset.remmeTracked = 'true';
          
          // Method 1: Form submit event
          form.addEventListener('submit', (e) => {
            handleFormSubmit(input);
          });

          // Method 2: Click on submit button
          const submitButtons = form.querySelectorAll<HTMLElement>(
            'button[type="submit"], input[type="submit"], button:not([type="button"])'
          );
          
          submitButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
              console.log('[RemMe] Submit button clicked');
              setTimeout(() => handleFormSubmit(input), 100);
            });
          });

          // Method 3: Enter key in password field
          const passwordInputs = form.querySelectorAll('input[type="password"]');
          passwordInputs.forEach((pwdInput) => {
            pwdInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                console.log('[RemMe] Enter pressed in password field');
                setTimeout(() => handleFormSubmit(input), 100);
              }
            });
          });
        }
      });
    }

    async function handleFormSubmit(emailInput: HTMLInputElement) {
      const email = emailInput.value.trim() || lastDetectedEmail;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      console.log('[RemMe] Form submission detected, email/username:', email ? email.substring(0, 30) + '...' : 'none');
      
      // Check if already saved first
      const response = await chrome.runtime.sendMessage({
        type: 'CHECK_EMAIL_EXISTS',
        domain: domain,
      }).catch(() => ({ exists: false }));

      if (response.exists) {
        console.log('[RemMe] Email already saved for this domain');
        return;
      }

      if (email && emailRegex.test(email)) {
        // Valid email - store it
        sessionStorage.setItem('remme_detected_email', email);
        sessionStorage.setItem('remme_form_submit_time', Date.now().toString());
        console.log('[RemMe] ✓ Valid email stored for post-login prompt');
      } else if (email) {
        // Might be username - still show prompt but without pre-fill
        sessionStorage.setItem('remme_detected_email', '');
        sessionStorage.setItem('remme_form_submit_time', Date.now().toString());
        console.log('[RemMe] ⚠ Not an email (might be username), will show empty prompt');
      } else {
        // No email at all - still show prompt
        sessionStorage.setItem('remme_detected_email', '');
        sessionStorage.setItem('remme_form_submit_time', Date.now().toString());
        console.log('[RemMe] ℹ No email detected, will show empty prompt after login');
      }
    }

    function checkFormSubmission() {
      const detectedEmail = sessionStorage.getItem('remme_detected_email');
      const submitTime = sessionStorage.getItem('remme_form_submit_time');
      
      if (!detectedEmail || !submitTime) return;
      
      const elapsed = Date.now() - parseInt(submitTime);
      
      // If submitted in last 30 seconds, show prompt
      if (elapsed < 30000) {
        sessionStorage.removeItem('remme_detected_email');
        sessionStorage.removeItem('remme_form_submit_time');
        
        // Show save prompt with pre-filled email
        showEmailSavePrompt(detectedEmail);
      }
    }

    function showEmailSavePrompt(prefilledEmail: string = '') {
      // Don't show if already showing
      if (document.getElementById('remme-oauth-prompt')) return;

      // Use the same notification but with pre-filled email
      showOAuthSavePrompt();
      
      // Pre-fill the email if provided
      if (prefilledEmail) {
        setTimeout(() => {
          const emailInput = document.getElementById('remme-email-input') as HTMLInputElement;
          if (emailInput) {
            emailInput.value = prefilledEmail;
            
            // Auto-submit if email is valid
            const saveBtn = document.getElementById('remme-save-quick');
            if (saveBtn) {
              saveBtn.textContent = 'Confirm & Save';
            }
          }
        }, 100);
      }
    }

    // Check for page navigation (after successful login)
    function checkPageNavigation() {
      // Check on page load
      if (document.readyState === 'complete') {
        checkFormSubmission();
        checkOAuthReturn();
      } else {
        window.addEventListener('load', () => {
          checkFormSubmission();
          checkOAuthReturn();
        });
      }
    }

    // Initialize
    detectOAuthButtons();
    detectEmailForms();
    checkPageNavigation();

    // Re-detect on DOM changes (for SPAs)
    const observer = new MutationObserver(() => {
      detectOAuthButtons();
      detectEmailForms();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for visibility change (tab becomes active after auth)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('[RemMe] Tab became visible, checking for saved emails...');
        setTimeout(() => {
          checkFormSubmission();
          checkOAuthReturn();
        }, 500);
      }
    });

    console.log('[RemMe] OAuth detection active');
    console.log('[RemMe] Traditional form detection active');
  },
});
