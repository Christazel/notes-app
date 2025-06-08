
import FavoriteDB from '../utils/idb.js';

const FavoritePresenter = {
  async init({ story, container }) {
    if (!container) return;

    const existing = await FavoriteDB.get(story.id);

    container.innerHTML = `
      <button id="favorite-${story.id}" aria-label="${existing ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}" class="favorite-button">
        ${existing ? '💖 Hapus Favorit' : '🤍 Simpan Favorit'}
      </button>
    `;

    const button = document.getElementById(`favorite-${story.id}`);

    button.addEventListener('click', async () => {
      const found = await FavoriteDB.get(story.id);
      if (found) {
        await FavoriteDB.delete(story.id);
        button.textContent = '🤍 Simpan Favorit';
        button.setAttribute('aria-label', 'Tambah ke Favorit');
      } else {
        await FavoriteDB.put(story);
        button.textContent = '💖 Hapus Favorit';
        button.setAttribute('aria-label', 'Hapus dari Favorit');
      }
    });
  }
};

export default FavoritePresenter;
