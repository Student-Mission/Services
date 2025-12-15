
const loginRules = {
  email: {
    pattern: {
      value: "email",
      fr: "N'est pas une adresse valide.",
      en: "Must be a valid address.",
    },
    required: {
      fr: "L'email est requis.",
      en: "Email address required.",
    },
  },
  password: {
    required: {
      fr: "Le mot de passe est requis.",
      en: "Password required.",
    },
  },
};

export default loginRules;
