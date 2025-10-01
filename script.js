// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelector('input[placeholder="Sujet"]').value;
    const message = this.querySelector('textarea').value;
    
    // Validation basique
    if (!name || !email || !subject || !message) {
        showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
        return;
    }
    
    // Simulation d'envoi (remplacer par votre logique d'envoi)
    console.log('Données du formulaire:', { name, email, subject, message });
    
    // Afficher le message de succès
    showNotification('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.', 'success');
    
    // Réinitialiser le formulaire
    this.reset();
});

// Fonction pour afficher les notifications
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Ajouter les styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Style pour le bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Fermer la notification
    function closeNotification() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Événements de fermeture
    closeBtn.addEventListener('click', closeNotification);
    setTimeout(closeNotification, 5000); // Fermer automatiquement après 5 secondes
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments pour l'animation
document.querySelectorAll('section, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(248, 249, 250, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = 'var(--light-color)';
        nav.style.backdropFilter = 'none';
    }
});

// Highlight active navigation link
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Ajouter le style pour le lien actif
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-links a.active {
        color: var(--accent-color) !important;
    }
    .nav-links a.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeLinkStyle);

// Animation des compétences au survol
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Contrôle de la lecture des animations (pour l'accessibilité)
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Désactiver les animations si l'utilisateur préfère les réduire
if (reducedMotion) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none !important';
        el.style.transition = 'none !important';
    });
}

// Gestion du chargement de la page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Ajouter un style pour le chargement
    const loadStyle = document.createElement('style');
    loadStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadStyle);
});

// Fonction pour le téléchargement du CV (exemple)
function downloadCV() {
    // Simuler le téléchargement d'un CV
    showNotification('Téléchargement du CV en cours...', 'success');
    
    // Ici, vous ajouteriez la logique réelle de téléchargement
    setTimeout(() => {
        showNotification('CV téléchargé avec succès!', 'success');
    }, 1000);
}

// Ajouter un écouteur d'événement pour le téléchargement du CV (si vous ajoutez un bouton)
document.addEventListener('DOMContentLoaded', function() {
    // Exemple: si vous avez un bouton avec l'ID download-cv
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCV);
    }
});

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Temps de chargement de la page: ${loadTime}ms`);
});

// Export des fonctions principales (pour une utilisation étendue)
window.Portfolio = {
    showNotification,
    downloadCV,
    init: function() {
        console.log('Portfolio initialisé avec succès');
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    window.Portfolio.init();
});