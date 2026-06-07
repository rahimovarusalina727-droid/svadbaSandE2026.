// Дата свадьбы
const weddingDate = new Date('2026-05-23T14:00:00').getTime();

// Открытие приглашения
function openInvitation() {
    document.querySelector('.hero').style.display = 'none';
    const mainContent = document.getElementById('mainContent');
    mainContent.classList.remove('hidden');
    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 100);
    
    // Запуск обратного отсчета
    startCountdown();
    
    // Запуск галереи
    startGallery();
    
    // Плавная прокрутка к началу
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Обратный отсчет
function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdown').innerHTML = '<h3>🎉 Сегодня наша свадьба! 🎉</h3>';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Галерея с медленной сменой фото
let currentSlideIndex = 0;
let galleryInterval;

function startGallery() {
    const slides = document.querySelectorAll('.photo-slide');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }
    
    // Смена фото каждые 5 секунд (медленно)
    galleryInterval = setInterval(nextSlide, 5000);
}

function currentSlide(index) {
    clearInterval(galleryInterval);
    currentSlideIndex = index - 1;
    const slides = document.querySelectorAll('.photo-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
    });
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Возобновить автопрокрутку
    startGallery();
}

// Открытие карты
function openMap() {
    const address = '1-й Красногвардейский пр., 15, Москва';
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
}

// Отправка формы
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        attendance: formData.get('attendance'),
        allergies: formData.get('allergies') || 'Нет',
        drinks: formData.getAll('drinks[]').join(', ') || 'Нет предпочтений'
    };
    
    const formMessage = document.getElementById('formMessage');
    const submitBtn = this.querySelector('.submit-btn');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
        const response = await fetch('send.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            formMessage.textContent = '✨ Спасибо! Ваш ответ успешно отправлен!';
            formMessage.className = 'form-message success';
            this.reset();
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        formMessage.textContent = '❌ Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.';
        formMessage.className = 'form-message error';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

// Плавная прокрутка для якорных ссылок
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

// Анимация при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдение за секциями
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
});