// Sayac Animasyonu (M ve K destekli)
document.addEventListener("DOMContentLoaded", function () {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const parseNumber = (text) => {
    const hasPlus = text.includes('+');
    const hasM = text.includes('M');
    const hasK = text.includes('K');
    
    let number = parseFloat(text.replace(/[+MK]/g, ''));
    
    if (hasM) number *= 1000000;
    if (hasK) number *= 1000;
    
    return { number, hasPlus, hasM, hasK };
  };

  const formatNumber = (num, hasM, hasK) => {
    if (hasM) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (hasK) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return Math.floor(num).toString();
  };

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const text = stat.innerText;
      const { number: targetNumber, hasPlus, hasM, hasK } = parseNumber(text);
      const duration = 2000;
      const startTime = performance.now();

      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = easeOutQuart * targetNumber;
        
        stat.innerText = formatNumber(currentNumber, hasM, hasK) + (hasPlus ? '+' : '');
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.innerText = formatNumber(targetNumber, hasM, hasK) + (hasPlus ? '+' : '');
        }
      };
      
      requestAnimationFrame(updateNumber);
    });
  };

  // Scroll ile baslat
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
});

// WhatsApp buton scroll animasyonu
const whatsappButton = document.querySelector('.whatsapp-button');

if (whatsappButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      whatsappButton.classList.add('show');
      whatsappButton.classList.remove('hide');
    } else {
      whatsappButton.classList.add('hide');
      whatsappButton.classList.remove('show');
    }
  });
}

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navDropdown = document.querySelector('.nav-dropdown');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Mobilde dropdown acma
if (navDropdown) {
  navDropdown.addEventListener('click', (e) => {
    if (window.innerWidth <= 968) {
      e.preventDefault();
      navDropdown.classList.toggle('active');
    }
  });
}

// Menu disina tiklayinca kapat
document.addEventListener('click', (e) => {
  if (hamburger && navLinks) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  }
});