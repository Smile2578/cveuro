import React, { useState } from 'react';
import { Grid, Paper, Button, Box } from '@mui/material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import PrintButton from './PrintButton'; // Make sure to import the PrintButton
import { useRouter } from 'next/navigation'; // Ensure correct import path for router

const CVEditor = ({ cvData, setCvData }) => {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState('template1.pdf');

  const handleGoBack = () => {
    router.push('/cvgen');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2, minHeight: '100vh'}}>
          <CVInfos cvData={cvData} setCvData={setCvData} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={handleGoBack}>Retourner sur le formulaire</Button>
            <PrintButton />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{p: 2, minHeight: '100vh' }}>
          <LiveCV id="live-cv" cvData={cvData} setCvData={setCvData}/>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CVEditor;
