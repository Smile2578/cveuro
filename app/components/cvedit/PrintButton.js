import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PrintButton = () => {
  const generatePDF = async () => {
    const input = document.getElementById('live-cv');
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      onclone: (document) => {
        // Apply transformation to the specific text elements
        const textElements = document.querySelectorAll('.MuiTypography-root, .MuiListItemText-root');
        textElements.forEach(el => {
          el.style.transform = 'translateY(-4px)';
        });
        // Apply transformation to the chips text as well
        const chipTextElements = document.querySelectorAll('.chip-blue, .chip-green');
        chipTextElements.forEach(el => {
          // Assuming the text is wrapped in a span or similar element inside the chip
          const textSpan = el.querySelector('span'); // or the appropriate selector for the text
          if (textSpan) {
            textSpan.style.paddingTop = '0px'; // Reduce padding-top to push text up
            textSpan.style.paddingBottom = '10px'; // Increase padding-bottom to compensate
          }
        });
      }
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('LiveCV.pdf');
  };

  return (
    <button onClick={generatePDF}>
      Télécharger le CV
    </button>
  );
};

export default PrintButton;
