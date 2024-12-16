// pages/api/cvgen/submitCV.js

import dbConnect from '../../../lib/dbConnect';
import CV from '../../../models/CV';
import { randomBytes } from 'crypto';
import { parse, format } from 'date-fns';

export default async function handler(req, res) {
  console.log('=== Début de submitCV ===');
  console.log('Méthode:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Méthode non autorisée:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`
    });
  }

  try {
    await dbConnect();
    const cvData = req.body;
    console.log('Données reçues:', JSON.stringify(cvData, null, 2));

    // Générer un nouvel ID
    const userId = randomBytes(16).toString('hex');
    console.log('Nouvel userId généré:', userId);

    // Vérifier que les données essentielles sont présentes
    if (!cvData.personalInfo) {
      console.log('Erreur: Informations personnelles manquantes');
      return res.status(400).json({
        success: false,
        error: 'Les informations personnelles sont requises'
      });
    }

    // Formater la date de naissance
    if (cvData.personalInfo.dateofBirth) {
      try {
        const dobParsed = parse(cvData.personalInfo.dateofBirth, 'dd/MM/yyyy', new Date());
        cvData.personalInfo.dateofBirth = format(dobParsed, 'dd/MM/yyyy');
        console.log('Date de naissance formatée:', cvData.personalInfo.dateofBirth);
      } catch (error) {
        console.error('Erreur de formatage de la date de naissance:', error);
      }
    }

    // Formater les dates d'éducation
    if (cvData.educations) {
      console.log('Formatage des dates d\'éducation');
      console.log('Éducations avant formatage:', cvData.educations);
      cvData.educations = cvData.educations.map(education => ({
        ...education,
        startDate: education.startDate ? format(parse(education.startDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined,
        endDate: education.ongoing ? "En cours" : education.endDate ? format(parse(education.endDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined
      }));
      console.log('Éducations après formatage:', cvData.educations);
    }

    // Formater les dates d'expérience professionnelle
    if (cvData.workExperience?.experiences) {
      console.log('Formatage des dates d\'expérience professionnelle');
      console.log('Expériences avant formatage:', cvData.workExperience.experiences);
      cvData.workExperience.experiences = cvData.workExperience.experiences.map(exp => ({
        ...exp,
        startDate: exp.startDate ? format(parse(exp.startDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined,
        endDate: exp.ongoing ? "En cours" : exp.endDate ? format(parse(exp.endDate, 'MM/yyyy', new Date()), 'MM/yyyy') : undefined
      }));
      console.log('Expériences après formatage:', cvData.workExperience.experiences);
    }

    console.log('Données finales à sauvegarder:', JSON.stringify(cvData, null, 2));

    // Transformer les données pour correspondre au schéma MongoDB
    const transformedData = {
      ...cvData,
      // Transformer educations en education
      education: cvData.educations,
      // Transformer workExperience.experiences en workExperience
      workExperience: cvData.workExperience?.experiences || [],
    };

    // Supprimer les anciennes clés
    delete transformedData.educations;
    if (transformedData.workExperience) {
      delete transformedData.workExperience.experiences;
    }

    console.log('Données transformées pour MongoDB:', JSON.stringify(transformedData, null, 2));

    // Créer le document CV avec les données transformées
    const cv = await CV.create({
      userId,
      ...transformedData
    });

    console.log('CV créé avec succès. ID:', cv._id);

    return res.status(201).json({
      success: true,
      data: {
        userId: cv.userId,
        cvId: cv._id
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du CV:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la création du CV'
    });
  }
}
