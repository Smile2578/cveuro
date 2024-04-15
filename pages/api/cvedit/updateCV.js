import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'PUT') {
        console.log('Received update request with body:', req.body); // This will show everything received

        try {
            const { userId } = req.query;
            const updateData = {};

            // Personal info updates
            Object.entries(req.body.personalInfo).forEach(([key, value]) => {
                updateData[`personalInfo.${key}`] = value;
            });

            // Assuming other fields are at the root level and not nested under personalInfo
            ['education', 'workExperience', 'skills', 'languages', 'hobbies'].forEach(field => {
                updateData[field] = req.body[field];
            });

            console.log('Update data being set:', updateData); // Confirm what will be set

            const cvUpdate = await CV.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, runValidators: true });

            if (!cvUpdate) {
                return res.status(404).json({ success: false, message: 'CV not found' });
            }

            console.log('Updated CV:', cvUpdate); // See the updated result

            return res.status(200).json({ success: true, data: cvUpdate });
        } catch (error) {
            console.error('Error in updating CV:', error);
            res.status(400).json({ success: false, message: 'Failed to update CV', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
