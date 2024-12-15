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

    const cvUpdate = await CV.findOneAndUpdate(
      { userId }, 
      req.body,
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
