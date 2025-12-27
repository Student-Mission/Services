import { FaUser } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import {BsExclamation, BsExclamationOctagonFill, BsStack} from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa6";
import { MdQuestionAnswer } from "react-icons/md";

const alertTranslator = {
    STUDENT_PROOF_NEEDED: (data, language='en')=>{
        const params = data.context_data;
        let alert = {
            title: '',
            message: ``,
            linkText: "",
            link: `/student/profile`,
            style: {
                icon: IoDocument,
                class: 'text-blue-400 border-blue-500/30 bg-blue-300/40'
            }
        }
        if (language === 'en') {
            alert.title = 'Proof required';
            alert.message = 'Please upload the required proof document to complete your profile. Visit your profile to add them.';
            alert.linkText = "Complete profile";
        } else if (language === 'fr') {
            alert.title = 'Pièce justificative requise';
            alert.message = 'Veuillez télécharger les pièces justificatives requises pour compléter votre profil. Rendez-vous sur votre profil pour les ajouter.';
            alert.linkText = "Compléter le profil";
        }
        return alert;
    },
    COMPANY_PROOF_NEEDED: (data, language='en')=>{
        let alert = {
            title: '',
            message: ``,
            link: `/company/settings`,
            style: {
                icon: IoDocument,
                class: 'text-blue-400 border-blue-500/30 bg-blue-300/40'
            }
        }
        if (language === 'en') {
            alert.title = 'Company Proof required';
            alert.message = 'Please upload the required proof documents to complete your profile. Visit your profile to add them.';
            alert.linkText = "Complete company profile";
        } else if (language === 'fr') {
            alert.title = "Pièce justificative d'entreprise requise";
            alert.message = 'Veuillez télécharger les pièces justificatives requises pour compléter votre profil. Rendez-vous sur votre profil pour les ajouter.';
            alert.linkText = "Compléter le profil entreprise";
        }
        return alert;
    },
    EMAIL_VALIDATION_NEEDED: (data, language='en')=>{
        const params = data.context_data;
        let alert = {
            title: '',
            message: ``,
            link: params.user_type === 'company' ? `/company/settings`: '/student/profile',
            style: {
                icon: FaUser,
                class: 'text-green-500 border-green-500/30 bg-green-300/40'
            }
        }
        if (language === 'en') {
            alert.title = 'Email validation required';
            alert.message = "Please validate your email address. Check your inbox for the confirmation link. If you didn't receive it, request a new validation email from your profile settings.";
            alert.linkText = "Validate email";
        } else if (language === 'fr') {
            alert.title = "Validation de l'adresse e‑mail requise";
            alert.message = "Veuillez valider votre adresse e‑mail. Consultez votre boîte de réception pour le lien de confirmation. Si vous ne l'avez pas reçu, demandez un nouvel e‑mail de validation depuis les paramètres de votre profil.";
            alert.linkText = "Valider l'e-mail";
        }
        return alert;
    },
    SECURITY_UPDATED: (data, language='en')=>{
        let alert = {
            title: '',
            message: ``,
            link: null,
            style: {
                icon: BsExclamationOctagonFill,
                class: 'text-orange-500 border-orange-500/30 bg-orange-300/40'
            }
        }
        if (language === 'en') {
            alert.title = 'Security settings updated';
            alert.message = "Your security settings have been successfully updated. If you did not make this change, review your account security and contact support.";
        } else if (language === 'fr') {
            alert.title = 'Sécurité mise à jour';
            alert.message = "Les paramètres de sécurité de votre compte ont été mis à jour avec succès. Si vous n'êtes pas à l'origine de cette modification, vérifiez la sécurité de votre compte et contactez le support.";
        }
        return alert;
    },
    MISSION_UPDATED: (data, language='en')=>{
        const params = data.context_data;
        const {mission_uuid} = params;

        let alert = {
            title: '',
            message: ``,
            link: mission_uuid ? `/student/find-missions/${mission_uuid}`: '/student/find-missions',
            style: {
                icon: BsStack,
                class: 'text-green-600 border-green-600/30 bg-green-400/30'
            }
        }
        if (language === 'en') {
            alert.title = 'Mission updated';
            alert.message = 'A mission has been updated. Visit the mission page to see the latest details.';
            alert.linkText = "View mission";
        } else if (language === 'fr') {
            alert.title = 'Mission mise à jour';
            alert.message = 'Une mission a été mise à jour. Consultez la page de la mission pour voir les dernières informations.';
            alert.linkText = "Voir la mission";
        }
        return alert;
    },
    NEW_APPLICATION: (data, language='en')=>{
        const {mission_uuid} = data.context_data;
        let alert = {
            title: '',
            message: ``,
            link: mission_uuid ? `/company/missions/${mission_uuid}`: '/company/missions',
            style: {
                icon: FaUserPlus,
                class: 'text-blue-600 border-blue-600/20 bg-blue-400/40'
            }
        }

        if (language === 'en') {
            alert.title = 'New application';
            alert.message = 'A new application has been submitted for one of your missions. Review the application on the mission page.';
            alert.linkText = "View application";
        } else if (language === 'fr') {
            alert.title = "Nouvelle candidature";
            alert.message = "Une nouvelle candidature a été soumise pour l'une de vos missions. Consultez la page de la mission pour examiner la candidature.";
            alert.linkText = "Voir la candidature";
        }
        return alert;
    },
    APPLICATION_RESPONSE: (data, language='en')=>{
        const {mission_uuid, application_status} = data.context_data;
        let alert = {
            title: '',
            message: ``,
            link: mission_uuid ? `/student/find-missions/${mission_uuid}`: '/student/find-missions',
            style: {
                icon: MdQuestionAnswer,
                class: 'text-[#02616b] border-[#02616b30] bg-[#02616b21]'
            }
        }

        if (language === 'en') {
            if (application_status === 'confirmed') {
                alert.title = 'Application accepted';
                alert.message = 'Good news — your application has been accepted. Visit the mission page to see next steps.';
            } else if (application_status === 'declined') {
                alert.title = 'Application declined';
                alert.message = 'Your application was not accepted. Check the mission page for details and possible next steps.';
            } else {
                alert.title = 'Application update';
                alert.message = 'There is an update to your application. Visit the mission page to see the latest information.';
            }
            alert.linkText = "View application";
        } else if (language === 'fr') {
            if (application_status === 'confirmed') {
                alert.title = 'Candidature acceptée';
                alert.message = "Bonne nouvelle — votre candidature a été acceptée. Rendez‑vous sur la page de la mission pour connaître la suite.";
            } else if (application_status === 'declined') {
                alert.title = 'Candidature refusée';
                alert.message = "Votre candidature n'a pas été retenue. Consultez la page de la mission pour les détails et les étapes suivantes.";
            } else {
                alert.title = 'Mise à jour de la candidature';
                alert.message = "Une mise à jour concerne votre candidature. Rendez‑vous sur la page de la mission pour voir les informations.";
            }
            alert.linkText = "Voir la candidature";
        }
        return alert;
    },
    MISSION_SUBMITTED: (data, language='en')=>{
        const {mission_uuid} = data.context_data;

        let alert = {
            title: '',
            message: ``,
            link: mission_uuid ? `/company/missions/${mission_uuid}`: '/company/missions',
            style: {
                icon: BsStack,
                class: 'text-green-600 border-green-600/30 bg-green-400/30'
            }
        }
        if (language === 'en') {
            alert.title = 'Submission received';
            alert.message = 'A student has submitted a project for your mission. Review the submission on the mission page.';
            alert.linkText = 'View submission';
        } else if (language === 'fr') {
            alert.title = 'Rendu soumis';
            alert.message = "Un étudiant a soumis le rendu pour votre mission. Consultez la soumission sur la page de la mission.";
            alert.linkText = 'Voir le rendu';
        }
        return alert;
    }
}

export default alertTranslator;