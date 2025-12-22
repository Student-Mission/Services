
const personalDetailsRules = {
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
}

const bioRules = {
    bio: {
    minlength: {
      value: 20,
      fr: "La bio est trop courte.",
      en: "Bio is too short."
    },
    maxlength: {
      value: 500,
      fr: "La bio est trop longue.",
      en: "Bio is too long."
    },
    pattern: {
      value: "plaintext",
      fr: "Format de bio invalide.",
      en: "Invalid bio format."
    }
  },
}

const pictureRules = {
    picture: {
    // required: {
    //     fr: "La photo est requise.",
    //     en: "Picture is required."
    // },
    file: {
      maxSizeMB: 5,
      types: ['image'], // allowed groups or mime types
      fr: "La taille maximale autorisée pour l'image est 5MB. Formats autorisés: png, jpg, jpeg, webp.",
      en: "Max image size is 5MB. Allowed formats: png, jpg, jpeg, webp."
    }
  }
}

const passwordRules = {
    old_password: {
        empty: {
            fr: "Le mot de passe est requis",
            en: "Password is required"
        },
        minlength: {
            value: 4,
            fr: "Le mot de passe doit contenir au moins 4 caractères",
            en: "Password must be at least 4 characters"
        },
        maxlength: {
            value: 15,
            fr: "Le mot de passe ne peut pas dépasser 15 caractères",
            en: "Password cannot exceed 15 characters"
        }
    },
    new_password: {
        empty: {
            fr: "Le mot de passe est requis",
            en: "Password is required"
        },
        minlength: {
            value: 4,
            fr: "Le mot de passe doit contenir au moins 4 caractères",
            en: "Password must be at least 4 characters"
        },
        maxlength: {
            value: 15,
            fr: "Le mot de passe ne peut pas dépasser 15 caractères",
            en: "Password cannot exceed 15 characters"
        }
    }
}

const proofRules = {
  title: {
        empty: {
            fr: "Le titre est requis",
            en: "Title is required"
        },
        minlength: {
            value: 6,
            fr: "Le titre doit contenir au moins 6 caractères",
            en: "Title must be at least 6 characters"
        },
        maxlength: {
            value: 30,
            fr: "Le titre ne peut pas dépasser 30 caractères",
            en: "Title cannot exceed 30 characters"
        },
        pattern: {
            value: 'spaced_name',
            fr: "Titre invalide — seuls les lettres, chiffres, espaces et . _ - sont autorisés",
            en: "Invalid title — only letters, numbers, spaces and . _ - are allowed"
        }
    },
    document: {
        required: {
            fr: "Le document est requis.",
            en: "Document is required."
        },
        file: {
            maxSizeMB: 3,
            types: ['pdf', 'docx'], // allowed groups or mime types
            fr: "La taille maximale autorisée pour le document est 3MB. Formats autorisés: pdf, docx.",
            en: "Max document size is 3MB. Allowed formats: pdf, docx."
        }
    }
}


export {
    personalDetailsRules,
    bioRules,
    pictureRules,
    passwordRules,
    proofRules
}
