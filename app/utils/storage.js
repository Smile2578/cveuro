'use client';

class CustomStorage {
  constructor() {
    this.memoryStorage = new Map();
    this.storageAvailable = this.checkStorageAvailability();
    console.log('Storage availability:', this.storageAvailable);
  }

  checkStorageAvailability() {
    if (typeof window === 'undefined') {
      return {
        localStorage: false,
        sessionStorage: false
      };
    }

    try {
      const storage = window.localStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return {
        localStorage: true,
        sessionStorage: this.checkSessionStorageAvailability()
      };
    } catch (e) {
      console.log('Storage check failed:', e);
      return {
        localStorage: false,
        sessionStorage: this.checkSessionStorageAvailability()
      };
    }
  }

  checkSessionStorageAvailability() {
    if (typeof window === 'undefined') return false;

    try {
      const storage = window.sessionStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.log('SessionStorage check failed:', e);
      return false;
    }
  }

  getItem(key) {
    try {
      if (this.storageAvailable.localStorage) {
        const item = localStorage.getItem(key);
        if (item) return item;
      }
      
      if (this.storageAvailable.sessionStorage) {
        const item = sessionStorage.getItem(key);
        if (item) return item;
      }

      return this.memoryStorage.get(key);
    } catch (e) {
      console.warn('Error getting item:', e);
      return this.memoryStorage.get(key);
    }
  }

  setItem(key, value) {
    try {
      this.memoryStorage.set(key, value);
      
      if (this.storageAvailable.localStorage) {
        localStorage.setItem(key, value);
      }
      
      if (this.storageAvailable.sessionStorage) {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Error setting item:', e);
    }
  }

  removeItem(key) {
    try {
      this.memoryStorage.delete(key);
      
      if (this.storageAvailable.localStorage) {
        localStorage.removeItem(key);
      }
      
      if (this.storageAvailable.sessionStorage) {
        sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Error removing item:', e);
    }
  }
}

// Créer une instance unique
let customStorage;

// Fonction d'initialisation
export const initStorage = () => {
  if (typeof window !== 'undefined' && !customStorage) {
    customStorage = new CustomStorage();
    window.__customStorage = customStorage;
  }
  return customStorage;
};

// Fonction pour obtenir l'instance
export const getStorage = () => {
  if (!customStorage) {
    return initStorage();
  }
  return customStorage;
};

export default CustomStorage; 