import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'PUT') {
        console.log('Données reçues pour mise à jour:', JSON.stringify(req.body, null, 2));

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
                // Transformer workExperience.experiences en workExperience
                workExperience: req.body.workExperience?.experiences || [],
            };

            // Supprimer les anciennes clés
            delete transformedData.educations;
            if (transformedData.workExperience) {
                delete transformedData.workExperience.experiences;
            }

            console.log('Données transformées pour MongoDB:', JSON.stringify(transformedData, null, 2));

            const cvUpdate = await CV.findOneAndUpdate(
                { userId },
                { $set: transformedData },
                { new: true, runValidators: true }
            );

            if (!cvUpdate) {
                return res.status(404).json({ success: false, message: 'CV not found' });
            }

            console.log('CV mis à jour avec succès:', cvUpdate);

            return res.status(200).json({ success: true, data: cvUpdate });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du CV:', error);
            res.status(400).json({ success: false, message: 'Failed to update CV', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
