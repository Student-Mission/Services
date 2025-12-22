
const rule_template = {
    name: {
        required: {
            'fr': '',
            'en': ''
        },
        minlength: {
            value: 3,
            fr: '',
            en: ''
        },
        maxlength: {
            value: 15,
            fr: '',
            en: ''
        },
        min: {
            value: 2
        },
    },
    skills: {
        choices: {
            value: ['c++', 'c', 'c#'],
            en: '',
            fr: ''
        }
    },
    birthdate: {
        date: {
            format: '',// Optional
            before: '', // Limit optional
        }
    },
    email: {

    }
}

let elems = []

// Validation pour name / username
// - Lettres Unicode, chiffres, underscores, tirets, points
// - Pas de séparateurs consécutifs ni en début/fin
// - Longueur 3-30
const NAME_REGEX = /^(?![_\-.])(?!.*[_\-.]$)(?!.*[_\-.]{2})[\p{L}\p{N}._-]{3,30}$/u;

// Validation pour plaintext (description/article)
// - Autorise la plupart des caractères imprimables mais refuse les chevrons < et >
// - Empêche explicitement les balises <script> (simple protection)
// - Longueur maximale configurable (ici 1..2000)
const PLAINTEXT_REGEX = /^(?![\s\S]*<\s*\/?\s*script\b)(?=[\s\S]{1,2000}$)[^\x00<>]+$/iu;


const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;


const URL_REGEX = /^(https?:\/\/)(?:[^\s:@\/]+:\S+@)?(?:(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}|localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d{2,5})?(?:[\/?#][^\s]*)?$/i;

// Nom autorisant des espaces au milieu, pas d'espaces en début/fin,
// pas d'espaces consécutifs, pas de caractères spéciaux consécutifs,
// Lettres Unicode, chiffres, _, - et .
const NAME_WITH_SPACES_REGEX = /^(?!\s)(?!.*\s$)(?!.*[_\-.]{2})(?!.*\s{2})[\p{L}\p{N}._\-\s]{3,30}$/u;

/* ---------- Helpers file / mime ---------- */

const MB = (n) => n * 1024 * 1024;

const DEFAULT_IMAGE_MIMES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml'
];

const DEFAULT_DOC_MIMES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

function expandTypesToMimes(types = []) {
  // types can contain 'image','pdf','doc','any' or explicit mime types
  const mimes = new Set();
  types.forEach(t=>{
    if (!t) return;
    const tt = t.toLowerCase();
    if (tt === 'any') {
      mimes.add('any');
      return;
    }
    if (tt === 'image') {
      DEFAULT_IMAGE_MIMES.forEach(m=>mimes.add(m));
      return;
    }
    if (tt === 'pdf') {
      mimes.add('application/pdf');
      return;
    }
    if (tt === 'doc') {
      DEFAULT_DOC_MIMES.forEach(m=>mimes.add(m));
      return;
    }
    // explicit mime
    mimes.add(t);
  });
  return Array.from(mimes);
}

function isFileObject(o) {
  return (typeof File !== 'undefined' && o instanceof File) || (o && typeof o === 'object' && typeof o.size === 'number' && typeof o.type === 'string');
}

function normalizeFileList(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  // FileList or similar
  if (typeof input.length === 'number' && input[0]) {
    // convert to array
    return Array.prototype.slice.call(input);
  }
  // single File
  if (isFileObject(input)) return [input];
  return [];
}

function validateFileObject(input, fileRule = {}) {
  // returns null if ok, or an {fr,en} object if error
  const files = normalizeFileList(input);
  if (files.length === 0) return null; // no file => nothing to validate here

  const maxSizeMB = fileRule.maxSizeMB || fileRule.maxSize || fileRule.maxSizeMb || null;
  const allowedTypes = fileRule.types ? expandTypesToMimes(Array.isArray(fileRule.types) ? fileRule.types : [fileRule.types]) : null;
  const msgFr = fileRule.fr || fileRule.messageFr || null;
  const msgEn = fileRule.en || fileRule.messageEn || null;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!isFileObject(f)) {
      // unknown object, skip or mark invalid
      return {
        fr: msgFr || "Fichier invalide",
        en: msgEn || "Invalid file"
      };
    }
    if (maxSizeMB) {
      const maxBytes = MB(maxSizeMB);
      if (f.size > maxBytes) {
        return {
          fr: msgFr || `Fichier trop volumineux (max ${maxSizeMB}MB)`,
          en: msgEn || `File too large (max ${maxSizeMB}MB)`
        };
      }
    }
    if (allowedTypes && allowedTypes.length > 0) {
      if (allowedTypes.includes('any')) {
        // accept
      } else {
        const mime = (f.type || '').toLowerCase();
        // image/* check if allowedTypes includes any image mime
        if (mime.startsWith('image/')) {
          // if any image mime present in allowedTypes it's ok
          const hasImage = allowedTypes.some(m => m.startsWith('image/'));
          if (!hasImage && !allowedTypes.includes(mime)) {
            return {
              fr: msgFr || "Type de fichier non autorisé",
              en: msgEn || "File type not allowed"
            };
          }
        } else {
          // check explicit mime
          if (!allowedTypes.includes(mime)) {
            return {
              fr: msgFr || "Type de fichier non autorisé",
              en: msgEn || "File type not allowed"
            };
          }
        }
      }
    }
  }

  return null;
}

/* ---------- Validator class ---------- */

class Validator {
    constructor() {

    }

    static validate(form={}, rule={}) {
        const errors = {};
        Object.keys(rule).forEach((field)=>{

            // Required
            if (rule[field].required && !form[field]) {
                errors[field] = {
                    fr: rule[field].required.fr,
                    en: rule[field].required.en
                }
                return;
            }

            // equalsField (cross-field equality check)
            if (rule[field].equalsField && form[field] !== undefined) {
                const otherField = rule[field].equalsField.field;
                if (form[otherField] === undefined || form[field] !== form[otherField]) {
                    errors[field] = {
                        fr: rule[field].equalsField.fr || "Les champs ne correspondent pas",
                        en: rule[field].equalsField.en || "Fields do not match"
                    }
                    return;
                }
            }

            // FILE validation (supports File, FileList or Array<File>)
            if (rule[field].file && form[field]) {
                const fileError = validateFileObject(form[field], rule[field].file);
                if (fileError) {
                    errors[field] = fileError;
                    return;
                }
            }

            // min length
            if (rule[field].minlength && typeof form[field] === "string" && form[field].length < rule[field].minlength.value) {
                errors[field] = {
                    fr: rule[field].minlength.fr,
                    en: rule[field].minlength.en
                }
                return;
            }

            // max length
            if (rule[field].maxlength && typeof form[field] === "string" && form[field].length > rule[field].maxlength.value) {
                errors[field] = {
                    fr: rule[field].maxlength.fr,
                    en: rule[field].maxlength.en
                }
                return;
            }

            // Empty
            if (rule[field].empty && typeof form[field] === "string" && form[field].trim().length === 0) {
                errors[field] = {
                    fr: rule[field].empty.fr,
                    en: rule[field].empty.en
                }
                return;
            }

            // Pattern
            if (rule[field].pattern && typeof form[field] === "string") {
                let regex;
                if (rule[field].pattern.value === "email") {
                    regex = EMAIL_REGEX;
                }
                else if (rule[field].pattern.value === 'name')
                    regex = NAME_REGEX;
                else if (rule[field].pattern.value === 'plaintext')
                    regex = PLAINTEXT_REGEX;
                else if (rule[field].pattern.value === 'url')
                    regex = URL_REGEX;
                else if (rule[field].pattern.value === 'spaced_name')
                    regex = NAME_WITH_SPACES_REGEX;
                else if (rule[field].pattern.value instanceof RegExp) {
                    regex = rule[field].pattern.value;
                } else if (typeof rule[field].pattern.value === "string") {
                    regex = new RegExp(rule[field].pattern.value);
                }
                if (regex && !regex.test(form[field])) {
                    errors[field] = {
                        fr: rule[field].pattern.fr || "Format invalide",
                        en: rule[field].pattern.en || "Invalid format"
                    };
                    return;
                }
            }

            // Choices
            if (rule[field].choices && rule[field].choices.value instanceof Array ) {
                console.log(`Choice field ${field}`)
                if (form[field].length === 0) {
                    errors[field] = {
                        fr: `${rule[field].label} est requis`,
                        en: `${rule[field].label} is required`
                    }
                    return;
                }
                // if (rule[field].choices.value.findIndex((value, _)=>(value === form[field])) === -1) {
                //     console.log(form[field]);
                //     errors[field] = {
                //         fr: rule[field].choices.fr,
                //         en: rule[field].choices.en
                //     }
                //     return;
                // }
            }

            // min (for number)
            if (rule[field].min && typeof form[field] == "number" && form[field] < rule[field].min.value) {
                errors[field] = {
                    fr: rule[field].min.fr,
                    en: rule[field].min.en
                }
                return;
            }

            // max (for number)
            if (rule[field].max && typeof form[field] === "number" && form[field] > rule[field].max.value) {
                errors[field] = {
                    fr: rule[field].max.fr,
                    en: rule[field].max.en
                }
                return;
            }
            // Date validation
            if (rule[field].date && form[field]) {
                let dateValue = new Date(form[field]);
                if (isNaN(dateValue.getTime())) {
                    errors[field] = {
                        fr: rule[field].date.fr || "Date invalide",
                        en: rule[field].date.en || "Invalid date"
                    };
                    return;
                }
                // Format check (ex: YYYY-MM-DD)
                if (rule[field].date.format && rule[field].date.format === "YYYY-MM-DD") {
                    const regex = /^\\d{4}-\\d{2}-\\d{2}$/;
                    if (!regex.test(form[field])) {
                        errors[field] = {
                            fr: rule[field].date.fr || "Format de date invalide",
                            en: rule[field].date.en || "Invalid date format"
                        };
                        return;
                    }
                }
                // Before limit
                if (rule[field].date.before) {
                    let beforeDate = new Date(rule[field].date.before);
                    if (!isNaN(beforeDate.getTime()) && dateValue > beforeDate) {
                        errors[field] = {
                            fr: rule[field].date.fr || "La date doit être avant " + rule[field].date.before,
                            en: rule[field].date.en || "Date must be before " + rule[field].date.before
                        };
                        return;
                    }
                }
            }
        })
        return errors;
    }
}

export default Validator;