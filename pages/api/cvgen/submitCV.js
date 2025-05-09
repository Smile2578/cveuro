import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';
import { randomBytes } from 'crypto';
import { parse, format } from 'date-fns';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }

  try {
    await dbConnect();
    const cvData = req.body;

    const userId = randomBytes(16).toString('hex');

    if (!cvData.personalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Les informations personnelles sont requises'
      });
    }

    if (cvData.personalInfo.dateofBirth) {
      try {
        const dobParsed = parse(cvData.personalInfo.dateofBirth, 'dd/MM/yyyy', new Date());
        cvData.personalInfo.dateofBirth = format(dobParsed, 'dd/MM/yyyy');
      } catch (error) {
        // Ignorer l'erreur de formatage de date pour le moment ou la gérer spécifiquement
      }
    }

    if (cvData.educations) {
      cvData.educations = cvData.educations.map(education => ({
        ...education,
        startDate: education.startDate ? format(parse(education.startDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined,
        endDate: education.ongoing ? "En cours" : education.endDate ? format(parse(education.endDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined
      }));
    }

    if (cvData.workExperience?.experiences) {
      cvData.workExperience.experiences = cvData.workExperience.experiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? format(parse(exp.startDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined,
        endDate: exp.ongoing ? "En cours" : exp.endDate ? format(parse(exp.endDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined
      }));
    }

    const transformedData = {
      ...cvData,
      education: cvData.educations,
      workExperience: cvData.workExperience?.experiences || [],
    };

    delete transformedData.educations;
    // La ligne "delete transformedData.workExperience.experiences;" a été correctement supprimée car workExperience est déjà l'array attendu.

    const docAvecDate = {
      userId,
      ...transformedData,
      createdAt: new Date()
    };
    const cv = await CV.create(docAvecDate);

    return res.status(201).json({
      success: true,
      data: {
        userId: cv.userId,
        cvId: cv._id
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la création du CV'
    });
  }
}
