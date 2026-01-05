'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import CVInfos from './CVInfos';
import PrintButton from './PrintButton';

// Importation dynamique de LiveCV pour éviter les problèmes d'hydratation
const LiveCV = dynamic(() => import('./LiveCV'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  ),
});

interface CVData {
  personalInfo?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    zip?: string;
    sex?: string;
    dateofBirth?: string;
    nationality?: { code: string; label: string }[];
    linkedIn?: string;
    personalWebsite?: string;
    [key: string]: unknown;
  };
  education?: Array<{
    schoolName: string;
    degree: string;
    customDegree?: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    achievements?: string[];
  }>;
  workExperience?: Array<{
    companyName: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    responsibilities?: string[];
  }>;
  skills?: Array<{
    skillName: string;
    level: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
    testName?: string;
    testScore?: string;
  }>;
  hobbies?: string[];
  [key: string]: unknown;
}

interface CVEditorProps {
  cvData: CVData;
  onUpdate: (data: CVData) => Promise<void>;
  showSuccess: boolean;
  locale: string;
}

export default function CVEditor({ cvData: initialCvData, onUpdate, showSuccess, locale }: CVEditorProps) {
  const t = useTranslations('cvedit');
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [localCvData, setLocalCvData] = useState<CVData>(initialCvData);
  const [isSaving, setIsSaving] = useState(false);
  const [printError, setPrintError] = useState<Error | null>(null);
  const [activeView, setActiveView] = useState<'preview' | 'edit' | null>(null);

  const handleSectionUpdate = async (sectionName: string, newData: unknown) => {
    const updatedCV = {
      ...localCvData,
      [sectionName]: newData
    };
    setLocalCvData(updatedCV);

    try {
      setIsSaving(true);
      await onUpdate(updatedCV);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setLocalCvData(localCvData);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintError = (error: Error) => {
    console.error('Print error:', error);
    setPrintError(error);
  };

  // Vue mobile
  const renderMobileLayout = () => (
    <div className="flex flex-col gap-4 mt-4">
      {/* En-tête avec les boutons d'action */}
      <div className="flex flex-col gap-4 px-4">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}/cvgen`)}
          className="justify-start text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('editor.backToForm')}
        </Button>

        {/* PrintButton */}
        <PrintButton 
          data={localCvData}
          locale={locale}
          onError={handlePrintError}
        />

        {/* Boutons de basculement */}
        <div className="flex gap-2 mt-2">
          <Button
            variant={activeView === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveView(activeView === 'preview' ? null : 'preview')}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            {activeView === 'preview' ? t('editor.hidePreview') : t('editor.viewPreview')}
          </Button>
          <Button
            variant={activeView === 'edit' ? 'default' : 'outline'}
            onClick={() => setActiveView(activeView === 'edit' ? null : 'edit')}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            {activeView === 'edit' ? t('editor.hideEdit') : t('editor.editCV')}
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-4">
        {!activeView ? (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {t('editor.chooseView')}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t('editor.chooseViewDescription')}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {t('editor.chooseViewDescriptionBis')}
            </p>
          </Card>
        ) : activeView === 'preview' ? (
          <Card className="p-4 overflow-x-auto">
            <LiveCV 
              data={localCvData}
              locale={locale}
            />
          </Card>
        ) : (
          <Card className="p-4">
            <CVInfos
              cvData={localCvData}
              onEdit={handleSectionUpdate}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              locale={locale}
            />
          </Card>
        )}
      </div>
    </div>
  );

  // Vue desktop
  const renderDesktopLayout = () => (
    <div className="flex gap-6">
      {/* Panneau d'édition */}
      <div className="w-1/3">
        <Card className="p-6 h-full">
          {/* Bouton retour */}
          <Button
            variant="ghost"
            onClick={() => router.push(`/${locale}/cvgen`)}
            className="mb-4 justify-start text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('editor.backToForm')}
          </Button>

          <CVInfos
            cvData={localCvData}
            onEdit={handleSectionUpdate}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            locale={locale}
          />
        </Card>
      </div>

      {/* Prévisualisation du CV */}
      <div className="w-2/3">
        <Card className="p-6 relative">
          <div className="absolute top-4 right-4 z-10">
            <PrintButton 
              data={localCvData}
              locale={locale}
              onError={handlePrintError}
            />
          </div>
          <LiveCV 
            data={localCvData}
            locale={locale}
          />
        </Card>
      </div>
    </div>
  );

  return (
    <div className="relative py-4">
      {/* Vue responsive */}
      <div className="md:hidden">
        {renderMobileLayout()}
      </div>
      <div className="hidden md:block">
        {renderDesktopLayout()}
      </div>

      {/* Notifications */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Alert className="bg-green-500 text-white border-green-600">
            <AlertDescription>{t('editor.success')}</AlertDescription>
          </Alert>
        </div>
      )}

      {printError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Alert variant="destructive">
            <AlertDescription>{t('editor.printError')}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

