"use client";
import React, { useState } from 'react';
import { 
  Stack,
  Paper, 
  Box, 
  Snackbar,
  Alert,
  useTheme,
  Typography,
  useMediaQuery,
  Button
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import CVInfos from './CVInfos';
import PrintButton from './PrintButton';

// Importation dynamique de LiveCV pour éviter les problèmes d'hydratation
const LiveCV = dynamic(() => import('./LiveCV'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography>Chargement...</Typography>
    </Box>
  ),
});

const CVEditor = ({ cvData: initialCvData, onUpdate, showSuccess, locale }) => {
  const theme = useTheme();
  const t = useTranslations('cvedit');
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedSection, setSelectedSection] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [localCvData, setLocalCvData] = useState(initialCvData);
  const [isSaving, setIsSaving] = useState(false);
  const [printError, setPrintError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(!isMobile);
  const [activeView, setActiveView] = useState(null);

  const handleSectionUpdate = async (sectionName, newData) => {
    // Mettre à jour les données localement d'abord
    const updatedCV = {
      ...localCvData,
      [sectionName]: newData
    };
    setLocalCvData(updatedCV);

    // Sauvegarder dans la BDD
    try {
      setIsSaving(true);
      await onUpdate(updatedCV);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // Remettre les anciennes données en cas d'erreur
      setLocalCvData(localCvData);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintError = (error) => {
    console.error('Print error:', error);
    setPrintError(error);
  };


  const renderMobileLayout = () => {
    return (
      <Stack direction="column" spacing={2} sx= {{ mt: 4 }}>
        {/* En-tête avec les boutons d'action */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2,
          px: 2,
        }}>

          {/* Bouton retour */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/cvgen')}
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light
              }
            }}
          >
            {t('editor.backToForm')}
          </Button>

          {/* PrintButton */}
          <PrintButton 
            data={localCvData}
            locale={locale}
            onError={handlePrintError}
          />


          {/* Boutons de basculement */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mt: 1
          }}>
            <Button
              fullWidth
              variant={activeView === 'preview' ? 'contained' : 'outlined'}
              onClick={() => setActiveView(activeView === 'preview' ? null : 'preview')}
              startIcon={<VisibilityIcon />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                boxShadow: activeView === 'preview' ? 4 : 0,
                transition: 'all 0.3s ease',
                backgroundColor: activeView === 'preview' ? theme.palette.primary.main : 'transparent',
                '&:hover': {
                  backgroundColor: activeView === 'preview' 
                    ? theme.palette.primary.dark 
                    : theme.palette.primary.light,
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                }
              }}
            >
              {activeView === 'preview' ? t('editor.hidePreview') : t('editor.viewPreview')}
            </Button>
            <Button
              fullWidth
              variant={activeView === 'edit' ? 'contained' : 'outlined'}
              onClick={() => setActiveView(activeView === 'edit' ? null : 'edit')}
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                py: 1.5,
                boxShadow: activeView === 'edit' ? 4 : 0,
                transition: 'all 0.3s ease',
                backgroundColor: activeView === 'edit' ? theme.palette.primary.main : 'transparent',
                '&:hover': {
                  backgroundColor: activeView === 'edit' 
                    ? theme.palette.primary.dark 
                    : theme.palette.primary.light,
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                }
              }}
            >
              {activeView === 'edit' ? t('editor.hideEdit') : t('editor.editCV')}
            </Button>
          </Box>
        </Box>

        {/* Message initial ou contenu */}
        <Box sx={{ px: 2 }}>
          {!activeView ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {t('editor.chooseView')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '80%' }}>
                {t('editor.chooseViewDescription')}
              </Typography>
            </Paper>
          ) : activeView === 'preview' ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                '& > div': {
                  maxWidth: '100%',
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  '& > div': {
                    transform: 'none !important',
                    maxWidth: '100% !important',
                    margin: '0 !important',
                    minHeight: 'auto !important',
                    height: 'auto !important',
                    transform: 'none !important',
                    '& *': {
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }
                  }
                }
              }}
            >
              <LiveCV 
                data={localCvData}
                locale={locale}
              />
            </Paper>
          ) : (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <CVInfos
                cvData={localCvData}
                onEdit={handleSectionUpdate}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                locale={locale}
              />
            </Paper>
          )}
        </Box>
      </Stack>
    );
  };

  const renderDesktopLayout = () => (
    <Stack direction="row" spacing={3}>
      {/* Panneau d'édition */}
      <Box sx={{ flex: '0 0 33.333%' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            height: '100%',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            position: 'relative'
          }}
        >
                    {/* Bouton retour */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/cvgen')}
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light
              }
            }}
          >
            {t('editor.backToForm')}
          </Button>

          <CVInfos
            cvData={localCvData}
            onEdit={handleSectionUpdate}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            locale={locale}
          />
        </Paper>
      </Box>

      {/* Prévisualisation du CV */}
      <Box sx={{ flex: '0 0 66.666%' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1
          }}>
            <PrintButton 
              data={localCvData}
              locale={locale}
              onError={handlePrintError}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <LiveCV 
              data={localCvData}
              locale={locale}
            />
          </Box>
        </Paper>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}

      {/* Notifications */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" elevation={6} variant="filled">
          {t('editor.success')}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!printError} 
        autoHideDuration={3000}
        onClose={() => setPrintError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" elevation={6} variant="filled">
          {t('editor.printError')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CVEditor;