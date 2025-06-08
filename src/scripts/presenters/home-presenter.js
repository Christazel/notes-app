import StoryAPI from '../data/story-api';
import HomeView from '../views/home-view';

const HomePresenter = {
  async init() {
    try {
      const stories = await StoryAPI.getAllStories();
      HomeView.showStories(stories);
      HomeView.showMapMarkers(stories);
    } catch (err) {
      HomeView.showError(`Gagal memuat cerita: ${err.message}`);
    }
  }
};

export default HomePresenter;
