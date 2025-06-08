import { RegisterView } from '../views/register-view';
import { RegisterPresenter } from '../presenters/register-presenter';
import { AuthModel } from '../data/auth-model';

export default class RegisterPage {
  constructor() {
    this.view = new RegisterView();
    this.presenter = new RegisterPresenter(new AuthModel(), this.view);
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.afterRender(this.presenter);
  }
}
