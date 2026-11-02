document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

    // ========================================
  // LIGHT / DARK MODE TOGGLE
  // ========================================

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.querySelector('.theme-toggle-label');
  const html = document.documentElement;

  // SVG icons (no external image files required)
  const moonIcon = "data:image/svg+xml," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>
    </svg>
  `);

  const sunIcon = "data:image/svg+xml," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>
    </svg>
  `);

  // Apply the selected theme
  function applyTheme(theme) {

    const isDark = theme === 'dark';

    html.setAttribute('data-theme', theme);

    if (themeIcon) {
      themeIcon.src = isDark ? sunIcon : moonIcon;
      themeIcon.style.color = isDark ? '#f6c66b' : '#231e18';
    }

    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );

      themeToggle.setAttribute(
        'title',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }

    // Update browser theme colour
    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (themeColor) {
      themeColor.setAttribute(
        'content',
        isDark ? '#000000' : '#751a34'
      );
    }
  }

  // Load previously selected theme
  let savedTheme = 'light';

  try {
    savedTheme = localStorage.getItem('sdc-theme') || 'light';
  } catch (error) {
    savedTheme = 'light';
  }

  applyTheme(savedTheme);

  // Toggle theme when clicked
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {

      const currentTheme = html.getAttribute('data-theme');

      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(newTheme);

      try {
        localStorage.setItem('sdc-theme', newTheme);
      } catch (error) {
        // Theme still works if browser storage is unavailable.
      }

    });
  }

  const cards = [...document.querySelectorAll('.service-card')];
  const tabs = [...document.querySelectorAll('.filter-tab')];
  const search = document.getElementById('service-search');
  const noResults = document.getElementById('no-results');
  const clearSearch = document.getElementById('clear-search');
  let activeFilter = 'all';

  const filterServices = () => {
    const term = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !term || `${card.dataset.name || ''} ${card.textContent}`.toLowerCase().includes(term);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
  };

  tabs.forEach(tab => tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter || 'all';
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterServices();
  }));
  search?.addEventListener('input', filterServices);
  clearSearch?.addEventListener('click', () => {
    if (search) search.value = '';
    activeFilter = 'all';
    tabs.forEach(tab => {
      const active = tab.dataset.filter === 'all';
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    filterServices();
  });

  // Each enquiry opens WhatsApp with the chosen service already named.
  document.querySelectorAll('.service-enquire').forEach(button => {
    button.addEventListener('click', () => {
      const service = button.dataset.service || 'a service';
      const message = `Hello Sharpsheep Digital Consultancy, I would like to enquire about ${service}. Please confirm the scope, final price, requirements and delivery timeline.`;
      window.open(`https://wa.me/254759984050?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const shareButton = document.getElementById('share-button');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const shareData = {
        title: 'Sharpsheep Digital Consultancy',
        text: 'Clear advice. Stronger business. Practical support for your next move.',
        url: window.location.href
      };
      try {
        if (navigator.share) await navigator.share(shareData);
        else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          showToast('Website link copied to clipboard.');
        } else {
          window.prompt('Copy this website link:', shareData.url);
        }
      } catch (error) {
        if (error?.name !== 'AbortError') showToast('Sharing is not available in this browser right now.');
      }
    });
  }



  // Update the visible service count when the catalogue is filtered.
  const servicesCount = document.getElementById('services-count');
  const updateServicesCount = () => {
    if (!servicesCount) return;
    const visibleCards = cards.filter(card => !card.hidden).length;
    servicesCount.textContent = String(visibleCards);
  };
  updateServicesCount();
  tabs.forEach(tab => tab.addEventListener('click', updateServicesCount));
  search?.addEventListener('input', updateServicesCount);
  clearSearch?.addEventListener('click', updateServicesCount);

  // Supply category buttons open a WhatsApp enquiry with the required prefix.
  const supplyWhatsApp = (message) => {
    const url = `https://wa.me/254759984050?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  document.querySelectorAll('.sdc-request-quote').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.supplyCategory || 'Supplies';
      supplyWhatsApp(`Hi SDC, I need a quote for ${category}: `);
    });
  });

  // Compose a detailed quote request from the short form.
  const supplyQuoteForm = document.getElementById('sdc-quote-form');
  if (supplyQuoteForm) {
    supplyQuoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!supplyQuoteForm.reportValidity()) return;

      const formData = new FormData(supplyQuoteForm);
      const item = String(formData.get('item') || '').trim();
      const specs = String(formData.get('specifications') || '').trim();
      const quantity = String(formData.get('quantity') || '').trim();
      const town = String(formData.get('town') || '').trim();
      const budget = String(formData.get('budget') || '').trim();

      const message = [
        'Hi SDC, I need a quote for Supplies: ',
        `Item required: ${item}`,
        `Model / specifications: ${specs || 'Not specified'}`,
        `Quantity: ${quantity}`,
        `Delivery town: ${town}`,
        `Budget: ${budget || 'Not specified'}`
      ].join('\n');

      supplyWhatsApp(message);
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2800);
  }
});
