const BASE_URL = 'https://story-api.dicoding.dev/v1';

export class LoginModel {
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'LOGIN_FAILED');
    }

    localStorage.setItem('token', result.loginResult.token);
    return result.loginResult;
  }
}
