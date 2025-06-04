const HomeView = {
  renderContainer() {
    return `
      <section id="mainContent" class="container">
        <h1>Daftar Cerita</h1>
        <div id="push-notification-tools"></div>
        <div id="stories" class="story-list"></div>

        <h2>Peta Lokasi Cerita</h2>
        <div id="storyMap" style="height: 400px; margin-top: 16px;"></div>
      </section>
    `;
  },

  showStories(stories) {
    const container = document.querySelector('#stories');
    container.innerHTML = '';
    stories.forEach((story) => {
      const storyElement = document.createElement('article');
      storyElement.classList.add('story-card');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleDateString()}</small>
        <div class="favorite-action" id="favorite-${story.id}"></div>
      `;
      container.appendChild(storyElement);
    });

    // Setelah elemen ditambahkan, pasang tombol favorit
    stories.forEach((story) => {
      const favContainer = document.querySelector(`#favorite-${story.id}`);
      if (favContainer) {
        import('../presenters/favorites-presenter.js').then((module) => {
          module.default.init({ story, container: favContainer });
        });
      }
    });
  },

  showMapMarkers(stories) {
    const map = L.map('storyMap').setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  },

  showError(message) {
    const container = document.querySelector('#stories');
    container.innerHTML = `<p style="color:red;">${message}</p>`;
  },
};

export default HomeView;


import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../utils/notification-helper.js';

import {
  generateSubscribeButtonTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates/notification-template.js';

HomeView.setupPushNotification = async function () {
  const container = document.getElementById('push-notification-tools');
  const isSubscribed = await isCurrentPushSubscriptionAvailable();

  if (isSubscribed) {
    container.innerHTML = generateUnsubscribeButtonTemplate();
    document.getElementById('unsubscribe-button').addEventListener('click', async () => {
      await unsubscribe();
      await this.setupPushNotification();
    });
  } else {
    container.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', async () => {
      await subscribe();
      await this.setupPushNotification();
    });
  }
};
