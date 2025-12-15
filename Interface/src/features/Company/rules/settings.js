const accountRules = {
    username: {
        empty: {
            fr: "Le nom d'utilisateur est requis",
            en: "Username is required"
        },
        minlength: {
            value: 2,
            fr: "Le nom d'utilisateur doit contenir au moins 2 caractères",
            en: "Username must be at least 2 characters"
        },
        maxlength: {
            value: 15,
            fr: "Le nom d'utilisateur ne peut pas dépasser 15 caractères",
            en: "Username cannot exceed 15 characters"
        }
    },
    email: {
        empty: {
            fr: "L'adresse e-mail est requise",
            en: "Email address is required"
        },
        pattern: {
            value: "email",
            fr: "Format d'e-mail invalide",
            en: "Invalid email format"
        }
    },
    password: {
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

const companyRules = {
    name: {
        empty: {
            fr: "Le nom de l'entreprise est requis",
            en: "Company name is required"
        },
        minlength: {
            value: 2,
            fr: "Le nom de l'entreprise doit contenir au moins 2 caractères",
            en: "Company name must be at least 2 characters"
        },
        maxlength: {
            value: 30,
            fr: "Le nom de l'entreprise ne peut pas dépasser 30 caractères",
            en: "Company name cannot exceed 30 characters"
        },
        pattern: {
            value: 'spaced_name',
            fr: "Nom invalide — seuls les lettres, chiffres, espaces et . _ - sont autorisés",
            en: "Invalid name — only letters, numbers, spaces and . _ - are allowed"
        }
    },
    brief: {
        empty: {
            fr: "La description de l'entreprise est requise",
            en: "Company description is required"
        },
        minlength: {
            value: 10,
            fr: "La description est trop courte (minimum 10 caractères)",
            en: "Description is too short (minimum 10 characters)"
        },
        maxlength: {
            value: 300,
            fr: "La description est trop longue (maximum 300 caractères)",
            en: "Description is too long (maximum 300 characters)"
        },
        pattern: {
            value: 'plaintext',
            fr: "Le format de la description est invalide",
            en: "Invalid description format"
        }
    }
}

export {
    accountRules,
    companyRules
}