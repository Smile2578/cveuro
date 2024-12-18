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
  IconButton,
  Collapse,
  useMediaQuery,
  Button
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import CVInfos from './CVInfos';
import PrintButton from './PrintButton';
import { motion } from 'framer-motion';

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

  const renderMobileLayout = () => (
    <Stack direction="column" spacing={3}>

      {/* PrintButton */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%',
        px: 2
      }}>
        <PrintButton 
          data={localCvData}
          locale={locale}
          onError={handlePrintError}
        />
      </Box>

      {/* LiveCV adapté pour mobile */}
      <Box sx={{ 
        width: '100%',
        overflow: 'auto',
        maxWidth: '100vw',
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            position: 'relative',
            width: '100%',
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {t('editor.textPreview')}
          </Typography>
          <LiveCV 
            data={localCvData}
            locale={locale}
          />
        </Paper>
      </Box>

      {/* Bouton d'édition */}
      <Box sx={{ px: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setIsEditOpen(!isEditOpen)}
          startIcon={isEditOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          color="primary"
        >
          {isEditOpen ? t('editor.hideEdit') : t('editor.showEdit')}
        </Button>
      </Box>

      {/* Panneau d'édition collapsable */}
      <Collapse in={isEditOpen} sx={{ width: '100%' }}>
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
      </Collapse>
    </Stack>
  );

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
            position: 'relative'
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
          <LiveCV 
            data={localCvData}
            locale={locale}
          />
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