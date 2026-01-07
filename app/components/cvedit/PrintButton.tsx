'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useMessages } from 'next-intl';
import { FileText, Loader2 } from 'lucide-react';
import { pdf } from '@alexandernanberg/react-pdf-renderer';
import { NextIntlClientProvider } from 'next-intl';
import { Button } from '@/components/ui/button';
import CVDocument from './CVDocument';
import { registerFonts } from './fonts';

interface CVData {
  personalInfo?: {
    firstname?: string;
    lastname?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface PrintButtonProps {
  data: CVData;
  locale: string;
  onError?: (error: Error) => void;
  autoPrint?: boolean;
}

export default function PrintButton({ data, locale, onError, autoPrint = false }: PrintButtonProps) {
  const t = useTranslations('cvedit.editor.print');
  const messages = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasAutoPrinted = useRef(false);

  // S'assurer que les polices sont bien enregistrées
  useEffect(() => {
    registerFonts();
  }, []);

  // Auto-print si demandé (une seule fois)
  useEffect(() => {
    if (autoPrint && !hasAutoPrinted.current && data) {
      hasAutoPrinted.current = true;
      // Petit délai pour laisser les fonts se charger
      const timer = setTimeout(() => {
        handleGeneratePDF();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, data]);

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
      
      try {
        const doc = (
          <NextIntlClientProvider locale={safeLocale} messages={messages || {}}>
            <CVDocument data={safeData} locale={safeLocale} />
          </NextIntlClientProvider>
        );
  
        // Générer le PDF
        const blob = await pdf(doc).toBlob();
        
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
        throw pdfError as Error;
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err as Error);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Button
        variant="destructive"
        disabled
        className="mb-2"
      >
        <FileText className="w-4 h-4 mr-2" />
        {t('error')}
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      disabled={isLoading}
      onClick={handleGeneratePDF}
      className="mb-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      {isLoading ? t('generating') : t('button')}
    </Button>
  );
}

