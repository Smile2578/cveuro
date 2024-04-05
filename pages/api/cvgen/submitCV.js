import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';
import { randomBytes } from 'crypto';

export default async function handler(req, res) {
  console.log('API Method:', req.method); // Log the request method for debugging

  if (req.method === 'POST') {
    try {
      await dbConnect();
      console.log('Database connected successfully.');

      let cvData = req.body;
      console.log('Received CV data:', JSON.stringify(cvData, null, 2)); // Log received data for verification, formatted

      // Generate a unique userId if not provided
      if (!cvData.userId) {
        cvData.userId = generateUniqueUserId();
        console.log('Generated new userId:', cvData.userId);
      }

      console.log('Preparing CV data for database insertion.');
      // Re-structure cvData to encapsulate personal information within personalInfo object
      cvData = {
        ...cvData,
        personalInfo: {
          firstname: cvData.firstname,
          lastname: cvData.lastname,
          email: cvData.email,
          nationality: cvData.nationality,
          phoneNumber: cvData.phoneNumber,
          dateofBirth: cvData.dateofBirth,
          sex: cvData.sex,
          placeOfBirth: cvData.placeOfBirth,
          address: cvData.address,
          city: cvData.city,
          zip: cvData.zip,
          linkedIn: cvData.linkedIn,
          personalWebsite: cvData.personalWebsite,
        },
        // Note: These properties are not explicitly removed; they are omitted from the log for clarity
      };

      console.log('Final CV data to save:', JSON.stringify(cvData, null, 2)); // Log the final structured data

      const newCV = new CV(cvData);
      await newCV.save();
      console.log('CV successfully saved', { cvId: newCV._id.toString(), userId: newCV.userId });

      // Respond with success message
      res.status(201).json({ success: true, message: 'CV successfully submitted', cvId: newCV._id.toString(), userId: newCV.userId });
    } catch (error) {
      console.error('Error in API Route - Saving CV:', error);
      // Respond with error message
      res.status(500).json({ success: false, message: 'Failed to submit CV', error: error.message });
    }
  } else {
    console.log(`Method ${req.method} not allowed.`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateUniqueUserId() {
  return randomBytes(16).toString('hex');
}
