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
    
    const chatBtn = document.getElementById('chat-button')
    const chatPanel = document.querySelector('.chat-panel')
    const chatClose = document.getElementById('chat-close')
      
    chatBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('show')
    })
      
    chatClose.addEventListener('click', () => {
        chatPanel.classList.remove('show')
    })
    
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
  
      // Click causes you to go to muscle page if data-href exists
      el.addEventListener('click', (e) => {
        const id = el.dataset.href;
        if (!id) return;
        showSection(id);
  
        // allow Ctrl/Cmd-click to open in new tab
        if (e.metaKey || e.ctrlKey) {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      });
    });
  
    // If user scrolls, hide tooltip so it doesn't "float" in a weird spot
    window.addEventListener('scroll', hideTooltip, { passive: true });

    const chatSubmit = document.getElementById('chat-submit')
    chatSubmit.addEventListener('click', () => {
        const question = document.getElementById('chat-panel-input').value
        if (!question) return  // don't send empty questions
        askAI(question)
        document.getElementById('chat-panel-input').value = ''
    })

    document.getElementById('chat-panel-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          chatSubmit.click()
      }
    })
  });

  function clearHighlights() {
    document.querySelectorAll('.muscle.ai-highlight').forEach(el => {
        el.classList.remove('ai-highlight')
        el.style.fill = ''
    })
}

  function highlightMuscles(muscles) {
    clearHighlights()
    muscles.forEach(group => {
        document.querySelectorAll(`.muscle.${group}`).forEach(el => {
            el.classList.add('ai-highlight')
            el.style.fill = 'rgba(0, 100, 0, 0.72)'
        })
    })
  }

  async function askAI(userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer redacted'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful anatomy assistant that only answers the users question with both a response field and a muscles field. The response field will be a detailed response for the user that includes origins and insertions, functions, innervations, relations, then exercises for muscle growth of the muscles the user asks about. The response field must be plain text only. No markdown, no asterisks, no bold formatting. Use line breaks to separate sections but no special characters. The muscles field will be an array with the relevant muscle group classes. You may not use any muscle group classes except Head, Neck, Chest, Back, Abdomen, Shoulder, Upper_Arm, Forearm_Flexors, Forearm_Extensors, Hand, Glutes, Quads, Hamstrings, Calves, Feet. Return only raw JSON with no markdown formatting, no code blocks, nothing else. You must always respond with valid JSON. Never respond with plain text. If you are unsure, still format your answer as JSON with a response field and a muscles field.' },
                { role: 'user', content: userMessage }
            ]
        })
    })
    const data = await response.json()
    try {
      const parsed = JSON.parse(data.choices[0].message.content)
      const messageElement = document.getElementById("chat-response")
      const responseText = typeof parsed.response === 'string' 
          ? parsed.response 
          : parsed.response.text || JSON.stringify(parsed.response)
      messageElement.textContent = responseText
      highlightMuscles(parsed.muscles)
    } catch (error) {
      const messageElement = document.getElementById('chat-response')
      messageElement.textContent = data.choices[0].message.content
      console.log('AI returned invalid JSON, raw response:')
      console.log(data.choices[0].message.content)
    } 
}

//   el.addEventListener('click', (e) => {
//     const href = el.dataset.href;
//     if (!href) return;
