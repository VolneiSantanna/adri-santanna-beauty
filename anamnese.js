'use strict';

(() => {
  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSdb4WozjLPAte1tO9zG3Byeahqwm1ey5xw2DZrzzJHpgnkTxw/formResponse';
  const DRAFT_STORAGE_KEY = 'adri_anamnese_draft_v1';
  const STEP_NAMES = ['Sobre você', 'Saúde', 'Sua pele'];

  const form = document.getElementById('anamneseForm');
  const card = document.getElementById('anamneseCard');
  const intro = document.getElementById('anamneseIntro');
  const stepNav = document.getElementById('stepNav');
  const progressFill = document.getElementById('stepProgressFill');
  const stepErrorBanner = document.getElementById('stepErrorBanner');
  const stepErrorBannerText = document.getElementById('stepErrorBannerText');
  const submitErrorBanner = document.getElementById('submitErrorBanner');
  const submitBtn = document.getElementById('submitAnamneseBtn');
  const submitBtnLabel = document.getElementById('submitBtnLabel');
  const successSection = document.getElementById('anamneseSuccess');
  const successTitle = document.getElementById('successTitle');
  const successMessage = document.getElementById('successMessage');
  const statusRegion = document.getElementById('anamneseStatus');

  const birthDateInput = document.getElementById('fieldNascimento');
  const condicoesOutroBox = document.getElementById('condicoesOutroBox');
  const condicoesOutroInput = document.getElementById('fieldCondicoesOutro');
  const limpezaOutroBox = document.getElementById('limpezaOutroBox');
  const limpezaOutroInput = document.getElementById('fieldLimpezaOutro');

  const stepPanels = [1, 2, 3].map((step) => document.getElementById(`stepPanel${step}`));
  const stepIndicators = [1, 2, 3].map((step) =>
    stepNav.querySelector(`[data-step-indicator="${step}"]`)
  );

  const dirtyControls = new WeakSet();
  let currentStep = 1;
  let maxReachedStep = 1;
  let isSubmitting = false;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function announce(text) {
    if (!statusRegion) return;
    statusRegion.textContent = '';
    requestAnimationFrame(() => {
      statusRegion.textContent = text;
    });
  }

  function todayIsoDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function initBirthDateBounds() {
    if (!birthDateInput) return;
    birthDateInput.max = todayIsoDate();
  }

  // =========================================================================
  // Opções condicionais ("Outro")
  // =========================================================================

  function getSelectedRadio(name) {
    return form.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`);
  }

  function syncOtherBox(radioName, box, input, isRequiredWhenOther) {
    const selected = getSelectedRadio(radioName);
    const showOther = selected && selected.value === '__other_option__';
    box.hidden = !showOther;
    if (isRequiredWhenOther) {
      input.required = Boolean(showOther);
    }
    if (!showOther) {
      setControlErrorState(input, false);
    }
  }

  function syncAllOtherBoxes() {
    syncOtherBox('entry.689548746', condicoesOutroBox, condicoesOutroInput, true);
    syncOtherBox('entry.152580699', limpezaOutroBox, limpezaOutroInput, false);
  }

  // =========================================================================
  // Validação pós-interação + controle de erros
  // =========================================================================

  function setControlErrorState(control, hasError) {
    if (!control) return;
    control.classList.toggle('is-invalid', hasError);
    control.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    const errorId = control.dataset.error;
    if (errorId) {
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.hidden = !hasError;
    }
  }

  function setFieldsetErrorState(fieldset, hasError) {
    if (!fieldset) return;
    fieldset.classList.toggle('is-invalid', hasError);
    const errorId = fieldset.dataset.error;
    if (errorId) {
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.hidden = !hasError;
    }
  }

  function validateTextControl(control) {
    if (!control) return true;
    const raw = control.value;
    const trimmed = raw.trim();

    if (control.required && !trimmed) {
      setControlErrorState(control, true);
      return false;
    }

    if (control.type === 'date' && raw) {
      const today = todayIsoDate();
      const parts = raw.split('-');
      const yearNum = Number(parts[0]);
      if (parts.length !== 3 || !Number.isFinite(yearNum) || yearNum < 1910 || raw > today) {
        setControlErrorState(control, true);
        return false;
      }
    }

    if (!control.checkValidity()) {
      setControlErrorState(control, true);
      return false;
    }

    setControlErrorState(control, false);
    return true;
  }

  function validateRadioFieldset(fieldset) {
    const radioName = fieldset.dataset.requiredRadio;
    if (!radioName) return true;
    const selected = getSelectedRadio(radioName);
    const valid = Boolean(selected);
    setFieldsetErrorState(fieldset, !valid);
    return valid;
  }

  function getFirstInvalidInStep(stepNumber) {
    const panel = stepPanels[stepNumber - 1];
    if (!panel) return null;

    let firstInvalid = null;
    const items = panel.querySelectorAll(
      'input[type="text"], input[type="date"], textarea, fieldset[data-required-radio]'
    );

    items.forEach((item) => {
      if (item.closest('[hidden]')) return;

      if (item.tagName === 'FIELDSET') {
        const ok = validateRadioFieldset(item);
        if (!ok && !firstInvalid) {
          firstInvalid = item.querySelector('input[type="radio"]');
        }
        return;
      }

      const ok = validateTextControl(item);
      if (!ok && !firstInvalid) {
        firstInvalid = item;
      }
    });

    return firstInvalid;
  }

  function validateStep(stepNumber, options = {}) {
    const { focusInvalid = true, showBanner = true } = options;
    const firstInvalid = getFirstInvalidInStep(stepNumber);

    if (firstInvalid) {
      if (showBanner && stepErrorBanner) {
        stepErrorBanner.hidden = false;
        stepErrorBannerText.textContent =
          'Preencha os campos obrigatórios destacados para continuar.';
      }
      if (focusInvalid) {
        firstInvalid.focus({ preventScroll: false });
      }
      return false;
    }

    if (stepErrorBanner) {
      stepErrorBanner.hidden = true;
    }
    return true;
  }

  // =========================================================================
  // Navegação entre etapas
  // =========================================================================

  function updateStepUI() {
    stepPanels.forEach((panel, index) => {
      const stepNum = index + 1;
      const isCurrent = stepNum === currentStep;
      panel.hidden = !isCurrent;
    });

    stepIndicators.forEach((item, index) => {
      const stepNum = index + 1;
      const btn = item.querySelector('.step-trigger');
      const isCurrent = stepNum === currentStep;
      const isCompleted = stepNum < currentStep || (stepNum <= maxReachedStep && stepNum !== currentStep && isStepQuietlyValid(stepNum));

      item.classList.toggle('is-completed', isCompleted);
      if (isCurrent) {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    if (progressFill) {
      progressFill.style.width = `${(currentStep / 3) * 100}%`;
    }
  }

  function isStepQuietlyValid(stepNumber) {
    const panel = stepPanels[stepNumber - 1];
    if (!panel) return false;
    const textControls = panel.querySelectorAll('input[required], textarea[required]');
    for (const ctrl of textControls) {
      if (ctrl.closest('[hidden]') || ctrl.type === 'radio') continue;
      if (!ctrl.value.trim()) return false;
    }
    const requiredFieldsets = panel.querySelectorAll('fieldset[data-required-radio]');
    for (const fs of requiredFieldsets) {
      if (!getSelectedRadio(fs.dataset.requiredRadio)) return false;
    }
    return true;
  }

  function goToStep(targetStep, shouldScroll = true) {
    if (targetStep < 1 || targetStep > 3) return;

    currentStep = targetStep;
    if (targetStep > maxReachedStep) {
      maxReachedStep = targetStep;
    }

    if (stepErrorBanner) stepErrorBanner.hidden = true;
    if (submitErrorBanner) submitErrorBanner.hidden = true;

    updateStepUI();
    saveDraft();

    const activeHeading = document.getElementById(`stepTitle${targetStep}`);
    if (shouldScroll && card) {
      card.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    if (activeHeading) {
      activeHeading.focus({ preventScroll: true });
    }
    announce(`Etapa ${targetStep} de 3: ${STEP_NAMES[targetStep - 1]}.`);
  }

  // =========================================================================
  // Persistência local do rascunho na sessão
  // =========================================================================

  function saveDraft() {
    try {
      const values = {};
      const elements = form.elements;
      for (const el of elements) {
        if (!el.name || el.name === '_honeypot') continue;
        if (el.type === 'radio') {
          if (el.checked) values[el.name] = el.value;
        } else {
          values[el.name] = el.value;
        }
      }
      sessionStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ currentStep, maxReachedStep, values })
      );
    } catch {
      // Ignora indisponibilidade de sessionStorage em modo restrito
    }
  }

  function restoreDraft() {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.values) return;

      Object.entries(parsed.values).forEach(([name, value]) => {
        if (typeof value !== 'string') return;
        const radioMatch = form.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
        if (radioMatch.length) {
          radioMatch.forEach((radio) => {
            radio.checked = radio.value === value;
          });
          return;
        }
        const field = form.elements.namedItem(name);
        if (field && 'value' in field) {
          field.value = value;
        }
      });

      syncAllOtherBoxes();

      const savedStep = Number(parsed.currentStep);
      const savedMax = Number(parsed.maxReachedStep);
      if (savedMax >= 1 && savedMax <= 3) maxReachedStep = savedMax;
      if (savedStep >= 1 && savedStep <= 3) {
        currentStep = savedStep;
      }
      updateStepUI();
    } catch {
      // Ignora rascunho corrompido
    }
  }

  function clearDraft() {
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignora
    }
  }

  // =========================================================================
  // Serialização exata para Google Forms (formResponse)
  // =========================================================================

  function buildGoogleFormParams() {
    const params = new URLSearchParams();
    params.set('fvv', '1');
    params.set('pageHistory', '0');

    const textEntries = [
      'entry.1138892080',
      'entry.41963559',
      'entry.1013710270',
      'entry.576078053',
      'entry.1259400949',
      'entry.340399920',
      'entry.1937562438',
      'entry.1018512506',
      'entry.1585407007',
    ];

    textEntries.forEach((entryName) => {
      const el = form.elements.namedItem(entryName);
      const val = el ? el.value.trim() : '';
      if (val) {
        params.set(entryName, val);
      }
    });

    // Data de nascimento (3 parâmetros separados exigidos pelo Google Forms)
    if (birthDateInput && birthDateInput.value) {
      const [yearStr, monthStr, dayStr] = birthDateInput.value.split('-');
      if (yearStr && monthStr && dayStr) {
        params.set('entry.496325146_year', yearStr);
        params.set('entry.496325146_month', String(parseInt(monthStr, 10)));
        params.set('entry.496325146_day', String(parseInt(dayStr, 10)));
      }
    }

    // Rádios simples
    ['entry.1758095674', 'entry.796711182', 'entry.337312505', 'entry.1722743492', 'entry.245329159', 'entry.670621807'].forEach(
      (radioName) => {
        const selected = getSelectedRadio(radioName);
        if (selected && selected.value) {
          params.set(radioName, selected.value);
        }
      }
    );

    // Questão 16: Condições de pele ("Nenhum desses" mapeado para __other_option__ + "Nenhum")
    const condicao = getSelectedRadio('entry.689548746');
    if (condicao) {
      if (condicao.value === '__nenhum__') {
        params.set('entry.689548746', '__other_option__');
        params.set('entry.689548746.other_option_response', 'Nenhum');
      } else if (condicao.value === '__other_option__') {
        params.set('entry.689548746', '__other_option__');
        params.set(
          'entry.689548746.other_option_response',
          condicoesOutroInput.value.trim()
        );
      } else {
        params.set('entry.689548746', condicao.value);
      }
    }

    // Questão 18: Limpeza profissional (opcional com "Outro")
    const limpeza = getSelectedRadio('entry.152580699');
    if (limpeza) {
      if (limpeza.value === '__other_option__') {
        params.set('entry.152580699', '__other_option__');
        params.set(
          'entry.152580699.other_option_response',
          limpezaOutroInput.value.trim()
        );
      } else {
        params.set('entry.152580699', limpeza.value);
      }
    }

    return params;
  }

  function showSuccessScreen(firstName) {
    clearDraft();
    form.hidden = true;
    stepNav.hidden = true;
    intro.hidden = true;
    if (stepErrorBanner) stepErrorBanner.hidden = true;
    if (submitErrorBanner) submitErrorBanner.hidden = true;

    if (firstName) {
      successTitle.textContent = `Obrigada, ${firstName}! Ficha recebida`;
      successMessage.textContent =
        'Suas respostas já foram encaminhadas para a Adri Sant’Anna Beauty preparar o seu atendimento de forma personalizada.';
    }

    successSection.hidden = false;
    card.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    successTitle.focus({ preventScroll: true });
    announce('Ficha enviada com sucesso.');
  }

  // =========================================================================
  // Listeners
  // =========================================================================

  function bindEvents() {
    form.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (target.name === '_honeypot') return;

      dirtyControls.add(target);
      if (target.classList.contains('is-invalid') || target.getAttribute('aria-invalid') === 'true') {
        validateTextControl(target);
      }
      if (stepErrorBanner && !stepErrorBanner.hidden && !getFirstInvalidInStep(currentStep)) {
        stepErrorBanner.hidden = true;
      }
      saveDraft();
    });

    form.addEventListener(
      'blur',
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
        if (target.type === 'radio' || target.name === '_honeypot') return;
        if (dirtyControls.has(target) || target.value.trim() !== '') {
          validateTextControl(target);
        }
      },
      true
    );

    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== 'radio') return;

      const fieldset = target.closest('fieldset[data-required-radio]');
      if (fieldset) {
        setFieldsetErrorState(fieldset, false);
      }

      if (target.name === 'entry.689548746') {
        syncOtherBox('entry.689548746', condicoesOutroBox, condicoesOutroInput, true);
        if (target.value === '__other_option__') {
          condicoesOutroInput.focus();
        }
      } else if (target.name === 'entry.152580699') {
        syncOtherBox('entry.152580699', limpezaOutroBox, limpezaOutroInput, false);
        if (target.value === '__other_option__') {
          limpezaOutroInput.focus();
        }
      }

      if (stepErrorBanner && !stepErrorBanner.hidden && !getFirstInvalidInStep(currentStep)) {
        stepErrorBanner.hidden = true;
      }
      saveDraft();
    });

    form.querySelectorAll('[data-next-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextStep = Number(btn.dataset.nextStep);
        if (!validateStep(currentStep)) return;
        goToStep(nextStep);
      });
    });

    form.querySelectorAll('[data-prev-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prevStep = Number(btn.dataset.prevStep);
        goToStep(prevStep);
      });
    });

    stepNav.querySelectorAll('[data-go-step]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const targetStep = Number(trigger.dataset.goStep);
        if (targetStep === currentStep) return;

        if (targetStep < currentStep) {
          goToStep(targetStep);
          return;
        }

        // Avanço sequencial validando etapas intermediárias
        for (let step = currentStep; step < targetStep; step += 1) {
          if (!validateStep(step)) {
            if (step !== currentStep) goToStep(step);
            return;
          }
        }
        goToStep(targetStep);
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      // Valida etapas anteriores caso o usuário tenha editado via salto
      for (const step of [1, 2, 3]) {
        if (!validateStep(step, { focusInvalid: false, showBanner: false })) {
          if (step !== currentStep) {
            goToStep(step, true);
          }
          validateStep(step, { focusInvalid: true, showBanner: true });
          return;
        }
      }

      const fullName = String(form.elements.namedItem('entry.1138892080')?.value || '').trim();
      const firstName = fullName.split(/\s+/)[0] || '';

      // Se o campo honeypot estiver preenchido, simula sucesso silenciosamente
      const trap = document.getElementById('clinicTrap');
      if (trap && trap.value.trim()) {
        showSuccessScreen(firstName);
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtnLabel.textContent = 'Enviando sua ficha...';
      if (submitErrorBanner) submitErrorBanner.hidden = true;

      try {
        const params = buildGoogleFormParams();
        await fetch(GOOGLE_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: params.toString(),
        });

        showSuccessScreen(firstName);
      } catch {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtnLabel.textContent = 'Enviar Ficha';
        if (submitErrorBanner) submitErrorBanner.hidden = false;
        announce('Não foi possível enviar a ficha. Verifique sua conexão e tente novamente.');
      }
    });
  }

  initBirthDateBounds();
  restoreDraft();
  syncAllOtherBoxes();
  updateStepUI();
  bindEvents();
})();
