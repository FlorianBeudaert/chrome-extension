const APIUrl = "https://api.epitest.eu/me/";
    const types = {
        TOKEN: "token",
        YEAR: "year",
    };
    const apiData = {
        PROJECTS: "projects",
    };

    // Fonction pour récupérer l'année à partir de l'URL
    function getYear() {
        const url = window.location.href;
        const match = url.match(/#y\/(\d{4})/);
        if (match) {
            return types.YEAR = match[1];
        } else {
            console.warn('Aucune année trouvée dans l\'URL.');
            return null;
        }
    }

    // Récupération du token pour l'API (token récupéré via la connexion)
    function getToken() {
        if (localStorage['argos-api.oidc-token']) {
            return types.TOKEN = localStorage['argos-api.oidc-token'].replace(/"/g, '');
        } else {
            console.warn('Token non trouvé dans localStorage.');
            return null;
        }
    }

    // Fonction pour récupérer l'ID du projet depuis l'URL
    function getProjectId() {
        const url = window.location.href;
        const match = url.match(/\/Project\/(\d+)/);
        if (match) {
            return match[1];
        } else {
            console.warn("Aucun ID de projet trouvé dans l'URL.");
            return null;
        }
    }

    // Fonction pour effectuer une requête à l'API et récupérer les détails du projet
    function fetchProjectDetails(projectId, token) {
        if (!projectId || !token) {
            console.error("ID de projet ou token manquant.");
            return;
        }

        const apiUrl = `${APIUrl}details/${projectId}`;
        fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Données du projet:", data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données:", error);
            });
    }

    // Surveiller les changements d'URL
    function observeUrlChanges(callback) {
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback();
            }
        });

        observer.observe(document, { subtree: true, childList: true });
    }

    // Execution des fonctions et surveillance des changements d'URL
    observeUrlChanges(() => {
        const projectId = getProjectId();
        const token = getToken();
        fetchProjectDetails(projectId, token);
    });

    const projectId = getProjectId();
    const token = getToken();
    fetchProjectDetails(projectId, token);