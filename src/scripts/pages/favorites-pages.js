import FavoriteDB from '../utils/idb.js';

const FavoritesPage = {
  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita Favorit</h1>
        <div id="favoritesList" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('favoritesList');
    const favorites = await FavoriteDB.getAll();

    if (!favorites.length) {
      container.innerHTML = '<p>Belum ada cerita favorit disimpan.</p>';
      return;
    }

    favorites.forEach((story) => {
      const item = document.createElement('div');
      item.classList.add('story-item', 'card');

      item.innerHTML = `
        <h3>${story.title}</h3>
        <p>${story.body}</p>
        <button class="delete-favorite" data-id="${story.id}">
          🗑️ Hapus dari Favorit
        </button>
      `;

      container.appendChild(item);
    });

    // Tambahkan event listener tombol hapus
    document.querySelectorAll('.delete-favorite').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await FavoriteDB.delete(id);
        e.target.parentElement.remove();

        const remaining = await FavoriteDB.getAll();
        if (!remaining.length) {
          container.innerHTML = '<p>Belum ada cerita favorit disimpan.</p>';
        }
      });
    });
  }
};
    
export default FavoritesPage;
