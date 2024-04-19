import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/GetApp';

const PrintButton = ({ setIsGeneratingPDF }) => {
  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    setTimeout(async () => {
      const input = document.getElementById('live-cv');

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
        onclone: (document) => {
          const liveCv = document.getElementById('live-cv');
          liveCv.style.width = '1000px';  // Ensure the element is wide enough
          liveCv.style.height = 'auto';   // Allow height to adjust based on content

          // Set the left sidebar width to match desktop layout
          const leftSidebar = document.querySelector('.leftside');
          if (leftSidebar) {
            leftSidebar.style.width = '250px'; // Set this based on your desktop layout
            leftSidebar.style.flex = 'none';   // Prevent flex from resizing it

            const chipTextElements = document.querySelectorAll('.chip-blue, .chip-green');
            chipTextElements.forEach(el => {
              el.style.padding = '0 4px 10px 4px';
            });

            // Apply transform to text elements specifically in the left sidebar
            const textElementsInSidebar = leftSidebar.querySelectorAll('.MuiTypography-root, .MuiListItemText-root');
            textElementsInSidebar.forEach(el => {
              el.style.transform = 'translateY(-4px)';
              
            });
          }

          const contactSection = document.querySelector('.contact-section'); // Adjust selector as necessary
          if (contactSection) {
            contactSection.style.marginLeft = '100px'; // Set the right padding to match desktop
          }


          const sectionHeaders = document.querySelectorAll('.section-header'); // Adjust selector as necessary
          sectionHeaders.forEach(header => {
            header.style.pageBreakBefore = 'always'; 
          });

          // Force all containers to non-wrapping and full width for consistency
          const flexContainers = document.querySelectorAll('.MuiGrid-container');
          flexContainers.forEach(container => {
            container.style.flexWrap = 'nowrap';
            container.style.flexDirection = 'row';
          });

          // General text and chip styling adjustments
          const textElements = document.querySelectorAll('.MuiTypography-root, .MuiListItemText-root');
          textElements.forEach(el => {
            el.style.transform = 'translateY(-4px)';
          });

          // Hide elements that shouldn't be visible in the PDF
          const nonVisibleElements = document.querySelectorAll('.print-hide, .MuiIconButton-root');
          nonVisibleElements.forEach(el => {
            el.style.display = 'none';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      while (heightLeft >= 0) {
        heightLeft -= 297;
        if (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, heightLeft - imgHeight, imgWidth, imgHeight);
        }
      }

      pdf.save('LiveCV.pdf');
      setIsGeneratingPDF(false);
    }, 500);
  };

  return (
    <Button
      onClick={generatePDF}
      startIcon={<DownloadIcon />} // Add an icon to the button
      variant="contained" // Use the 'contained' variant for a more prominent button
      color="primary" // Choose the color for the button
      size="large" // Increase the size of the button
      sx={{
        fontSize: '1rem', // Increase the font size if needed
        padding: '10px 20px', // Adjust the padding to make the button larger
      }}
    >
      Télécharger le CV
    </Button>
  );
};

export default PrintButton;
