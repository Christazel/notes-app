import AuthAPI from './auth-api';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryAPI = {
  async getAllStories() {
    const token = AuthAPI.getToken();
    if (!token) {
      window.location.hash = '#/login';
      throw new Error('Token tidak ditemukan, harap login terlebih dahulu.');
    }

    const res = await fetch(`${BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.listStory;
  },

  async postStory(formData) {
    const token = AuthAPI.getToken();
    if (!token) {
      window.location.hash = '#/login';
      throw new Error('Token tidak ditemukan, harap login terlebih dahulu.');
    }

    const res = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  }
};

export default StoryAPI;
