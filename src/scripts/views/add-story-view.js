import FavoriteDB from '../utils/idb.js';

const AddStoryView = {
  mapInstance: null,
  selectedFile: null,
  stream: null,

  renderForm() {
    return `
      <section id="mainContent" class="container">
        <h1>Tambah Cerita Baru</h1>
        <form id="storyForm">
          <label for="description">Deskripsi Cerita:</label>
          <textarea id="description" name="description" rows="3" required></textarea>

          <label for="photo">Unggah Gambar (Choose File):</label>
          <input type="file" id="photo" accept="image/*" />

          <div class="camera-section">
            <label>Atau Ambil Gambar dari Kamera:</label>
            <video id="video" autoplay playsinline></video>
            <div class="camera-buttons">
              <button type="button" id="startCamera">Buka Kamera</button>
              <button type="button" id="capture" disabled>Ambil Foto</button>
              <button type="button" id="stopCamera" disabled>Tutup Kamera</button>
            </div>
            <canvas id="canvas" style="display: none;"></canvas>
          </div>

          <label>Pilih Lokasi:</label>
          <div id="map"></div>

          <input type="hidden" id="lat" />
          <input type="hidden" id="lon" />

          <button type="submit">Kirim Cerita</button>
          <button type="button" id="saveFavorite">❤️ Simpan ke Favorit</button>
        </form>
        <p id="responseMessage"></p>
      </section>
    `;
  },

  afterRender(presenter) {
    presenter.init();

    const saveBtn = document.getElementById('saveFavorite');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const description = document.getElementById('description').value;
        if (!description) {
          alert('⚠️ Deskripsi kosong, isi dulu sebelum menyimpan!');
          return;
        }

        const storyId = btoa(description).slice(0, 10); // ID unik
        const storyData = {
          id: storyId,
          title: description.slice(0, 20) + '...',
          body: description,
        };

        const existing = await FavoriteDB.get(storyId);
        if (existing) {
          AddStoryView._showToast('❤️ Cerita sudah ada di favorit!');
          return;
        }

        await FavoriteDB.put(storyData);
        AddStoryView._showToast('✅ Cerita disimpan ke favorit!');
      });
    }

    window.addEventListener('hashchange', () => {
      this.clearCamera();
    });
  },

  _showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  },

  initCamera({ onStart, onStop, onCapture }) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const start = document.getElementById('startCamera');
    const capture = document.getElementById('capture');
    const stop = document.getElementById('stopCamera');

    start.addEventListener('click', async () => {
      await onStart(video, capture, stop);
      this.stream = video.srcObject;
    });

    stop.addEventListener('click', () => {
      onStop();
      this.stream = null;
    });

    capture.addEventListener('click', () => {
      onCapture(canvas, video, (file) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const photoInput = document.getElementById('photo');
        photoInput.files = dataTransfer.files;
        this.selectedFile = file;
      });
    });
  },

  initMap(onSelectLocation) {
    this.mapInstance = L.map('map').setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mapInstance);

    this.mapInstance.on('click', (e) => {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    });
  },

  getMapInstance() {
    return this.mapInstance;
  },

  setCoordinates(lat, lon) {
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
  },

  initForm(onSubmit) {
    const form = document.getElementById('storyForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      const photo = document.getElementById('photo').files[0];
      const lat = document.getElementById('lat').value;
      const lon = document.getElementById('lon').value;
      await onSubmit({ description, photo, lat, lon });
    });
  },

  showMessage(message) {
    const msg = document.getElementById('responseMessage');
    if (msg) msg.textContent = message;
  },

  resetForm() {
    document.getElementById('storyForm').reset();
  },

  clearCamera() {
    const video = document.getElementById('video');
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (video) video.srcObject = null;
    const capture = document.getElementById('capture');
    const stop = document.getElementById('stopCamera');
    if (capture) capture.disabled = true;
    if (stop) stop.disabled = true;
  }
};

export default AddStoryView;
