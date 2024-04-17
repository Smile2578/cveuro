import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';
import { randomBytes } from 'crypto';
import { parse, format } from 'date-fns';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    let { userId, ...cvData } = req.body;

    if (!userId) {
      userId = randomBytes(16).toString('hex');
    }

    console.log('Received CV data:', cvData);
    console.log('Received userId:', userId);

    try {
      // Restructure the cvData to match the CV model, especially the personalInfo part
      const personalInfo = {
        firstname: cvData.firstname,
        lastname: cvData.lastname,
        email: cvData.email,
        nationality: cvData.nationality,
        phoneNumber: cvData.phoneNumber,
        dateofBirth: cvData.dateofBirth, 
        sex: cvData.sex,
        placeofBirth: cvData.placeofBirth,
        address: cvData.address,
        city: cvData.city,
        zip: cvData.zip,
        linkedIn: cvData.linkedIn,
        personalWebsite: cvData.personalWebsite,
      };

      // Format date of birth to DD/MM/YYYY if necessary
      if (personalInfo.dateofBirth) {
        const dobParsed = parse(personalInfo.dateofBirth, 'yyyy-MM-dd', new Date());
        personalInfo.dateofBirth = format(dobParsed, 'dd/MM/yyyy');
      }

      // Ensure education and workExperience dates are formatted correctly
      // Convert your startDate and endDate formats as needed
      ['education', 'workExperience'].forEach(section => {
        cvData[section] = cvData[section].map(item => {
          let startDateFormatted = item.startDate ? format(parse(item.startDate, 'yyyy-MM', new Date()), 'MM/yyyy') : undefined;
          let endDateFormatted = item.ongoing ? "En cours" : item.endDate ? format(parse(item.endDate, 'yyyy-MM', new Date()), 'MM/yyyy') : undefined;
          return { ...item, startDate: startDateFormatted, endDate: endDateFormatted };
        });
      });

      // Remove the flat personal info properties from cvData before saving
      const { firstname, lastname, email, nationality, phoneNumber, dateofBirth, sex, placeOfBirth, address, city, zip, linkedIn, personalWebsite, ...restOfCvData } = cvData;

      const finalData = {
        userId,
        personalInfo,
        ...restOfCvData
      };

      const cv = await CV.create(finalData);

      return res.status(201).json({
        success: true,
        message: 'CV successfully submitted',
        data: { userId: cv.userId, cvId: cv._id },
      });
        
    } catch (error) {
      console.error('Error submitting CV:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit CV',
        error: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
