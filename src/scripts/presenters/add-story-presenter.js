import StoryAPI from '../data/story-api';

export class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.marker = null;
    this.stream = null;
  }

  async init() {
    this.view.initCamera({
      onStart: (videoElement, captureBtn, stopBtn) => this.startCamera(videoElement, captureBtn, stopBtn),
      onStop: () => this.stopCamera(),
      onCapture: (canvas, video, setPhoto) => this.capturePhoto(canvas, video, setPhoto)
    });

    this.view.initMap((lat, lon) => {
      this.view.setCoordinates(lat, lon);
      if (this.marker) this.marker.remove();
      this.marker = L.marker([lat, lon]).addTo(this.view.getMapInstance());
    });

    this.view.initForm(async ({ description, photo, lat, lon }) => {
      if (!description || !photo || !lat || !lon) {
        this.view.showMessage('Semua field wajib diisi dan lokasi harus dipilih.');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      formData.append('lat', lat);
      formData.append('lon', lon);

      try {
        await StoryAPI.postStory(formData);
        this.view.showMessage('Cerita berhasil dikirim!');
        this.view.resetForm();
        if (this.marker) this.marker.remove();
        this.stopCamera();
      } catch (err) {
        this.view.showMessage(`Gagal mengirim cerita: ${err.message}`);
      }
    });
  }

  async startCamera(video, captureBtn, stopBtn) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;
      captureBtn.disabled = false;
      stopBtn.disabled = false;
    } catch (e) {
      console.error('Gagal membuka kamera:', e);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.view.clearCamera();
    }
  }

  capturePhoto(canvas, video, setPhoto) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      setPhoto(file);
    }, 'image/jpeg');
  }
}
