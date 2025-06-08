export class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      this.view.showLoading();
      await this.model.register(name, email, password);
      this.view.showSuccess();
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}
