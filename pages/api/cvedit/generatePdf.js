import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';


const skillLevelLabels = {
  '1': 'Débutant',
  '2': 'Intermédiaire',
  '3': 'Expérimenté',
  '4': 'Avancé',
  '5': 'Maîtrise parfaite',
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.body;
  if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
  }

  try {
      const cvData = await CV.findOne({ userId }).lean();
      if (!cvData) {
          return res.status(404).json({ error: 'CV not found' });
      }

      const templatePath = path.join(process.cwd(), 'public', 'template', 'template1.pdf');
      const templateBytes = fs.readFileSync(templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);

      console.log('PDF loaded, number of pages:', pdfDoc.getPages().length); // Debug: Check if PDF is loaded

      const form = pdfDoc.getForm();

    // Fill personal info
    form.getTextField('Name').setText(`${cvData.personalInfo.firstname} ${cvData.personalInfo.lastname}`);
    form.getTextField('dateofBirth').setText(cvData.personalInfo.dateofBirth);
    form.getTextField('sex').setText(cvData.personalInfo.sex);
    form.getTextField('nationality').setText(cvData.personalInfo.nationality);
    if (cvData.personalInfo.placeofBirth) form.getTextField('placeofBirth').setText(cvData.personalInfo.placeofBirth);
    form.getTextField('email').setText(cvData.personalInfo.email);
    form.getTextField('phone').setText(cvData.personalInfo.phoneNumber);
    form.getTextField('adress').setText(`${cvData.personalInfo.address}, ${cvData.personalInfo.city}, ${cvData.personalInfo.zip}`);
    if (cvData.personalInfo.linkedIn) form.getTextField('linkedIn').setText(cvData.personalInfo.linkedIn);
    if (cvData.personalInfo.personalWebsite) form.getTextField('personalWebsite').setText(cvData.personalInfo.personalWebsite);

        // Set styles for name
        const nameField = form.getTextField('Name');
        nameField.setFontSize(14); // Example size
        // Fill languages
        cvData.languages.forEach((lang, index) => {
          if (index < 6) { // Assuming the template has up to 6 language fields
            form.getTextField(`language${index + 1}`).setText(`${lang.language} - ${lang.proficiency}${lang.testName ? ` (${lang.testName} - ${lang.testScore})` : ''}`);
          }
        });

        // Fill skills
        cvData.skills.forEach((skill, index) => {
          if (index < 4) { // Assuming the template has up to 4 skill fields
            form.getTextField(`skills${index + 1}`).setText(`${skill.skillName} - ${skillLevelLabels[skill.level]}`);
          }
        });

        // Fill education
        cvData.education.forEach((edu, index) => {
          if (index < 4) {
            form.getTextField(`education${index + 1}`).setText(
              `${edu.schoolName}, ${edu.degree}, ${edu.fieldOfStudy}, ${edu.startDate} - ${edu.ongoing ? "En cours" : edu.endDate}${edu.achievements ? ", Achievements: " + edu.achievements.join(", ") : ""}`
            );
          }
        });

        // Fill work experience
        cvData.workExperience.forEach((work, index) => {
          if (index < 4) {
            form.getTextField(`workExperience${index + 1}`).setText(
              `${work.companyName}, ${work.position}, ${work.location}, ${work.startDate} - ${work.ongoing ? "En cours" : work.endDate}${work.responsibilities ? ", Responsibilities: " + work.responsibilities.join(", ") : ""}`
            );
          }
        });

        // Fill hobbies

        form.getTextField('hobbies').setText(cvData.hobbies.join(', '));

    const pdfBytes = await pdfDoc.save();

    console.log('PDF generated, byte length:', pdfBytes.length); // Debug: Check the byte length

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cvData.personalInfo.lastname}_CV.pdf"`);
    res.send(Buffer.from(pdfBytes)); // Ensure the data is sent as a Buffer
} catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
}
}