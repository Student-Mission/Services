
const skills = [
    {label: 'C++'},
    {label: 'Java'},
    {label: 'C'},
    {label: 'Figma'},
    {label: 'Photoshop'},
    {label: 'Javascript'},
    {label: 'HTML/CSS'},
    {label: 'Rust'},
    {label: 'Python'},
    {label: 'React'},
    {label: 'Vue'},
    {label: 'Docker'},
    {label: 'Docker compose'},
    {label: 'MySQL'},
    {label: 'Go'},
    {label: 'Flutter'}
]
const levelChoices = ['Rookie', 'Apprentice', 'Intermediate', 'Challenger', 'Expert', 'Master', 'Senior']

const reFormatSkillsArray = ()=>{
  let newSkills = [];
  skills.map((skill)=>{
    newSkills.push(skill.label);
  })
  return newSkills;
}

// Règles de validation pour le formulaire NewMission
const missionRules = {
  name: {
    required: { fr: "Le nom de la mission est requis", en: "Mission name is required" },
    minlength: { value: 3, fr: "Le nom doit contenir au moins 3 caractères", en: "Name must be at least 3 characters" },
    maxlength: { value: 150, fr: "Le nom est trop long", en: "Name is too long" },
    pattern: { value: "spaced_name", fr: "Nom invalide", en: "Invalid name" }
  },

  description: {
    required: { fr: "La description est requise", en: "Description is required" },
    minlength: { value: 10, fr: "La description est trop courte", en: "Description is too short" },
    maxlength: { value: 2000, fr: "La description est trop longue", en: "Description is too long" },
    pattern: { value: "plaintext", fr: "Format de description invalide", en: "Invalid description format" }
  },

  start_date: {
    required: { fr: "La date de début est requise", en: "Start date is required" },
    date: {fr: "Date de début invalide", en: "Invalid start date" }
    // Note : vérifier côté applicatif que start_date >= today si nécessaire
  },

  deadline: {
    required: { fr: "La date limite est requise", en: "Due date is required" },
    date: { fr: "Date limite invalide", en: "Invalid due date" }
    // Note : vérifier séparément que deadline >= start_date (cross-field)
  },

  render_link: {
    // rendu conditionnel : requis seulement si render_mode est sélectionné — vérifier en logique métier
    required: { fr: "Le lien de rendu est requis", en: "Render link is required" },
    pattern: { value: "url", fr: "Lien invalide", en: "Invalid URL" },
    maxlength: { value: 500, fr: "Lien trop long", en: "URL too long" }
  },
  level: {
    required: {
      fr: "Le niveau minimum est requis",
      en: "Minimum level is required"
    },
    choices: {
      value: levelChoices,
      fr: "Le niveau choisi est invalide",
      en: "Selected level is invalid"
    }
  },
  skills: {
  label: 'Skills',
  // required: { fr: "Sélectionnez au moins une compétence", en: "Select at least one skill" },
  choices: {
    value: reFormatSkillsArray(),
    fr: 'Les compétences sélectionnées sont invalides',
    en: 'Invalid skills'
  }
}
};

const rateRules = {
  required: {
    fr: 'Le niveau de la mission est requis',
    en: 'Mission rate is required'
  },
  min: { value: 1, fr: "La niveau minimum est 1", en: "Minimum rate is 1" },
  max: { value: 5, fr: "La niveau maximum est 5", en: "Maximum rate is 5" }
}

const roleRules = {
  name: {
    required: { fr: "Le nom du rôle est requis", en: "Role name is required" },
    minlength: { value: 3, fr: "Le nom du rôle est trop court", en: "Role name is too short" },
    maxlength: { value: 60, fr: "Le nom du rôle est trop long", en: "Role name is too long" },
    pattern: { value: "spaced_name", fr: "Nom de rôle invalide", en: "Invalid role name" }
  },
  skills: {
    label: 'Skills',
    // required: { fr: "Sélectionnez au moins une compétence", en: "Select at least one skill" },
    choices: {
      value: reFormatSkillsArray(),
      fr: 'Les compétences sélectionnées sont invalides',
      en: 'Invalid skills'
    }
  }

}

export {missionRules, rateRules, roleRules};

/*
Usage (ex.) :
import Validator from '../validations/validator';
import missionRules from './missionRules';

const errors = Validator.validate(formData, missionRules);

// Cross-field checks (à faire après Validator.validate) : 
// - deadline >= start_date
// - rendre render_link obligatoire seulement si render_mode != ""
*/