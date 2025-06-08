import HomePage from '../pages/home-page.js';
import AddStoryPage from '../pages/add-story-page.js';
import LoginPage from '../pages/login-page.js';
import RegisterPage from '../pages/register-page.js';
import FavoritePage from '../pages/favorite-page.js'; // ✅ Sesuai nama file

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/add': AddStoryPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/favorites': FavoritePage, // ✅ Rute tambahan untuk halaman favorit
};

export default routes;
