import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PrintButton = () => {
  const generatePDF = async () => {
    const input = document.getElementById('live-cv');

    // Clone your element and apply A4 layout styles
    const clonedInput = input.cloneNode(true);
    clonedInput.style.maxWidth = '1000';
    clonedInput.style.minHeight = '1000';
    clonedInput.style.margin = '2 auto';
    clonedInput.classList.add('a4-layout');

    // Replace the input with the clonedInput in the DOM temporarily
    input.parentNode.replaceChild(clonedInput, input);

    const canvas = await html2canvas(clonedInput, { // Make sure to pass clonedInput here
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
          el.style.padding = '0 4px 10px 4px';
        });
      }
    });

    // Once captured, put the original input back in place
    clonedInput.parentNode.replaceChild(input, clonedInput);

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
