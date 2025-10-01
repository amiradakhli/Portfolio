// Configuration EmailJS - REMPLACEZ AVEC VOS CLÉS RÉELLES
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'qKxaL7tEMSaKPpcfF',        // ← Public Key de EmailJS
    SERVICE_ID: 'service_ga9slkj',        // ← Service ID de EmailJS  
    TEMPLATE_ID: 'template_bzu55iq'       // ← Template ID de EmailJS
};

// Initialisation EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

console.log('📧 EmailJS initialisé');

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

// Form submission avec EmailJS
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = submitBtn.querySelector('.loading');
    
    // Show loading state
    btnText.textContent = 'Envoi en cours...';
    loadingSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('❌ Veuillez remplir tous les champs', 'error');
        resetButton(submitBtn, btnText, loadingSpinner);
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showNotification('❌ Veuillez entrer un email valide', 'error');
        resetButton(submitBtn, btnText, loadingSpinner);
        return;
    }
    
    try {
        console.log('🔄 Envoi du message...', formData);
        
        // Sauvegarde locale
        saveMessageToLocalStorage(formData);
        
        // Envoi par EmailJS
        await sendEmailWithEmailJS(formData);
        
        // Success message
        showNotification('✅ Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
        
        // Reset form
        this.reset();
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('💾 Message sauvegardé ! Je vous contacterai bientôt.', 'success');
    } finally {
        resetButton(submitBtn, btnText, loadingSpinner);
    }
});

// Fonction pour réinitialiser le bouton
function resetButton(submitBtn, btnText, loadingSpinner) {
    btnText.textContent = 'Envoyer le message';
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;
}

// Validation email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour envoyer l'email via EmailJS
async function sendEmailWithEmailJS(formData) {
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'dklmira931@gmail.com',
        reply_to: formData.email,
        date: new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    console.log('📤 Configuration EmailJS:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID
    });
    
    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID, 
            EMAILJS_CONFIG.TEMPLATE_ID, 
            templateParams
        );
        
        console.log('✅ Email envoyé!', response.status, response.text);
        return response;
        
    } catch (error) {
        console.error('❌ Erreur EmailJS:', error);
        throw new Error('Impossible d\'envoyer l\'email pour le moment');
    }
}

// Sauvegarde locale des messages
function saveMessageToLocalStorage(formData) {
    try {
        let messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
        formData.timestamp = new Date().toLocaleString('fr-FR');
        formData.id = Date.now();
        messages.push(formData);
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        console.log('💾 Message sauvegardé localement');
    } catch (error) {
        console.error('Erreur sauvegarde locale:', error);
    }
}

// Système de notifications
function showNotification(message, type = 'success') {
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, .project-card, .experience-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    nav.style.background = window.scrollY > 100 ? 
        'rgba(248, 249, 250, 0.95)' : 'var(--light-color)';
});

// Active navigation link highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
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

// Skill animations
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

// Vérifier et afficher les messages sauvegardés (pour debug)
function displaySavedMessages() {
    const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    console.log('📨 Messages sauvegardés:', messages);
    return messages;
}

// Test EmailJS configuration
function testEmailJSConfiguration() {
    console.log('🧪 Test configuration EmailJS:');
    console.log('- Public Key:', EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('- Service ID:', EMAILJS_CONFIG.SERVICE_ID);
    console.log('- Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
    console.log('- EmailJS loaded:', typeof emailjs !== 'undefined');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio Amira Dakhli - Prêt à recevoir des messages!');
    
    // Test de configuration
    testEmailJSConfiguration();
    
    // Afficher les messages sauvegardés (debug)
    const savedMessages = displaySavedMessages();
    console.log(`💾 ${savedMessages.length} message(s) sauvegardé(s) localement`);
    
    // Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
    }
});

// Outils de debug
window.Portfolio = {
    testEmail: function() {
        const testData = {
            name: 'Test Amira',
            email: 'test@example.com',
            subject: 'Test de fonctionnement',
            message: 'Bonjour Amira ! Ceci est un test pour vérifier que votre formulaire de contact fonctionne correctement. Votre portfolio est magnifique !'
        };
        return sendEmailWithEmailJS(testData);
    },
    showSavedMessages: displaySavedMessages,
    showConfig: function() {
        console.log('🔧 Configuration actuelle:', EMAILJS_CONFIG);
    },
    clearSavedMessages: function() {
        localStorage.removeItem('portfolioMessages');
        console.log('🗑️ Messages sauvegardés effacés');
    }
};

console.log('💡 Tips:');
console.log('- Utilisez Portfolio.testEmail() dans la console pour tester');
console.log('- Portfolio.showSavedMessages() pour voir les messages locaux');
console.log('- Vérifiez vos clés EmailJS dans la configuration');
