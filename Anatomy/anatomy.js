function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(id).style.display = 'block';
  }

  function toggleDropdown(menuId) {
    document.querySelectorAll(".dropdown-content").forEach(menu => {
      if (menu.id !== menuId) menu.classList.remove("show");
    });
  
    document.getElementById(menuId).classList.toggle("show");
  }
  
  window.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-content").forEach(menu => menu.classList.remove("show"));
      document.querySelectorAll(".submenu").forEach(sm => sm.classList.remove("show"));
    }
  });

  function toggleMenu(button) {
    const menu = button.nextElementSibling;
    menu.classList.toggle("show");
  }
  
  function toggleSubmenu(button) {
    const submenu = button.nextElementSibling;
    submenu.classList.toggle("show");
  }

// Layer toggle + tooltip/click behavior
document.addEventListener('DOMContentLoaded', () => {
    // ----- 1) Layer toggle: superficial vs intrinsic -----
    const toggle = document.getElementById('layerToggle');
    if (toggle) {
      // Initial state: superficial interactive
      document.body.classList.add('mode-superficial');
      toggle.checked = false;
  
      toggle.addEventListener('change', () => {
        const intrinsicOn = toggle.checked;
        document.body.classList.toggle('mode-intrinsic', intrinsicOn);
        document.body.classList.toggle('mode-superficial', !intrinsicOn);
      });

      showSection('home');
    }
  
    // ----- 2) Tooltip + click for muscles -----
    const tooltip = document.getElementById('muscleTooltip');
    if (!tooltip) return;
  
    const titleEl = tooltip.querySelector('.tooltip-title');
    const blurbEl = tooltip.querySelector('.tooltip-blurb');
  
    // We attach listeners to every .muscle (works for both <path> and <g class="muscle ...">)
    const muscles = document.querySelectorAll('.muscle');
  
    // Small helper: move tooltip near the cursor
    function positionTooltip(e) {
      const offset = 14; // how far from the cursor (pixels)
      let x = e.clientX + offset;
      let y = e.clientY + offset;
  
      // Keep tooltip inside the viewport so it doesn't go off-screen
      const rect = tooltip.getBoundingClientRect();
      const pad = 10;
  
      if (x + rect.width + pad > window.innerWidth) {
        x = e.clientX - rect.width - offset;
      }
      if (y + rect.height + pad > window.innerHeight) {
        y = e.clientY - rect.height - offset;
      }
  
      tooltip.style.transform = `translate(${x}px, ${y}px)`;
    }
  
    // Show tooltip using the element's data attributes
    function showTooltipFor(el, e) {
      const name = el.dataset.name;
      if (!name) return; // if you haven't added data-name yet, do nothing
  
      const blurb = el.dataset.blurb || '';
  
      titleEl.textContent = name;
      blurbEl.textContent = blurb;
  
      tooltip.classList.add('show');
      tooltip.setAttribute('aria-hidden', 'false');
  
      positionTooltip(e);
    }
  
    function hideTooltip() {
      tooltip.classList.remove('show');
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.style.transform = 'translate(-9999px, -9999px)';
    }
  
    muscles.forEach((el) => {
      // Hover start
      el.addEventListener('mouseenter', (e) => {
        showTooltipFor(el, e);
      });
  
      // Follow cursor while hovering
      el.addEventListener('mousemove', (e) => {
        // Only move the tooltip if it's currently visible
        if (tooltip.classList.contains('show')) {
          positionTooltip(e);
        }
      });
  
      // Hover end
      el.addEventListener('mouseleave', () => {
        hideTooltip();
      });
  
      // Click -> go to muscle page if data-href exists
      el.addEventListener('click', (e) => {
        const id = el.dataset.href;
        showSection(id);
        if (!href) return;
        el.addEventListener('click', (e) => {
            const id = el.dataset.href;
            showSection(id);
    });
  
        // Optional nicety: allow Ctrl/Cmd-click to open in new tab
        if (e.metaKey || e.ctrlKey) {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      });
    });
  
    // If user scrolls, hide tooltip so it doesn't "float" in a weird spot
    window.addEventListener('scroll', hideTooltip, { passive: true });
  });

//   el.addEventListener('click', (e) => {
//     const href = el.dataset.href;
//     if (!href) return;