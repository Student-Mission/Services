const registerRules = {
  email: {
    required: {
      fr: "L'adresse e-mail est requise.",
      en: "Email address is required."
    },
    pattern: {
      value: "email",
      fr: "L'adresse e-mail n'est pas valide.",
      en: "Must be a valid email address."
    },
    maxlength: {
      value: 254,
      fr: "L'adresse e-mail est trop longue.",
      en: "Email address is too long."
    }
  },

  username: {
    required: {
      fr: "Le nom d'utilisateur est requis.",
      en: "Username is required."
    },
    minlength: {
      value: 2,
      fr: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
      en: "Username must be at least 2 characters."
    },
    maxlength: {
      value: 30,
      fr: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
      en: "Username cannot exceed 30 characters."
    },
    pattern: {
      value: "spaced_name",
      fr: "Le nom d'utilisateur contient des caractères invalides.",
      en: "Username contains invalid characters."
    }
  },

  password: {
    required: {
      fr: "Le mot de passe est requis.",
      en: "Password is required."
    },
    minlength: {
      value: 5,
      fr: "Le mot de passe doit contenir au moins 5 caractères.",
      en: "Password must be at least 5 characters."
    },
    maxlength: {
      value: 64,
      fr: "Le mot de passe est trop long.",
      en: "Password is too long."
    }
  },

  confirm_password: {
    required: {
      fr: "La confirmation du mot de passe est requise.",
      en: "Password confirmation is required."
    },
    // Note: equality with `password` must be checked as a cross-field rule in the form logic,
    // Validator.validate only checks single-field rules.
    equalsField: {
      field: "password",
      fr: "Les mots de passe ne correspondent pas.",
      en: "Passwords do not match."
    }
  },

};

// Company information validation (fields describing a company)
const companyValidationRules = {
  name: {
    required: {
      fr: "Le nom de l'entreprise est requis.",
      en: "Company name is required."
    },
    minlength: {
      value: 2,
      fr: "Le nom de l'entreprise doit contenir au moins 2 caractères.",
      en: "Company name must be at least 2 characters."
    },
    maxlength: {
      value: 100,
      fr: "Le nom de l'entreprise est trop long.",
      en: "Company name is too long."
    },
    pattern: {
      value: "spaced_name",
      fr: "Le nom contient des caractères invalides.",
      en: "Company name contains invalid characters."
    }
  },

  description: {
    required: {
      fr: "La description est requise.",
      en: "Description is required."
    },
    minlength: {
      value: 20,
      fr: "La description est trop courte.",
      en: "Description is too short."
    },
    maxlength: {
      value: 500,
      fr: "La description est trop longue.",
      en: "Description is too long."
    },
    pattern: {
      value: "plaintext",
      fr: "Format de description invalide.",
      en: "Invalid description format."
    }
  },
  // Files: picture/logo or other attachments
  // file: { maxSizeMB, types } types can be 'image', 'pdf', 'doc', 'any' or explicit mime list
  picture: {
    required: {
        fr: "La photo est requise.",
        en: "Picture is required."
    },
    file: {
      maxSizeMB: 5,
      types: ['image'], // allowed groups or mime types
      fr: "La taille maximale autorisée pour l'image est 5MB. Formats autorisés: png, jpg, jpeg, webp.",
      en: "Max image size is 5MB. Allowed formats: png, jpg, jpeg, webp."
    }
  }
};

/*
Notes d'utilisation :
- Les clés `pattern.value` supportent les valeurs: "email","spaced_name","name","plaintext","url" ou une regex string/RegExp.
- La validation d'égalité (ex: confirm_password == password) est une vérification cross-field à effectuer dans la logique du formulaire,
  Validator.validate telle quelle ne fait que valider champs individuellement.
- Pour la validation `file` :
    - vérifie la taille : file.size (octets) <= maxSizeMB * 1024 * 1024
    - vérifie le type :
        - pour 'image' : accepte image/png, image/jpeg, image/webp, image/svg+xml
        - pour 'pdf'  : application/pdf
        - pour 'doc'  : application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
        - ou accepte une liste explicite de mime types
- Exemple rapide de check file :
    const isAllowedType = (file, types) => {
      const mime = file.type;
      if (types.includes('image') && mime.startsWith('image/')) return true;
      if (types.includes('pdf') && mime === 'application/pdf') return true;
      if (types.includes('doc') && ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mime)) return true;
      if (types.includes('any')) return true;
      // or explicit mime list: types may contain 'image/png' etc.
      return types.includes(mime);
    }
*/

export { registerRules, companyValidationRules };
// export default registerRules;