export class RegisterView {
  render() {
    return `
      <section class="container">
        <h2>Daftar Akun</h2>
        <form id="registerForm">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" required />
          
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
          
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
          
          <button type="submit">Daftar</button>
        </form>
        <p id="registerMessage" aria-live="polite"></p>
      </section>
    `;
  }

  afterRender(presenter) {
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('registerMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await presenter.handleRegister(name, email, password);
    });
  }

  showLoading() {
    const msg = document.getElementById('registerMessage');
    if (msg) msg.textContent = 'Memproses pendaftaran...';
  }

  showSuccess() {
    const msg = document.getElementById('registerMessage');
    if (msg) msg.textContent = 'Berhasil daftar, silakan login.';
  }

  showError(message) {
    const msg = document.getElementById('registerMessage');
    if (msg) msg.textContent = `Gagal daftar: ${message}`;
  }
}
