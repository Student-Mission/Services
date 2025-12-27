const rateRules = {
    quality_rate: {
        required: {
            fr: "La note de qualité est requise.",
            en: "Quality rating is required."
        },
        min: {
            value: 1,
            fr: "La note de qualité doit être au minimum 1.",
            en: "Quality rating must be at least 1."
        },
        max: {
            value: 10,
            fr: "La note de qualité ne peut pas dépasser 10.",
            en: "Quality rating cannot exceed 10."
        }
    },
    deadline_rate: {
        required: {
            fr: "La note du respect des délais est requise.",
            en: "Deadline rating is required."
        },
        min: {
            value: 1,
            fr: "La note du respect des délais doit être au minimum 1.",
            en: "Deadline rating must be at least 1."
        },
        max: {
            value: 10,
            fr: "La note du respect des délais ne peut pas dépasser 10.",
            en: "Deadline rating cannot exceed 10."
        }
    },
}

const overallFeedback = {
    feedback: {
        required: {
            fr: "Le commentaire général est requis.",
            en: "Overall feedback is required."
        },
        empty: {
            fr: "Le commentaire ne peut pas être vide.",
            en: "Feedback cannot be empty."
        },
        maxlength: {
            value: 300,
            fr: "Le commentaire ne doit pas dépasser 300 caractères.",
            en: "Feedback cannot exceed 300 characters."
        },
        pattern: {
            value: 'plaintext',
            fr: "Le texte doit être du texte brut.",
            en: "Text must be plain text."
        }
    } 
}

const qualityFeedback = {
    quality_feedback: {
        required: {
            fr: "Le commentaire sur la qualité est requis.",
            en: "Quality feedback is required."
        },
        empty: {
            fr: "Le commentaire sur la qualité ne peut pas être vide.",
            en: "Quality feedback cannot be empty."
        },
        maxlength: {
            value: 300,
            fr: "Le commentaire sur la qualité ne doit pas dépasser 300 caractères.",
            en: "Quality feedback cannot exceed 300 characters."
        },
        pattern: {
            value: 'plaintext',
            fr: "Le texte doit être du texte brut.",
            en: "Text must be plain text."
        }
    }
}

const deadlineFeedback = {
    deadline_feedback: {
        required: {
            fr: "Le commentaire sur le respect des délais est requis.",
            en: "Deadline feedback is required."
        },
        empty: {
            fr: "Le commentaire sur le respect des délais ne peut pas être vide.",
            en: "Deadline feedback cannot be empty."
        },
        maxlength: {
            value: 300,
            fr: "Le commentaire sur le respect des délais ne doit pas dépasser 300 caractères.",
            en: "Deadline feedback cannot exceed 300 characters."
        },
        pattern: {
            value: 'plaintext',
            fr: "Le texte doit être du texte brut.",
            en: "Text must be plain text."
        }
    }
}

export {
    rateRules,
    overallFeedback,
    qualityFeedback,
    deadlineFeedback
}