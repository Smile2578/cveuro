"use client";
import React from 'react';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { PictureAsPdf } from '@mui/icons-material';

const PrintButton = ({ setIsGeneratingPDF }) => {
  const t = useTranslations('cvedit.editor.print');

  const handlePrint = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/cvedit/generatePDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: localStorage.getItem('cvUserId') }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePrint}
      startIcon={<PictureAsPdf />}
      sx={{ mb: 2 }}
    >
      {t('button')}
    </Button>
  );
};

export default PrintButton;
