const BASE_URL = 'https://story-api.dicoding.dev/v1';

const AuthAPI = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    localStorage.setItem('token', result.loginResult.token);
    return result;
  },

  async register(name, email, password) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export default AuthAPI;
