import { openDB } from 'idb';

const DATABASE_NAME = 'notes-app-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'favorites';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const FavoriteDB = {
  async getAll() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async get(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async put(item) {
    return (await dbPromise).put(OBJECT_STORE_NAME, item);
  },
  async delete(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default FavoriteDB;
