import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PrintButton = ({ setIsGeneratingPDF }) => {
  const generatePDF = async () => {
    console.log('Setting isGeneratingPDF to true');
    setIsGeneratingPDF(true, async () => {
      console.log('Starting PDF generation...');
      const input = document.getElementById('live-cv');
      const clonedInput = input.cloneNode(true);
      clonedInput.style.width = '210mm'; // A4 width
      clonedInput.style.minHeight = '297mm'; // A4 minimum height to accommodate single page content
      clonedInput.style.margin = '0 auto';
      clonedInput.classList.add('a4-layout');

      document.body.appendChild(clonedInput); // Append to the body to capture it

      // Generate canvas from the cloned element
      const canvas = await html2canvas(clonedInput, {
        scale: 3, // Higher scale factor to enhance quality
        useCORS: true,
        logging: true,
        scrollY: -window.scrollY, // Adjust for any current scroll
        onclone: (document) => {
          // Your custom style adjustments
          const textElements = document.querySelectorAll('.MuiTypography-root, .MuiListItemText-root');
          textElements.forEach(el => {
            el.style.transform = 'translateY(-4px)';
          });
          const chipTextElements = document.querySelectorAll('.chip-blue, .chip-green');
          chipTextElements.forEach(el => {
            el.style.padding = '0 4px 10px 4px';
          });
          console.log('Document cloned for PDF generation.')
        }
      });

      document.body.removeChild(clonedInput); // Clean up by removing the cloned element

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate the number of pages
      const imgHeight = canvas.height * 210 / canvas.width; // Scale the canvas height to A4 width
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to each page
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, 210, imgHeight);
        heightLeft -= 297; // A4 height in mm
        position -= 297;
        if (heightLeft > 0) {
          pdf.addPage();
          console.log('Adding new page to PDF.');
        }
      }

      pdf.save('LiveCV.pdf');
      console.log('PDF generated and saved.');
      setIsGeneratingPDF(false);
      console.log('PDF generation flag reset.');
    });
  };

  return (
    <button onClick={generatePDF}>
      Télécharger le CV
    </button>
  );
};

export default PrintButton;
