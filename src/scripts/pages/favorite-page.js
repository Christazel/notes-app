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

    if (!favorites || favorites.length === 0) {
      container.innerHTML = '<p>Belum ada cerita favorit.</p>';
      return;
    }

    container.innerHTML = favorites
      .map((story) => {
        const displayTitle = story.name ?? story.title ?? 'Tanpa Judul';
        const displayBody = story.description ?? story.body ?? '';
        const displayImage = story.photoUrl ?? story.pictureId ?? './images/icon-192.png';
        const displayDate = story.createdAt
          ? new Date(story.createdAt).toLocaleDateString()
          : '';

        return `
          <article class="story-card">
            <img src="${displayImage}" alt="Foto ${displayTitle}" />
            <h3>${displayTitle}</h3>
            <p>${displayBody}</p>
            <small>${displayDate}</small>
            <button class="favorite-button" data-id="${story.id}">❌ Hapus dari Favorit</button>
          </article>
        `;
      })
      .join('');

    document.querySelectorAll('.favorite-button').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await FavoriteDB.delete(id);
        await this.afterRender(); // refresh setelah dihapus
      });
    });
  }
}
