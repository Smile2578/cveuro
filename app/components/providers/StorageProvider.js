'use client';

import { useEffect } from 'react';
import { initStorage } from '@/app/utils/storage';

const StorageProvider = ({ children }) => {
  useEffect(() => {
    // Initialiser le storage au montage du composant
    const storage = initStorage();
    
    // Log de débogage
    console.log('Storage initialized:', {
      isAvailable: Boolean(storage),
      localStorage: storage?.storageAvailable.localStorage,
      sessionStorage: storage?.storageAvailable.sessionStorage
    });

    // Récupérer les données existantes
    if (storage) {
      try {
        const cvData = storage.getItem('cvFormData');
        const userId = storage.getItem('userId');
        
        console.log('Existing data found:', {
          hasCVData: Boolean(cvData),
          hasUserId: Boolean(userId)
        });
      } catch (error) {
        console.warn('Error checking existing data:', error);
      }
    }
  }, []);

  return children;
};

export default StorageProvider; 