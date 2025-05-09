import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'PUT') {
        try {
            const { userId } = req.query;

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
                { $set: transformedData },
                { new: true, runValidators: true }
            );

            if (!cvUpdate) {
                return res.status(404).json({ success: false, message: 'CV not found' });
            }

            return res.status(200).json({ success: true, data: cvUpdate });
        } catch (error) {
            res.status(400).json({ success: false, message: 'Failed to update CV', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
