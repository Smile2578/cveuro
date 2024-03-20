import mongoose from 'mongoose';
import { fieldEncryption } from 'mongoose-field-encryption';
const { Schema } = mongoose;


const CVSchema = new Schema({
  userId: { // Assuming each CV is linked to a specific user
    type: String,
    required: true,
  },
  personalInfo: {
    firstname: String,
    lastname: String,
    email: String,
    nationality: String,
    phoneNumber: String,
    dateofBirth: Date, 
    linkedIn: String, // Optional, can be useful
    personalWebsite: String, // Optional, for those who have a portfolio site
  },
  professionalSummary: String, // Brief summary or objective
  education: [{
    schoolName: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    achievements: [String], // Optional, for notable achievements during education
  }],
  workExperience: [{
    companyName: String,
    position: String,
    location: String, // Optional, to specify where the job was located
    startDate: Date,
    endDate: Date,
    responsibilities: [String],
  }],
  certifications: [{
    name: String,
    issuedBy: String, // Issuing authority
    dateIssued: Date,
    expirationDate: Date, // Optional, if applicable
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String], // Technologies used
    link: String, // Optional, if there's a link to the project
  }],
  publications: [{
    title: String,
    publicationDate: Date,
    publisher: String, // Optional
    link: String, // Optional, if there's a link to the publication
  }],
  volunteerWork: [{
    organization: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String,
  }],
  awards: [{
    title: String,
    issuer: String, // Who awarded it
    date: Date,
  }],
  skills: [{
    skillName: String,
    level: String, // Consider defining what levels are possible (e.g., Beginner, Intermediate, Advanced)
  }],
  languages: [{
    language: String,
    proficiency: String, // Consider defining what proficiencies are possible (e.g., Basic, Conversational, Fluent, Native)
  }],
  hobbies: [String], // Simple array of strings might suffice
  references: [{
    name: String,
    contactInformation: String,
  }],
});


const secret = process.env.FIELD_ENCRYPTION_KEY;

function customSaltGenerator() {
    // Generate a 16-byte salt
    return crypto.randomBytes(16).toString('hex');
  }
  

// Specify fields to encrypt and options
CVSchema.plugin(fieldEncryption, {
  fields: ['personalInfo', 'education', 'workExperience', 'certifications', 'projects', 'publications', 'volunteerWork', 'awards', 'skills', 'languages', 'references'], // Add all fields you want encrypted
  secret: secret,
  saltGenerator: customSaltGenerator,
});

export default mongoose.models.CV || mongoose.model('CV', CVSchema);
