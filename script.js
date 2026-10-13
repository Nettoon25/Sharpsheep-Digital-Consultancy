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



            
/* ==========================================
   SHARPSHEEP — USER EXPERIENCE CONTROLLER
========================================== */

(() => {
    "use strict";

    const init = () => {
        const header = document.querySelector(".site-header");

        const backToTop = document.querySelector(".back-to-top");

        const navLinks = [
            ...document.querySelectorAll(
                '.site-header a[href^="#"], nav a[href^="#"]'
            )
        ];

        const sections = [
            ...document.querySelectorAll("section[id]")
        ];

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        /* --------------------------------------
           1. SCROLL POSITION
        -------------------------------------- */

        let ticking = false;

        const updateScrollUI = () => {
            const scrollY = window.scrollY;

            if (header) {
                header.classList.toggle(
                    "is-scrolled",
                    scrollY > 20
                );
            }

            if (backToTop) {
                backToTop.classList.toggle(
                    "is-visible",
                    scrollY > 450
                );

                backToTop.setAttribute(
                    "aria-hidden",
                    scrollY > 450 ? "false" : "true"
                );
            }

            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateScrollUI);
                    ticking = true;
                }
            },
            { passive: true }
        );

        updateScrollUI();

        /* --------------------------------------
           2. SMOOTH INTERNAL NAVIGATION
        -------------------------------------- */

        document.addEventListener("click", (event) => {
            const link = event.target.closest('a[href^="#"]');

            if (!link) return;

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch {
                return;
            }

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.getBoundingClientRect().height
                : 0;

            const targetTop =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                16;

            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: reduceMotion ? "auto" : "smooth"
            });

            /* Update the URL without triggering a second jump */
            if (window.location.hash !== href) {
                window.history.pushState(null, "", href);
            }

            /* Close mobile menu if present */
            closeMobileMenu();

            /* Keyboard and assistive-technology support */
            if (!target.hasAttribute("tabindex")) {
                target.setAttribute("tabindex", "-1");
            }

            target.focus({ preventScroll: true });
        });

        /* --------------------------------------
           3. SCROLL REVEAL
        -------------------------------------- */

        const revealSelectors = [
            ".section-heading",
            ".approach-copy",
            ".approach-art",
            ".director-copy",
            ".director-art",
            ".partner-card",
            ".insight-card",
            ".steps-list .step",
            ".partners-cta",
            ".leadership-note"
        ];

        const revealElements = [
            ...new Set(
                revealSelectors.flatMap((selector) =>
                    document.querySelectorAll(selector)
                )
            )
        ];

        revealElements.forEach((element) => {
            /* Don't hide elements inside an already-hidden parent */
            if (element.closest('[hidden], [aria-hidden="true"]')) {
                return;
            }

            element.classList.add("js-reveal");
        });

        if ("IntersectionObserver" in window && !reduceMotion) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });
        } else {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });
        }

        /* --------------------------------------
           4. STAGGERED CARD ANIMATIONS
        -------------------------------------- */

        document.querySelectorAll(
            ".partners-grid, .insights-grid, .steps-list"
        ).forEach((container) => {
            const children = container.querySelectorAll(
                ".partner-card, .insight-card, .step"
            );

            children.forEach((child, index) => {
                child.style.setProperty(
                    "--reveal-delay",
                    `${Math.min(index * 100, 300)}ms`
                );
            });
        });

        /* --------------------------------------
           5. ACTIVE NAVIGATION LINK
        -------------------------------------- */

        if ("IntersectionObserver" in window) {
            const navObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const id = entry.target.id;

                        navLinks.forEach((link) => {
                            const isActive =
                                link.getAttribute("href") === `#${id}`;

                            link.classList.toggle("active", isActive);

                            if (isActive) {
                                link.setAttribute(
                                    "aria-current",
                                    "location"
                                );
                            } else {
                                link.removeAttribute("aria-current");
                            }
                        });
                    });
                },
                {
                    rootMargin: "-25% 0px -60% 0px",
                    threshold: 0
                }
            );

            sections.forEach((section) => {
                navObserver.observe(section);
            });
        }

        /* --------------------------------------
           6. BACK-TO-TOP BUTTON
        -------------------------------------- */

        if (backToTop) {
            backToTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? "auto" : "smooth"
                });

                if (window.location.hash) {
                    window.history.replaceState(
                        null,
                        "",
                        window.location.pathname +
                        window.location.search
                    );
                }
            });
        }

        /* --------------------------------------
           7. MOBILE MENU
        -------------------------------------- */

        const menuToggle = document.querySelector(
            "[data-menu-toggle]"
        );

        const mobileMenu = document.querySelector(
            "[data-mobile-menu]"
        );

        function closeMobileMenu() {
            if (!menuToggle || !mobileMenu) return;

            mobileMenu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        }

        function openMobileMenu() {
            if (!menuToggle || !mobileMenu) return;

            mobileMenu.classList.add("is-open");
            menuToggle.setAttribute("aria-expanded", "true");
            document.body.classList.add("menu-open");
        }

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener("click", () => {
                const isOpen =
                    menuToggle.getAttribute("aria-expanded") === "true";

                if (isOpen) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    closeMobileMenu();
                }
            });

            document.addEventListener("click", (event) => {
                if (
                    !mobileMenu.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {
                    closeMobileMenu();
                }
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            });
        }

        /* --------------------------------------
           8. IMAGE LOADING FALLBACK
        -------------------------------------- */

        document.querySelectorAll("img").forEach((img) => {
            img.addEventListener("error", () => {
                img.classList.add("image-unavailable");
            });
        });

        /* --------------------------------------
           9. EXTERNAL LINKS
        -------------------------------------- */

        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const relValues = new Set(
                (link.getAttribute("rel") || "")
                    .split(/\s+/)
                    .filter(Boolean)
            );

            relValues.add("noopener");
            relValues.add("noreferrer");

            link.setAttribute("rel", [...relValues].join(" "));
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();




/* =========================================================
   DIGITAL STORE — INTERACTIONS
========================================================= */

(() => {
    "use strict";

    function initDigitalStore() {
        const store = document.querySelector(".digital-store-section");

        // Stop safely if this page does not contain the store.
        if (!store || store.dataset.storeInitialized === "true") return;

        store.dataset.storeInitialized = "true";

        const categoryButtons = store.querySelectorAll("[data-store-filter]");
        const productCards = store.querySelectorAll(".store-product-card");
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        /* -----------------------------------------------------
           1. ASSIGN PRODUCT CATEGORIES
           These match the four products in your supplied HTML.
        ----------------------------------------------------- */

     
/* -----------------------------------------------------
   1. READ CATEGORIES FROM EACH PRODUCT'S HTML
----------------------------------------------------- */

productCards.forEach((card) => {
    const categories = (card.dataset.storeCategories || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    card.dataset.storeCategories = categories.join(" ");
    card.setAttribute("aria-hidden", "false");
});

        /* -----------------------------------------------------
           2. FILTER PRODUCTS
        ----------------------------------------------------- */

        function filterProducts(selectedCategory) {
            productCards.forEach((card) => {
                const categories = (
                    card.dataset.storeCategories || ""
                ).split(/\s+/);

                const shouldShow =
                    selectedCategory === "all" ||
                    categories.includes(selectedCategory);

                card.classList.toggle(
                    "is-filtered-out",
                    !shouldShow
                );

                card.setAttribute(
                    "aria-hidden",
                    String(!shouldShow)
                );

                // Hide filtered-out cards from keyboard navigation.
                card.querySelectorAll("a, button").forEach((element) => {
                    if (!shouldShow) {
                        element.setAttribute("tabindex", "-1");
                    } else {
                        element.removeAttribute("tabindex");
                    }
                });

                if (shouldShow && !reduceMotion) {
                    card.animate(
                        [
                            {
                                opacity: 0.55,
                                transform: "translateY(8px)"
                            },
                            {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        ],
                        {
                            duration: 280,
                            easing: "ease-out"
                        }
                    );
                }
            });
        }

        categoryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const category = button.dataset.storeFilter || "all";

                categoryButtons.forEach((otherButton) => {
                    const isActive = otherButton === button;

                    otherButton.classList.toggle(
                        "is-active",
                        isActive
                    );

                    otherButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                filterProducts(category);
            });
        });

        /* -----------------------------------------------------
           3. SCROLL-REVEAL ANIMATIONS
        ----------------------------------------------------- */

        const revealElements = [
            store.querySelector(".store-heading"),
            store.querySelector(".store-category-list"),
            ...productCards,
            store.querySelector(".store-bottom-cta"),
            store.querySelector(".store-disclaimer")
        ].filter(Boolean);

        revealElements.forEach((element, index) => {
            element.classList.add("store-reveal");
            element.style.transitionDelay =
                `${Math.min(index % 5, 4) * 75}ms`;
        });

        if (reduceMotion) {
            revealElements.forEach((element) => {
                element.classList.add("store-visible");
            });
        } else if ("IntersectionObserver" in window) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("store-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -35px 0px"
                }
            );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });
        } else {
            revealElements.forEach((element) => {
                element.classList.add("store-visible");
            });
        }

        /* -----------------------------------------------------
           4. FEATURED PRODUCT HOVER FEEDBACK
        ----------------------------------------------------- */

        const featuredProduct = store.querySelector(
            ".store-featured-product"
        );

        if (featuredProduct && !reduceMotion) {
            featuredProduct.addEventListener("pointerenter", () => {
                featuredProduct.style.setProperty(
                    "--featured-hover",
                    "1"
                );
            });

            featuredProduct.addEventListener("pointerleave", () => {
                featuredProduct.style.setProperty(
                    "--featured-hover",
                    "0"
                );
            });
        }

        /* -----------------------------------------------------
           5. SMOOTH NAVIGATION TO THE STORE
           Applies to same-page links pointing to #store.
        ----------------------------------------------------- */

        document.querySelectorAll('a[href="#store"]').forEach((link) => {
            link.addEventListener("click", (event) => {
                const target = document.getElementById("store");

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start"
                });

                if (window.location.hash !== "#store") {
                    history.replaceState(null, "", "#store");
                }
            });
        });

        /* -----------------------------------------------------
           6. OPTIONAL: UPDATE STORE LINK HOVER ACCESSIBILITY
        ----------------------------------------------------- */

        store.querySelectorAll(".store-product-link, .store-main-button")
            .forEach((link) => {
                link.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") {
                        link.blur();
                    }
                });
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initDigitalStore,
            { once: true }
        );
    } else {
        initDigitalStore();
    }
})();
