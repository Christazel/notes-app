import AddStoryView from '../views/add-story-view';
import { AddStoryPresenter } from '../presenters/add-story-presenter';

export default class AddStoryPage {
  constructor() {
    this.view = AddStoryView;
  }

  async render() {
    return this.view.renderForm();
  }

  async afterRender() {
    const presenter = new AddStoryPresenter(this.view);
    this.view.afterRender(presenter);
  }
}
