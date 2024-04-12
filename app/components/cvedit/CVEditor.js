// CVEditor.js
'use client';
import React, { useState } from 'react';
import { Grid, Paper, Button, useTheme, Box } from '@mui/material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import { useRouter } from 'next/navigation';



const CVEditor = ({ cvData, setCvData }) => {
  const theme = useTheme();

  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('template1.pdf');


  const generatePDF = async () => {
    try {
      const userId = localStorage.getItem('cvUserId'); // Assuming you store userId in localStorage
      const response = await fetch('/api/cvedit/generatePdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cv.pdf'); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
  };

  const onSelectTemplate = (templateId) => {
    // Since all choices lead to template1.pdf, we ignore the templateId for now
    setSelectedTemplate('template1.pdf'); // This path is relative to the public folder
    console.log('Template selected:', selectedTemplate);
    // If you need to make an API call to save the selected template, do it here
  };

  const handleGoBack = () => {
    router.push('/cvgen'); // Navigate back to the CV generation page
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, minHeight: '100vh' }}>
          <CVInfos cvData={cvData} setCvData={setCvData} onSelectTemplate={onSelectTemplate}/>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '100vh' }}>
        <LiveCV id="live-cv" cvData={cvData} setCvData={setCvData} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Button variant="outlined" color="primary" onClick={generatePDF}>
            Enregistrer le CV
          </Button>
        </Box>
      </Paper>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handleGoBack}>Précédent</Button>
      </Grid>
    </Grid>
  );
};

export default CVEditor;
