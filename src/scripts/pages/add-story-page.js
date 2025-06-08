// src/pages/add-story-page.js

import AddStoryView from '../views/add-story-view';
import { AddStoryPresenter } from '../presenters/add-story-presenter';
import FavoriteDB from '../utils/idb';

export default class AddStoryPage {
  constructor() {
    this.view = AddStoryView;
  }

  async render() {
    return this.view.renderForm();
  }

  async afterRender() {
    const presenter = new AddStoryPresenter(this.view);
    this.view.afterRender(presenter);

    const saveButton = document.getElementById('saveFavoriteFromAdd');
    if (saveButton) {
      saveButton.addEventListener('click', async () => {
        const title = document.getElementById('titleInput')?.value?.trim();
        const body = document.getElementById('descriptionInput')?.value?.trim();
        const photoElement = document.getElementById('previewImage');

        if (!title || !body || !photoElement?.src || photoElement.src.includes('placeholder')) {
          alert('Mohon lengkapi judul, deskripsi, dan unggah gambar terlebih dahulu.');
          return;
        }

        // Konversi gambar menjadi base64 data URL agar dapat disimpan
        const photoDataUrl = photoElement.src;

        const storyData = {
          id: `story-${Date.now()}`,
          title,
          body,
          photoUrl: photoDataUrl,
          createdAt: new Date().toISOString()
        };

        try {
          await FavoriteDB.put(storyData);
          alert('Cerita berhasil disimpan ke favorit!');
        } catch (error) {
          console.error('Gagal menyimpan ke favorit:', error);
          alert('Terjadi kesalahan saat menyimpan cerita ke favorit.');
        }
      });
    }
  }
}
