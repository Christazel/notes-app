
import FavoriteDB from '../utils/idb.js';

export default class FavoritePage {
  async render() {
    return `
      <section class="container">
        <h1>Cerita Favorit</h1>
        <div id="favorites-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('favorites-list');
    const favorites = await FavoriteDB.getAll();

    if (!favorites.length) {
      container.innerHTML = '<p>Belum ada cerita favorit.</p>';
      return;
    }

    container.innerHTML = favorites.map((story) => `
      <article class="story-card">
        <img src="${story.photoUrl}" alt="Foto ${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleDateString()}</small>
        <button class="favorite-button" data-id="${story.id}">❌ Hapus dari Favorit</button>
      </article>
    `).join('');

    container.querySelectorAll('.favorite-button').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await FavoriteDB.delete(id);
        await this.afterRender(); // refresh after delete
      });
    });
  }
}
