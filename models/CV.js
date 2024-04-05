import mongoose from 'mongoose';
const { Schema } = mongoose;


const CVSchema = new Schema({
  userId: { 
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
    sex: String,
    placeofBirth: String,
    address: String,
    city: String,
    zip: String,
    linkedIn: String, // Optional, can be useful
    personalWebsite: String, // Optional, for those who have a portfolio site
  },
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
  skills: [{
    skillName: String,
    level: String, // Consider defining what levels are possible (e.g., Beginner, Intermediate, Advanced)
  }],
  languages: [{
    language: String,
    proficiency: String, // A1, A2, B1, B2, C1, C2
    testName: String, // Name of the language test taken
    testScore: String, // Grade or score obtained in the language test
  }],
  hobbies: [String], // Simple array of strings might suffice
});


export default mongoose.models.CV || mongoose.model('CV', CVSchema);
