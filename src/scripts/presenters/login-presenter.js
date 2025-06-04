export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      this.view.showLoading();
      const user = await this.model.login(email, password);
      this.view.showSuccess(user.name);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
