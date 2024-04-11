'use client';
import React, { useState, useEffect } from 'react';
import { Paper, Grid, Button } from '@mui/material';
import CVInfos from './CVInfos';
import LiveCV from './LiveCV';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



const CVEditor = () => {
  const router = useRouter();
  const [cvData, setCvData] = useState({
    // Initialize with default structure or fetch from API
    personalInfo: {},
    education: [],
    workExperience: [],
    skills: [],
    languages: [],
    hobbies: [],
    template: [],
  });

  useEffect(() => {
    const fetchCVData = async () => {
      // Retrieve userId from local storage
      const userId = localStorage.getItem('cvUserId');
  
      console.log('Retrieved userId for fetching CV:', userId);
      if (!userId) {
        console.error('No userId found in local storage');
        return;
      }
  
      try {
        const response = await fetch(`/api/cvedit/fetchCV?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch CV data');
        const data = await response.json();
        console.log('Fetched CV data:', data);
        setCvData(data);
      } catch (error) {
        console.error("Error fetching CV data:", error.message);
      }
    };
  
    fetchCVData();
  }, []);


  const handleSavePDF = () => {
    const input = document.getElementById('LiveCV'); // Ensure your LiveCV component has this ID
    console.log(input); // Debugging: Check if the element is found
  
    if (!input) {
      console.error('LiveCV element not found');
      return;
    }
  
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Initialize jsPDF
        let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        pdf.save("download.pdf"); // Generate PDF
      })
      .catch(err => console.error('Error generating PDF', err));
  };

  const handleGoBack = () => {
    router.push('/cvgen'); // Navigate back to the cvgen page
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <CVInfos cvData={cvData} setCvData={setCvData} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2, minHeight: '297mm', maxWidth: '210mm' }}>
          <LiveCV cvData={cvData} />
        </Paper>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={handleGoBack}>Précédent</Button>
        <Button variant="outlined" onClick={handleSavePDF}>Enregistrer</Button>
      </Grid>
    </Grid>
  );
};

export default CVEditor;
