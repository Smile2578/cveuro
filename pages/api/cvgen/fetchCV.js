// pages/api/cvgen/fetchCV.js
import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
  // Check if the request is a GET request
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.query;

  // Validate userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in request' });
  }

  try {
    await dbConnect();

    const cv = await CV.findOne({ userId }).lean();
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch CV', error: error.toString() });
  }
}
