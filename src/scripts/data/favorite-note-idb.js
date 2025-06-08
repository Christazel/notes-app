// src/scripts/data/favorite-note-idb.js

import { openDB } from 'idb';

const DATABASE_NAME = 'notes-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'favoriteNotes';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const FavoriteNoteIdb = {
  async getAllNotes() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async getNote(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async putNote(note) {
    return (await dbPromise).put(OBJECT_STORE_NAME, note);
  },
  async deleteNote(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default FavoriteNoteIdb;
