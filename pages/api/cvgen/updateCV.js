// pages/api/cvgen/updateCV.js

import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'UserId is required' 
      });
    }

    // Transformer les données pour correspondre au schéma MongoDB
    const transformedData = {
      ...req.body,
      // Transformer educations en education en préservant tous les champs
      education: req.body.educations?.map(edu => ({
        ...edu,
        customDegree: edu.customDegree || null // Préserver le customDegree
      })),
      // Préserver workExperience tel quel s'il existe, sinon utiliser un tableau vide
      workExperience: Array.isArray(req.body.workExperience) 
        ? req.body.workExperience 
        : (req.body.workExperience?.experiences || [])
    };

    // Supprimer uniquement la clé educations car elle a été transformée
    delete transformedData.educations;

    const cvUpdate = await CV.findOneAndUpdate(
      { userId }, 
      transformedData,
      { new: true, runValidators: true }
    );

    if (!cvUpdate) {
      return res.status(404).json({ 
        success: false, 
        error: 'CV not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: cvUpdate 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
