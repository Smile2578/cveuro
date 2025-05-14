import { Font } from '@alexandernanberg/react-pdf-renderer';

// Variables pour suivre l'état du chargement des polices
let fontsRegistered = false;
let fallbackUsed = false;

// Fonction pour enregistrer les polices au besoin
export const registerFonts = () => {
  // Si les polices sont déjà enregistrées, ne rien faire
  if (fontsRegistered) {
    return;
  }

  try {
    console.log('Registering custom fonts...');
    // Enregistrer les polices Roboto depuis CDN
    Font.register({
      family: 'Roboto',
      fonts: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
          fontWeight: 300
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
          fontWeight: 400
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
          fontWeight: 500
        },
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
          fontWeight: 700
        }
      ]
    });
    
    fontsRegistered = true;
  } catch (error) {
    console.error('Error registering custom fonts:', error);
    
    if (!fallbackUsed) {
      console.log('Using fallback fonts...');
      // Fallback vers les polices système
      try {
        Font.register({
          family: 'Roboto',
          fonts: [
            { src: 'Times-Roman' },
            { src: 'Times-Bold', fontWeight: 700 }
          ]
        });
        fallbackUsed = true;
        fontsRegistered = true;
      } catch (fallbackError) {
        console.error('Error registering fallback fonts:', fallbackError);
      }
    }
  }
};

// Enregistrer les polices immédiatement
registerFonts(); 