import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
 ;
  if (method === 'PUT') {
    try {
      const { userId } = req.query; // Assuming you're passing the userId as a query parameter
      const cvUpdate = await CV.findOneAndUpdate({ userId }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!cvUpdate) {
        return res.status(404).json({ success: false, message: 'CV not found' });
      }

      console.log('Updated CV:', cvUpdate);

      return res.status(200).json({ success: true, data: cvUpdate });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to update CV', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
