export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('[RemMe] Simple content script loaded');

    // Show test notification immediately after 2 seconds
    setTimeout(() => {
      console.log('[RemMe] Showing test notification');
      showTestNotification();
    }, 2000);

    function showTestNotification() {
      const domain = window.location.hostname.replace(/^www\./, '');
      
      const notification = document.createElement('div');
      notification.id = 'remme-test-notification';
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 400px;
        ">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">🎉 RemMe Works!</h3>
          <p style="margin: 0 0 15px 0; font-size: 14px;">
            This is the purple notification! You're on <strong>${domain}</strong>
          </p>
          <button id="remme-close-btn" style="
            background: white;
            color: #667eea;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          ">Close</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Add event listener for close button
      const closeBtn = document.getElementById('remme-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const notif = document.getElementById('remme-test-notification');
          if (notif) {
            notif.remove();
          }
        });
      }
      
      console.log('[RemMe] Notification added to page');
    }
  },
});

