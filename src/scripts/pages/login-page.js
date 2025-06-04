import { LoginView } from '../views/login-view';
import { LoginPresenter } from '../presenters/login-presenter';
import { AuthModel } from '../data/auth-model';

export default class LoginPage {
  constructor() {
    this.view = new LoginView();
    this.presenter = new LoginPresenter(new AuthModel(), this.view);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.afterRender(this.presenter);
  }
}
