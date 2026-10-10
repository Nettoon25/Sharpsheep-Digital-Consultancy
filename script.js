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

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2800);
  }
});
