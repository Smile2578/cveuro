"use client";
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslations, useMessages } from 'next-intl';
import { PictureAsPdf } from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';
import { NextIntlClientProvider } from 'next-intl';
import CVDocument from './CVDocument';

const PrintButton = ({ data, locale, onError }) => {
  const t = useTranslations('cvedit.editor.print');
  const messages = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Créer le document PDF avec un délai pour permettre le chargement des polices
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doc = (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CVDocument data={data} locale={locale} />
        </NextIntlClientProvider>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV-${data?.personalInfo?.firstname || 'untitled'}-${data?.personalInfo?.lastname || 'cv'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
