import { Font } from '@react-pdf/renderer';

// Enregistrer les polices système
try {
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
} catch (error) {
  console.error('Error registering fonts:', error);
  
  // Fallback to system fonts
  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'Times-Roman'
      },
      {
        src: 'Times-Bold',
        fontWeight: 700
      }
    ]
  });
} 