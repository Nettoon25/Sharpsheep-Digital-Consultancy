(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');
  const backTop = document.querySelector('.back-top');
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle: shared by every page, persists across navigation and reloads.
  const themeButton = document.querySelector('.theme-toggle');
  const themeLabel = themeButton?.querySelector('.theme-label');
  const themeIcon = themeButton?.querySelector('.theme-icon');
  const root = document.documentElement;
  const THEME_KEY = 'eofw-theme';
  function applyTheme(theme) {
    const dark = theme === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    if (themeIcon) themeIcon.textContent = dark ? '☀' : '◐';
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  if (themeButton) themeButton.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  });
  function closeMenu(){ if(!menuButton || !nav) return; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); nav.classList.remove('is-open'); }
  if(menuButton && nav){
    menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
    window.addEventListener('resize',()=>{if(window.innerWidth>980)closeMenu();});
  }
  const updateBackTop=()=>{if(backTop)backTop.classList.toggle('is-visible',window.scrollY>500);};
  window.addEventListener('scroll',updateBackTop,{passive:true});updateBackTop();
  if(backTop)backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  // Calendar view selector on Events page.
  const calendarButtons = document.querySelectorAll('.calendar-view');
  if (calendarButtons.length) {
    calendarButtons.forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.view;
      calendarButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('.calendar-panel').forEach(panel => {
        panel.hidden = panel.id !== 'calendar-' + view;
      });
    }));
  }
  const form=document.querySelector('#contact-form');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const name=String(data.get('name')||'').trim();const email=String(data.get('email')||'').trim();const topic=String(data.get('topic')||'General enquiry');const message=String(data.get('message')||'').trim();const status=document.querySelector('#form-status');const recipient='';
    if(!name||!email||!message){if(status)status.textContent='Please complete the required fields.';return;}
    const subject=encodeURIComponent('Website enquiry: '+topic);const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nTopic: '+topic+'\n\nMessage:\n'+message);
    if(status)status.textContent='Opening your email application. If it does not open, contact the church directly.';
    // Add the church's verified email address to recipient once confirmed.
    window.location.href='mailto:'+recipient+'?subject='+subject+'&body='+body;
  });}
})();



document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");
    const backToTop = document.querySelector("#back-to-top");

    /* Mobile navigation */
    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            navigation.classList.toggle("is-open", !isOpen);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* Back-to-top visibility */
    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.hidden = window.scrollY < 500;
        };

        window.addEventListener("scroll", updateBackToTop, {
            passive: true
        });

        updateBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const calendarButtons = document.querySelectorAll(".calendar-view");

    const calendarPanels = document.querySelectorAll(
        "[data-calendar-panel]"
    );

    calendarButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedView = button.dataset.view;

            // Update the selected button.
            calendarButtons.forEach((item) => {
                const isActive = item === button;

                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            // Display only the selected calendar panel.
            calendarPanels.forEach((panel) => {
                panel.hidden = panel.dataset.calendarPanel !== selectedView;
            });
        });
    });
});

