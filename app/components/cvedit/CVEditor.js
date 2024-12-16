"use client";
import React, { useState } from 'react';
import { 
  Stack,
  Paper, 
  Box, 
  Button,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import PrintButton from './PrintButton';
import { motion } from 'framer-motion';

const CVEditor = ({ cvData: initialCvData, onUpdate, showSuccess, locale }) => {
  const theme = useTheme();
  const t = useTranslations('cvedit');
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [localCvData, setLocalCvData] = useState(initialCvData);
  const [isSaving, setIsSaving] = useState(false);

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

  const handlePrint = async () => {
    setIsPrinting(true);
    // La logique d'impression sera implémentée dans PrintButton
    setIsPrinting(false);
  };

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Panneau d'édition */}
        <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        </Box>

        {/* Prévisualisation du CV */}
        <Box sx={{ flex: { xs: '1', md: '0 0 66.666%' } }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                mb: 3, 
                display: 'flex', 
                justifyContent: 'flex-end',
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1
              }}>
                <PrintButton 
                  onPrint={handlePrint} 
                  disabled={isPrinting || isSaving}
                />
              </Box>
              <LiveCV 
                data={localCvData}
                locale={locale}
              />
            </Paper>
          </motion.div>
        </Box>
      </Stack>

      {/* Notification de succès */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" elevation={6} variant="filled">
          {t('editor.success')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CVEditor;