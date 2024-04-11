// pages/api/generatePdf.js
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV'; // Update the path according to your project structure

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

    const templatePath = path.join(process.cwd(), 'public', 'template', cvData.template);
    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    // Personal Information
    form.getTextField('firstname').setText(cvData.personalInfo.firstname);
    form.getTextField('lastname').setText(cvData.personalInfo.lastname);
    form.getTextField('sex').setText(cvData.personalInfo.sex);
    form.getTextField('email').setText(cvData.personalInfo.email);
    form.getTextField('phoneNumber').setText(cvData.personalInfo.phoneNumber);
    form.getTextField('nationality').setText(cvData.personalInfo.nationality);
    form.getTextField('dateofBirth').setText(cvData.personalInfo.dateofBirth);
    form.getTextField('placeofBirth').setText(cvData.personalInfo.placeofBirth);
    form.getTextField('address').setText(cvData.personalInfo.address);
    form.getTextField('city').setText(cvData.personalInfo.city);
    form.getTextField('zip').setText(cvData.personalInfo.zip);
    form.getTextField('linkedIn').setText(cvData.personalInfo.linkedIn);
    form.getTextField('personalWebsite').setText(cvData.personalInfo.personalWebsite);

   // Education
    cvData.education.forEach((edu, index) => {
        form.getTextField(`educationSchoolName${index + 1}`).setText(edu.schoolName);
        form.getTextField(`educationDegree${index + 1}`).setText(edu.degree);
        form.getTextField(`educationFieldOfStudy${index + 1}`).setText(edu.fieldOfStudy);
        form.getTextField(`educationStartDate${index + 1}`).setText(edu.startDate);
        form.getTextField(`educationEndDate${index + 1}`).setText(edu.ongoing ? "En cours" : edu.endDate);
    
        // Assuming there's a field to indicate if the education is ongoing and achievements are combined in a single field
        const ongoingField = form.getCheckBox(`educationOngoing${index + 1}`);
        if (edu.ongoing && ongoingField) {
        ongoingField.check();
        } else {
        ongoingField?.uncheck();
        }
    
        const achievementsText = edu.achievements.join(", ");
        form.getTextField(`educationAchievements${index + 1}`).setText(achievementsText);
    });


    // Work Experience
    cvData.workExperience.forEach((work, index) => {
    form.getTextField(`workCompanyName${index + 1}`).setText(work.companyName);
    form.getTextField(`workPosition${index + 1}`).setText(work.position);
    form.getTextField(`workLocation${index + 1}`).setText(work.location);
    form.getTextField(`workStartDate${index + 1}`).setText(work.startDate);
    form.getTextField(`workEndDate${index + 1}`).setText(work.ongoing ? "En cours" : work.endDate);

    // Assuming there's a field to indicate if the work is ongoing
    const ongoingField = form.getCheckBox(`workOngoing${index + 1}`);
    if (work.ongoing && ongoingField) {
        ongoingField.check();
    } else {
        ongoingField?.uncheck();
    }

    const responsibilitiesText = work.responsibilities.join(", ");
    form.getTextField(`workResponsibilities${index + 1}`).setText(responsibilitiesText);
    });

    // Skills
    cvData.skills.forEach((skill, index) => {
      form.getTextField(`skillName${index + 1}`).setText(skill.skillName);
      form.getTextField(`skillLevel${index + 1}`).setText(skill.level);
    });

    // Languages
    cvData.languages.forEach((lang, index) => {
        form.getTextField(`languageName${index + 1}`).setText(lang.language);
        form.getTextField(`languageProficiency${index + 1}`).setText(lang.proficiency);
    
        // Conditionally set test name and score if they exist
        if (lang.testName && lang.testScore) {
        form.getTextField(`languageTestName${index + 1}`).setText(lang.testName);
        form.getTextField(`languageTestScore${index + 1}`).setText(lang.testScore);
        } else {
        // Optionally clear the fields if no data exists
        form.getTextField(`languageTestName${index + 1}`).setText('');
        form.getTextField(`languageTestScore${index + 1}`).setText('');
        }
    });
    
    // Hobbies - assuming a single field for all hobbies
    const hobbiesString = cvData.hobbies.join(", ");
    form.getTextField('hobbies').setText(hobbiesString);

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
