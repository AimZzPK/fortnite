// SCROLL + NAV
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 60
    ? 'rgba(0,0,0,0.9)'
    : 'transparent';
});

// FADE IN OBSERVER
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// STATS COUNTER
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let count = 0;
      const step = target / (2000 / 16);
      const timer = setInterval(() => {
        count += step;
        el.textContent = Math.floor(count);
        if (count >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, 16);
      statObserver.unobserve(el);
    }
  });
});
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// NEWS
async function loadNews() {
  const grid = document.getElementById('news-grid');
  grid.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const response = await fetch('https://fortnite-api.com/v2/news/br');
    const data = await response.json();
    const motds = data.data.motds;
    grid.innerHTML = motds.map(item => `
      <div class="news-card">
        <img src="${item.image}" alt="${item.title}">
        <div class="news-content">
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    grid.innerHTML = '<p class="loading">Failed to load news.</p>';
  }
}


// CHARACTERS
async function loadCharacters() {
  const grid = document.getElementById('characters-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="loading">Loading...</p>';

  try {
    const res = await fetch('https://fortnite-api.com/v2/cosmetics/br');
    const json = await res.json();

    const skins = json.data
      .filter(item => item.type?.value === "outfit" && item.images?.icon)
      .slice(0, 8);

    grid.innerHTML = skins.map(skin => `
      <div class="card">
        <img src="${skin.images.icon}">
        <h3>${skin.name}</h3>
      </div>
    `).join('');

  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p class="loading">Error loading skins</p>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const links = document.querySelectorAll("#nav-links a");

  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove("active");
    }
  });

  loadNews();
  loadCharacters();
  // loadShop(); // alleen als functie bestaat
});


// RUN ALL
loadNews();
loadCharacters();