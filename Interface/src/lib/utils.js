
function requestFailureHandler(error, setRequestError, navigate, onBadRequest=null) {
    if (error.response) {
        const status = error.response.status;
        if (status === 400) {
            if (onBadRequest) {
                onBadRequest(error.response.data);
            } else {
                setRequestError({
                    fr: "Formulaire invalide",
                    en: "Invalid form"
                })
            }
        } else if (status === 401) {
            navigate?.('/login');
        } else if (status === 500) {
            setRequestError({
                fr: "Erreur serveur, veuillez réessayer.",
                en: "Server error, try again."
            })
        }
    } else {
        setRequestError({
            fr: "Erreur réseau. Vérifiez votre connexion.",
            en: "Network error. Please check your connection."
        });
    }
}

export {
    requestFailureHandler
}
