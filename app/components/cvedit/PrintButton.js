"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useTranslations, useMessages } from 'next-intl';
import { PictureAsPdf } from '@mui/icons-material';
import { pdf } from '@alexandernanberg/react-pdf-renderer';
import { NextIntlClientProvider } from 'next-intl';
import CVDocument from './CVDocument';
import { registerFonts } from './fonts';

const PrintButton = ({ data, locale, onError }) => {
  const t = useTranslations('cvedit.editor.print');
  const messages = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // S'assurer que les polices sont bien enregistrées
  useEffect(() => {
    registerFonts();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      // Vérifier si les données sont présentes et valides
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid CV data provided');
      }

      setIsLoading(true);
      setError(null);

      // Créer le document PDF avec un délai pour permettre le chargement des polices
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Assurer que locale est une chaîne valide
      const safeLocale = locale || 'fr';
      
      // Créer une copie sécurisée des données pour éviter les erreurs de référence
      const safeData = JSON.parse(JSON.stringify(data));
      
      // Envelopper le tout dans un bloc try-catch spécifique pour capturer l'erreur hasOwnProperty
      try {
        const doc = (
          <NextIntlClientProvider locale={safeLocale} messages={messages || {}}>
            <CVDocument data={safeData} locale={safeLocale} />
          </NextIntlClientProvider>
        );
  
        // Générer le PDF avec un délai supplémentaire pour s'assurer que tout est chargé
        const blob = await pdf(doc, {
          fontLoader: () => new Promise(resolve => setTimeout(resolve, 1000))
        }).toBlob();
        
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV-${safeData?.personalInfo?.firstname || 'untitled'}-${safeData?.personalInfo?.lastname || 'cv'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        if (pdfError.message && pdfError.message.includes('hasOwnProperty')) {
          console.error('Possible incompatibility with Next.js 15 / React 19. The fork of react-pdf might need updating.');
        }
        throw pdfError;
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Button
        variant="contained"
        color="error"
        disabled
        startIcon={<PictureAsPdf />}
        sx={{ mb: 2 }}
      >
        {t('error')}
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={isLoading}
      onClick={handleGeneratePDF}
      startIcon={<PictureAsPdf />}
      sx={{ mb: 2 }}
    >
      {isLoading ? t('generating') : t('button')}
    </Button>
  );
};

export default PrintButton;
