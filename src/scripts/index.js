import '../styles/styles.css';
import App from './pages/app';
import requestPermissionAndSubscribe from './utils/push-notification';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  await registerServiceWorker();
  const app = new App({
    content: document.querySelector('#mainContent'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#mainContent');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      skipLink.blur();
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }

  requestPermissionAndSubscribe(); // ✅ Aktifkan push notification

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
