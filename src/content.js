const APIUrl = "https://api.epitest.eu/me/";
const types = {
    TOKEN: "token",
    YEAR: "year",
};

// Récupère le token pour l'API
function getToken() {
    if (localStorage['argos-api.oidc-token']) {
        return types.TOKEN = localStorage['argos-api.oidc-token'].replace(/"/g, '');
    } else {
        console.warn('Token not found in localStorage.');
        return null;
    }
}

// Récupère l'ID du projet depuis l'URL
function getProjectId() {
    const url = window.location.href;
    const match = url.match(/\/Project\/(\d+)/);
    if (match) {
        return match[1];
    } else {
        console.warn("No project ID found in the URL.");
        return null;
    }
}

// Récupère les détails du projet depuis l'API
function fetchProjectDetails(projectId, token) {
    if (!projectId || !token) {
        console.error("Missing project ID or token.");
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
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Project data:", data);
            updateProgressBar(data);
        })
        .catch(error => {
            console.error("Error fetching project data:", error);
        });
}

// Calcule le pourcentage de réussite
function calculateSuccessPercentage(skills) {
    let totalTests = 0;
    let passedTests = 0;

    skills.forEach(skill => {
        skill.FullSkillReport.tests.forEach(test => {
            totalTests++;
            if (test.passed) {
                passedTests++;
            }
        });
    });

    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
}

// Ajoute la barre de progression au DOM
function addProgressBar(container, percentage) {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'taken-into-account-progress-container';

    const progressBar = document.createElement('div');
    progressBar.className = 'taken-into-account-progress-bar';
    progressBar.style.width = `${percentage}%`;
    progressBar.style.textAlign = 'center';
    progressBar.style.color = 'white';
    progressBar.textContent = `${percentage}%`;

    progressBarContainer.appendChild(progressBar);
    container.insertBefore(progressBarContainer, container.firstChild);
}

// Met à jour la barre de progression en fonction des données de l'API
function updateProgressBar(apiData) {
    const skills = apiData.skills;
    const percentage = calculateSuccessPercentage(skills);

    // Find the "Prerequisites met" element
    const prerequisitesElement = document.querySelector('.mdl-typography--title-color-contrast.mdl-color-text--black');
    if (prerequisitesElement) {
        addProgressBar(prerequisitesElement.parentElement, percentage);
    }
}

// Observe les changements d'URL
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

// Exécute les fonctions et observe les changements d'URL
observeUrlChanges(() => {
    const projectId = getProjectId();
    const token = getToken();
    fetchProjectDetails(projectId, token);
});

document.addEventListener('DOMContentLoaded', () => {
    const projectId = getProjectId();
    const token = getToken();
    fetchProjectDetails(projectId, token);
});