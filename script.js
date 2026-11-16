/* ==========================================================================
   Adri Sant'Anna Beauty — Interactive Behavior
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5551981360838';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Ano atual automático no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Shrinking Header suave no scroll
  const header = document.getElementById('siteHeader');
  if (header) {
    const toggleHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 36);
    };
    toggleHeaderState();
    window.addEventListener('scroll', toggleHeaderState, { passive: true });
  }

  // 3. Menu Mobile acessível (com Escape, clique externo e retorno de foco)
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const closeMenu = (restoreFocus = false) => {
      if (mobileMenu.hidden) {
        return;
      }
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
      mobileMenu.hidden = true;
      if (restoreFocus) {
        navToggle.focus();
      }
    };

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu(false);
      } else {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
        mobileMenu.hidden = false;
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        closeMenu(true);
      }
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.hidden && header && !header.contains(event.target)) {
        closeMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && !mobileMenu.hidden) {
        closeMenu(false);
      }
    });
  }

  // 4. Explorador Interativo de Protocolos de Pele (ARIA Tabs + Roving Tabindex)
  const protocolTabs = Array.from(document.querySelectorAll('.protocol-tab'));
  const protocolPanels = Array.from(document.querySelectorAll('.protocol-panel'));

  const activateProtocol = (tabToActivate) => {
    const targetId = tabToActivate.getAttribute('aria-controls');

    protocolTabs.forEach((tab) => {
      const isSelected = tab === tabToActivate;
      tab.classList.toggle('is-active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    protocolPanels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('is-active', isTarget);
      panel.hidden = !isTarget;
    });
  };

  protocolTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateProtocol(tab));

    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = (index + 1) % protocolTabs.length;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + protocolTabs.length) % protocolTabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = protocolTabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        protocolTabs[nextIndex].focus();
        activateProtocol(protocolTabs[nextIndex]);
      }
    });
  });

  // 5. Seletor Interativo de Espectros de Luz — Fluence MAXX HTM (ARIA Tabs + Roving Tabindex)
  const wavelengthsData = {
    red: {
      nm: '660 nm – 830 nm',
      role: 'Bioestimulação Profunda & Reparo da Pele',
      title: 'Laser Vermelho & Infravermelho',
      description:
        'Aumenta a produção de energia celular (ATP), estimula expressivamente a síntese de colágeno e elastina e acelera a recuperação da pele após peelings e protocolos renovadores. O infravermelho alcança camadas mais profundas com forte ação calmante e cicatrizante.',
      cosmetic:
        'Rejuvenescimento, cicatrização pós-procedimentos, melhora da firmeza e terapia capilar contra queda.'
    },
    blue: {
      nm: '470 nm',
      role: 'Ação Bactericida & Controle de Oleosidade',
      title: 'LED Azul & Terapia Fotodinâmica',
      description:
        'Promove oxigenação seletiva na superfície com forte ação bactericida contra a bactéria da acne, auxiliando no controle da oleosidade, na hidratação superficial e na ativação de cosméticos fotoativos.',
      cosmetic:
        'Controle de acne ativa, foliculite, peles oleosas, poros dilatados e pós-higienização profunda.'
    },
    green: {
      nm: '530 nm',
      role: 'Equilíbrio de Pigmentação & Iluminação',
      title: 'LED Verde',
      description:
        'Atua na regulação da produção de melanina auxiliando no clareamento seguro de manchas, estimula suavemente o colágeno e favorece a microcirculação e a redução do inchaço facial.',
      cosmetic:
        'Gerenciamento de melasma, manchas solares ou pós-acne, viço e iluminação uniforme da pele.'
    },
    amber: {
      nm: '590 nm + ILIB',
      role: 'Fibras de Sustentação & Ação Calmante',
      title: 'LED Âmbar & Terapia Vascular (ILIB)',
      description:
        'Favorece o espessamento homogêneo das fibras de sustentação enquanto exerce potente efeito calmante e anti-inflamatório sobre peles sensíveis. Associada à técnica ILIB, oferece suporte antioxidante sistêmico.',
      cosmetic:
        'Peles sensíveis, rosácea, vermelhidão persistente, elasticidade e protocolos de conforto cutâneo.'
    }
  };

  const waveButtons = Array.from(document.querySelectorAll('.wave-btn'));
  const waveReadout = document.getElementById('waveReadout');
  const waveNm = document.getElementById('waveNm');
  const waveRole = document.getElementById('waveRole');
  const waveTitle = document.getElementById('waveTitle');
  const waveDescription = document.getElementById('waveDescription');
  const waveCosmetic = document.getElementById('waveCosmetic');

  const updateWavelength = (btnToActivate) => {
    const key = btnToActivate.dataset.wave;
    const info = wavelengthsData[key];
    if (!info || !waveNm || !waveRole || !waveTitle || !waveDescription || !waveCosmetic) {
      return;
    }

    waveButtons.forEach((btn) => {
      const active = btn === btnToActivate;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('tabindex', active ? '0' : '-1');
    });

    if (waveReadout && btnToActivate.id) {
      waveReadout.setAttribute('aria-labelledby', btnToActivate.id);
    }

    waveNm.textContent = info.nm;
    waveRole.textContent = info.role;
    waveTitle.textContent = info.title;
    waveDescription.textContent = info.description;
    waveCosmetic.innerHTML = `<strong>Aplicação na Cosmetologia:</strong> ${info.cosmetic}`;
  };

  waveButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => updateWavelength(btn));

    btn.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % waveButtons.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + waveButtons.length) % waveButtons.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = waveButtons.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        waveButtons[nextIndex].focus();
        updateWavelength(waveButtons[nextIndex]);
      }
    });
  });

  // 6. Controle inteligente e acessível dos vídeos (lazy play via viewport + sincronização real)
  document.querySelectorAll('[data-video-toggle]').forEach((button) => {
    const wrapper = button.closest('.video-frame-wrapper');
    const video = wrapper ? wrapper.querySelector('video') : null;
    const iconPause = button.querySelector('.icon-pause');
    const iconPlay = button.querySelector('.icon-play');

    if (!video || !iconPause || !iconPlay) {
      return;
    }

    let userPaused = false;

    const syncButtonUI = (isPlaying) => {
      iconPause.hidden = !isPlaying;
      iconPlay.hidden = isPlaying;
      button.setAttribute('aria-label', isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo');
    };

    video.addEventListener('play', () => syncButtonUI(true));
    video.addEventListener('pause', () => syncButtonUI(false));
    syncButtonUI(!video.paused);

    button.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        video.play().catch(() => syncButtonUI(false));
      } else {
        userPaused = true;
        video.pause();
      }
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !userPaused) {
              video.play().catch(() => syncButtonUI(false));
            } else if (!entry.isIntersecting && !video.paused) {
              video.pause();
            }
          });
        },
        { rootMargin: '120px 0px', threshold: 0.25 }
      );
      videoObserver.observe(video);
    }
  });

  // 7. Concierge de Agendamento via WhatsApp (com fallback seguro se pop-up for bloqueado)
  const conciergeForm = document.getElementById('conciergeForm');
  const conciergeFallback = document.getElementById('conciergeFallback');
  const conciergeFallbackLink = document.getElementById('conciergeFallbackLink');

  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedInterest = conciergeForm.querySelector('input[name="interesse"]:checked');
      const clientNameInput = document.getElementById('clientName');

      const interesse = selectedInterest
        ? selectedInterest.value
        : 'Avaliação Completa de Pele & Cosmetologia';
      const clientName = clientNameInput ? clientNameInput.value.trim() : '';

      const greeting = clientName
        ? `Olá Adri! Meu nome é ${clientName}.`
        : 'Olá Adri!';
      const message = `${greeting} Vi o site da Adri Sant'Anna Beauty e gostaria de agendar uma avaliação com foco em: ${interesse}.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      if (conciergeFallbackLink) {
        conciergeFallbackLink.href = url;
      }

      const popup = window.open(url, '_blank', 'noopener,noreferrer');
      if (!popup && conciergeFallback) {
        conciergeFallback.hidden = false;
      }
    });
  }

  // 8. Fallback IntersectionObserver para animação de entrada se Scroll-Driven Animations não for suportado
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' &&
    CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  if (!supportsScrollTimeline && !prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    revealEls.forEach((el) => el.classList.add('is-fallback-hidden'));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('is-fallback-hidden');
            entry.target.classList.add('is-fallback-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // 9. Oculta o botão flutuante do WhatsApp quando o formulário de agendamento ou rodapé estão visíveis
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const conciergeTarget = document.getElementById('conciergeForm');
  const footerTarget = document.querySelector('.site-footer');

  if (whatsappFloat && (conciergeTarget || footerTarget)) {
    const visibleTargets = new Set();
    const floatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        });
        whatsappFloat.classList.toggle('is-hidden', visibleTargets.size > 0);
      },
      { threshold: 0.15 }
    );

    if (conciergeTarget) floatObserver.observe(conciergeTarget);
    if (footerTarget) floatObserver.observe(footerTarget);
  }
});
