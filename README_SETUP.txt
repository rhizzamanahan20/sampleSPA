SPARADISE EmailJS FIX — GitHub Pages

1. Upload index.html, script.js, styles.css, emailjs-config.js directly to repository root. DO NOT upload the folder itself.
2. Keep your existing image files (logo.jpg, spa-hero.png, massage-treatment.jpg, hotstone-massage.jpg, official-menu.jpg) in the SAME root folder.
3. Remove/replace any old versions of these four files. GitHub Pages must serve index.html from the configured branch/root.
4. Wait for GitHub Actions Pages deployment to complete, then hard refresh (Ctrl+Shift+R).
5. Open browser DevTools > Network and submit a test booking. You should see api.emailjs.com, NOT formsubmit.co.
6. Verify Gmail service and template recipient in EmailJS. Test email delivery.

The form sends via EmailJS and does not automatically confirm appointments. No real email was sent during preparation.
