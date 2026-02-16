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

// blog
// Sadece blog.html'de çalışsın
const blogGrid = document.getElementById('blog-grid');
if (blogGrid) {
  fetch('posts.json')
    .then(r => r.json())
    .then(posts => {
      if (!posts.length) {
        blogGrid.innerHTML = '<div class="blog-empty"><i class="fas fa-pen"></i><p>Henüz yazı eklenmemiş.</p></div>';
        return;
      }
      blogGrid.innerHTML = posts.map(post => {
        const img = post.kapak
          ? '<img src="' + post.kapak + '" class="blog-card-img" alt="' + post.baslik + '" onerror="this.outerHTML=\'<div class=\\\"blog-card-img-placeholder\\\"><i class=\\\"fas fa-newspaper\\\"></i></div>\'">'
          : '<div class="blog-card-img-placeholder"><i class="fas fa-newspaper"></i></div>';
        return '<a href="' + post.id + '.html" class="blog-card">' +
          img +
          '<div class="blog-card-body">' +
            '<div class="blog-card-meta">' +
              '<span class="blog-card-tag">' + post.kategori + '</span>' +
              '<span class="blog-card-date"><i class="fas fa-calendar-alt"></i> ' + post.tarih + '</span>' +
            '</div>' +
            '<h3>' + post.baslik + '</h3>' +
            '<p>' + post.ozet + '</p>' +
            '<span class="blog-card-link">Devamını Oku <i class="fas fa-arrow-right"></i></span>' +
          '</div></a>';
      }).join('');
    })
    .catch(() => {
      blogGrid.innerHTML = '<div class="blog-empty"><i class="fas fa-exclamation-circle"></i><p>Yazılar yüklenemedi.</p></div>';
    });
}
