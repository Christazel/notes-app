import { LoginModel } from '../data/login-model';
import { LoginPresenter } from '../presenters/login-presenter';

export class LoginView {
  render() {
    return `
      <section id="mainContent" class="container">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email</label>
          <input type="email" id="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" required />

          <button type="submit">Login</button>
        </form>
        <p id="loginMessage" aria-live="polite"></p>
      </section>
    `;
  }

  async afterRender() {
    const model = new LoginModel();
    const presenter = new LoginPresenter(model, this);

    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        await presenter.handleLogin(email, password);
      });
    }
  }

  showLoading() {
    const msg = document.getElementById('loginMessage');
    if (msg) msg.textContent = 'Memproses login...';
  }

  showSuccess(name) {
    const msg = document.getElementById('loginMessage');
    if (msg) msg.textContent = `Selamat datang, ${name}!`;
    setTimeout(() => {
      window.location.hash = '#/home';
    }, 1000);
  }

  showError(message) {
    const msg = document.getElementById('loginMessage');
    if (msg) msg.textContent = `Login gagal: ${message}`;
  }
}
