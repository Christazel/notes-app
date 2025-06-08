import HomeView from '../views/home-view';
import HomePresenter from '../presenters/home-presenter';
import FavoritesPresenter from '../presenters/favorites-presenter';
import FavoriteDB from '../utils/idb'; // pastikan path ini sesuai strukturmu

export default class HomePage {
  async render() {
    return `
      ${HomeView.renderContainer()}
      <section class="container">
        <h2>Cerita Dummy</h2>
        <p>Ini adalah cerita dummy untuk pengujian fitur Simpan Favorit.</p>
        <div id="favoriteButtonContainer"></div>

        <div style="margin-top: 16px;">
          <button id="testNotification" class="favorite-button">🔔 Uji Notifikasi</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    HomePresenter.init();

    const story = {
      id: 'dummy-cerita-1',
      title: 'Cerita Dummy',
      body: 'Ini adalah cerita dummy untuk pengujian fitur favorit.'
    };

    // Inisialisasi tombol favorit
    await FavoritesPresenter.init({ story });

    await HomeView.setupPushNotification();

    // Tombol Notifikasi Lokal (hanya simulasi)
    const testButton = document.getElementById('testNotification');
    if (testButton) {
      testButton.addEventListener('click', async () => {
        if ('Notification' in window && Notification.permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification('Notifikasi Lokal', {
            body: 'Ini notifikasi dari tombol Uji!',
            icon: '/images/icon-192.png',
            badge: '/images/icon-512.png',
          });
        } else {
          console.warn('[Notifikasi] ❌ Izin belum diberikan atau tidak tersedia.');
        }
      });
    }

    // BONUS: tampilkan status data favorit di konsol
    const savedData = await FavoriteDB.get(story.id);
    console.log('Status Favorit:', savedData ? 'Tersimpan' : 'Belum tersimpan');
  }
}
