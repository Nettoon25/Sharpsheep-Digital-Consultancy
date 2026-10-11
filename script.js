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

 {
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Sharpsheep Digital Consultancy",
                "description": "Business documentation, company registration, policy writing, proposals, tender preparation and digital services in Kenya.",
                "areaServed": {
                    "@type": "Country",
                    "name": "Kenya"
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Nairobi",
                    "addressCountry": "KE"
                },
                "telephone": "+254759984050",
                "email": "sharpsheepdigitalconsultancy@gmail.com",
                "sameAs": [
                    "https://www.tiktok.com/@sharpsheep11"
                ]
            }



            
document.addEventListener("DOMContentLoaded", function () {
    const filterTabs = document.querySelectorAll(".filter-tab");
    const searchInput = document.getElementById("service-search");
    const servicesGrid = document.getElementById("services-grid");
    const servicesCount = document.getElementById("services-count");

    if (!servicesGrid || !searchInput) return;

    const serviceCards = Array.from(
        servicesGrid.querySelectorAll(".service-card")
    );

    let activeFilter = "all";

    // Display matching services
    function filterServices() {
        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        serviceCards.forEach(function (card) {
            const category = (
                card.dataset.category || ""
            ).toLowerCase();

            const serviceName = (
                card.dataset.name || ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            // Match the selected category
            const matchesCategory =
                activeFilter === "all" ||
                category === activeFilter;

            // Match the search term against service name,
            // description, price and other card text
            const matchesSearch =
                searchTerm === "" ||
                serviceName.includes(searchTerm) ||
                category.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const shouldShow =
                matchesCategory && matchesSearch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Update the number of matching services
        if (servicesCount) {
            servicesCount.textContent = visibleCount;
        }

        // Update the results message
        const resultsMessage = document.getElementById(
            "services-results-message"
        );

        if (resultsMessage) {
            resultsMessage.textContent = visibleCount === 0
                ? "No services found. Try another search or filter."
                : `Showing ${visibleCount} of ${serviceCards.length} services`;
        }
    }

    // Handle category filter buttons
    filterTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            activeFilter = tab.dataset.filter || "all";

            filterTabs.forEach(function (button) {
                const isActive = button === tab;

                button.classList.toggle("active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterServices();
        });
    });

    // Handle live search as the user types
    searchInput.addEventListener("input", filterServices);

    // Make sure all services are displayed initially
    filterServices();
});
