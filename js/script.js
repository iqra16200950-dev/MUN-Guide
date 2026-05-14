document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});


function initTabs(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const tabsWrapper = container.closest('.container') || container.parentElement;
    const tabBtns = container.querySelectorAll('.tab-btn, .speech-tab');
    const tabContents = tabsWrapper.querySelectorAll('.tab-content, .speech-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab || btn.dataset.speech;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}


initTabs('.tabs');
initTabs('.speech-tabs');


function initCountryResearch() {
    const countrySelect = document.getElementById('countrySelect');
    const countryInfo = document.getElementById('countryInfo');
    const randomBtn = document.getElementById('randomCountry');

    if (!countrySelect || !countryInfo) return;

    
    fetch('../data/countries.json')
        .then(response => response.json())
        .then(data => {
            
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code;
                option.textContent = country.name;
                countrySelect.appendChild(option);
            });

            countrySelect.addEventListener('change', (e) => {
                const code = e.target.value;
                if (code) {
                    displayCountry(data.find(c => c.code === code));
                } else {
                    countryInfo.classList.add('hidden');
                }
            });

            
            randomBtn.addEventListener('click', () => {
                const randomCountry = data[Math.floor(Math.random() * data.length)];
                countrySelect.value = randomCountry.code;
                displayCountry(randomCountry);
            });
        })
        .catch(error => {
            console.error('Error loading countries:', error);
        });
}

function displayCountry(country) {
    const countryInfo = document.getElementById('countryInfo');
    document.getElementById('countryFlag').textContent = country.flag;
    document.getElementById('countryName').textContent = country.name;
    document.getElementById('countryRegion').textContent = country.region;

  
    const factsHtml = `
        <div>Population: ${country.population.toLocaleString()}</div>
        <div>Capital: ${country.capital}</div>
        <div>UN Member Since: ${country.un_since}</div>
        <div>GDP Rank: #${country.gdp_rank}</div>
    `;
    document.getElementById('countryFacts').innerHTML = factsHtml;

   
    document.getElementById('countryPolicy').innerHTML = `
        <p><strong>General Stance:</strong> ${country.policy_stance}</p>
        <p><strong>Key Alliances:</strong> ${country.key_alliances}</p>
    `;

    const topicsHtml = country.mun_topics.map(topic => 
        `<span class="country-topic">${topic}</span>`
    ).join('');
    document.getElementById('countryTopics').innerHTML = topicsHtml;

    countryInfo.classList.remove('hidden');
}


if (document.getElementById('countrySelect')) {
    initCountryResearch();
}


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



window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});


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


document.querySelectorAll('.card, .feature-card, .step-card, .role-card, .pillar-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(card);
});