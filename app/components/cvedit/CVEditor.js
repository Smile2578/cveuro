// CVEditor.js
'use client';
import React, { useState } from 'react';
import { Grid, Paper, Button, useTheme, Box } from '@mui/material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import { useRouter } from 'next/navigation';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const CVEditor = ({ cvData, setCvData }) => {
  const theme = useTheme();

  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('template1.pdf'); // Default template


  const generatePDF = async () => {
    const liveCV = document.getElementById('live-cv');
    
    // Apply desktop styles directly for PDF generation
    const originalStyle = liveCV.getAttribute('style');
      liveCV.style.width = '210mm';
      liveCV.style.height = '297mm';
      liveCV.style.position = 'relative';
      liveCV.style.backgroundColor = '#FFFFFF';
  
      const scale = 2;
  
      const canvas = await html2canvas(liveCV, {
        scale: scale,
        useCORS: true,
        onclone: (document) => {
          // This callback runs after the element is cloned for rendering but before it is rendered
          // Here you can perform any manipulations to the cloned element if necessary
          const clonedLiveCV = document.getElementById('live-cv');
          // Apply the styling necessary to make it look like the desktop version
          clonedLiveCV.style.display = 'grid';
          clonedLiveCV.style.gridTemplateColumns = '3fr 1fr 9fr';
          clonedLiveCV.style.gap = '16px';
          clonedLiveCV.style.overflow = 'hidden';
        }
      });
    
      const imgData = canvas.toDataURL('image/png');
    
      // Create a PDF and add the image
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
    
      // Adjust the width and height based on the scaling factor
      pdf.addImage(imgData, 'PNG', 0, 0, 210 / scale, 297 / scale);
    
      pdf.save('cv.pdf');
    
      // Revert to the original style
      liveCV.setAttribute('style', originalStyle);
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
