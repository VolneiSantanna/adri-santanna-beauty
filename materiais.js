/* ==========================================================================
   Adri Sant'Anna Beauty — Estúdio Privativo de Materiais & PDFs (/materiais)
   100% client-side: PIN local, 4 modelos editáveis, prévia A4 e exportação PDF
   ========================================================================== */

(() => {
  'use strict';

  const PIN_HASH_SHA256 = 'beacfe323302c40f3131e3cfb0eb33cddc492115469b8c0ccfe6bb9309843dfd';
  const PIN_HASH_FNV1A = 'bc542364';
  const STORAGE_KEY_STATE = 'adri_studio_state_v2';
  const STORAGE_KEY_UNLOCK = 'adri_studio_unlocked_v1';
  const SESSION_KEY_UNLOCK = 'adri_studio_session_v1';

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const CLINIC = {
    name: 'Adri Sant’Anna Beauty',
    signature: 'Adri Sant’Anna',
    role: 'Esteta & Cosmetóloga',
    addressLine1: 'Av. Palmeira, 27 — Sala 307 • Centro Empresarial Montreal',
    addressLine2: 'Bairro Petrópolis • Porto Alegre, RS • CEP 90470-300',
    instagramHandle: '@adrisantannabeauty',
    instagramUrl: 'https://www.instagram.com/adrisantannabeauty',
    whatsappDisplay: '(51) 98136-0838',
    whatsappUrl: 'https://wa.me/5551981360838',
  };

  const SVG_ICONS = {
    star: `<svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M8 1.5C9.2 5.2 10.8 6.8 14.5 8C10.8 9.2 9.2 10.8 8 14.5C6.8 10.8 5.2 9.2 1.5 8C5.2 6.8 6.8 5.2 8 1.5Z"/></svg>`,
    monogram: `<svg class="doc-monogram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" fill="none" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#4A5853"/><rect x="4" y="4" width="56" height="56" rx="14" stroke="#C88D90" stroke-opacity="0.65" stroke-width="1"/><path d="M21 44L29 20H31.5L39.5 44M24.2 35.5H36.3" stroke="#F7F1EC" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M44.5 24.5C44.5 22 42 20.5 39.5 21C37.2 21.5 36.2 23.4 37.2 25.3C38.4 27.6 44 27.8 44.5 31.2C45 34.4 41.8 36 39 35.4" stroke="#D4A3A5" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    bag: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5.5 7H14.5L15.4 16H4.6L5.5 7Z" stroke-linejoin="round"/><path d="M7.5 7V5.5C7.5 4.12 8.62 3 10 3C11.38 3 12.5 4.12 12.5 5.5V7" stroke-linecap="round"/></svg>`,
    alert: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 6.5V10.5" stroke-linecap="round"/><circle cx="10" cy="13.5" r="0.8" fill="currentColor" stroke="none"/></svg>`,
    up: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 15V5M10 5L5.5 9.5M10 5L14.5 9.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 5V15M10 15L5.5 10.5M10 15L14.5 10.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    trash: `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 6H15.5M8 6V4.2C8 3.81 8.31 3.5 8.7 3.5H11.3C11.69 3.5 12 3.81 12 4.2V6M6.5 6L7.2 15.8C7.25 16.47 7.81 17 8.48 17H11.52C12.19 17 12.75 16.47 12.8 15.8L13.5 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    watermark: `<svg class="doc-watermark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="240" height="240" fill="none" aria-hidden="true"><path d="M18 47L28.5 16H32L42.5 47M22.2 35.8H38.3" stroke="#EFE4E6" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 21.5C48 18 44.5 16 41.2 16.7C38.2 17.4 36.8 20 38.2 22.6C39.8 25.8 47.4 26 48 30.8C48.7 35.2 44.4 37.5 40.5 36.7" stroke="#EFE4E6" stroke-width="3.4" stroke-linecap="round"/></svg>`,
  };

  const POS_PRESETS = {
    microagulhamento: {
      title: 'Cuidados Pós-Microagulhamento Facial',
      subtitle: 'Orientações essenciais para uma recuperação segura e resultados luminosos',
      numberingStyle: 'numeric',
      blocks: [
        {
          heading: 'Primeiras 24 a 48 horas',
          style: 'paragraph',
          content:
            'É normal apresentar vermelhidão leve a moderada (semelhante a uma queimadura solar), leve edema (inchaço) e sensação de calor na pele. Esses sinais fazem parte da resposta inflamatória induzida para estimular a regeneração do colágeno.',
        },
        {
          heading: 'Higienização e Hidratação',
          style: 'bullets',
          content:
            'Lave o rosto suavemente com água fria ou morna e sabonete neutro/hipoalergênico indicado pela clínica.\nUtilize apenas produtos de suporte à barreira cutânea (como séruns calmantes à base de ácido hialurônico, pantenol ou probióticos) conforme prescrição.\nMantenha a pele limpa e evite tocar no rosto com as mãos sem higienizar.',
        },
        {
          heading: 'O que evitar rigorosamente',
          style: 'bullets',
          content:
            'Maquiagem: Evite o uso nas primeiras 24 a 48 horas para prevenir infecções e obstrução dos microcanais.\nExposição Solar: Evite sol direto. O uso de protetor solar com FPS 30 ou superior é obrigatório a partir do dia seguinte, mesmo em ambientes internos.\nÁcidos e Esfoliantes: Suspenda o uso de ácidos (retinóicos, glicólicos, salicílicos) e esfoliantes mecânicos por pelo menos 5 a 7 dias ou até liberação profissional.\nExercícios Intensos: Evite atividades físicas pesadas e saunas nos primeiros 2 dias para prevenir irritações causadas pelo suor.',
        },
      ],
      attention:
        'Nunca arranque eventuais crostas ou áreas de descamação que possam surgir durante o processo de cicatrização natural da pele.',
    },
    limpeza: {
      title: 'Cuidados Pós-Limpeza de Pele',
      subtitle: 'Orientações essenciais para manter sua pele limpa, calma e protegida',
      numberingStyle: 'roman',
      blocks: [
        {
          heading: 'Proteção Solar Rigorosa',
          style: 'paragraph',
          content:
            'Evite a exposição solar direta nos primeiros dias. Utilize protetor solar com FPS adequado diariamente, mesmo em ambientes internos ou dias nublados, para proteger a pele renovada.',
        },
        {
          heading: 'Hidratação Delicada',
          style: 'paragraph',
          content:
            'Mantenha a barreira cutânea protegida com cremes ou séruns hidratantes leves, calmantes e hipoalergênicos recomendados para o seu tipo de pele.',
        },
        {
          heading: 'Toque Zero',
          style: 'paragraph',
          content:
            'Evite ao máximo tocar no rosto ou tentar espremer qualquer pequena casquinha ou vermelhidão residual. A pele está em processo natural de cicatrização.',
        },
        {
          heading: 'Pausa em Ácidos e Maquiagem',
          style: 'paragraph',
          content:
            'Suspenda o uso de ácidos, esfoliantes químicos ou físicos e maquiagem pesada por pelo menos 24 a 48 horas após o procedimento.',
        },
        {
          heading: 'Higienização Suave',
          style: 'paragraph',
          content:
            'Lave o rosto apenas com água fria ou morna e utilize um sabonete líquido neutro ou syndet indicado em consulta.',
        },
      ],
      attention:
        'Nos primeiros dois dias, prefira trocar a fronha por uma limpa e evite exposição a vapor excessivo ou sauna para preservar o conforto da pele.',
    },
    laser: {
      title: 'Cuidados Pós-Fototerapia Laser & LED',
      subtitle: 'Orientações após sessão com tecnologia Fluence MAXX HTM',
      numberingStyle: 'roman',
      blocks: [
        {
          heading: 'Fotoproteção Diária',
          style: 'paragraph',
          content:
            'Aplique protetor solar de amplo espectro pela manhã e reaplique ao longo do dia, mesmo em ambientes internos.',
        },
        {
          heading: 'Hidratação e Ação Calmante',
          style: 'paragraph',
          content:
            'Mantenha a rotina hidratante e calmante indicada na clínica para potencializar a resposta reparadora e luminosa da fotobiomodulação.',
        },
        {
          heading: 'Conforto Térmico da Pele',
          style: 'paragraph',
          content:
            'Nas primeiras 24 horas, evite lavar o rosto com água muito quente, frequentar saunas ou expor a pele ao sol direto.',
        },
      ],
      attention:
        'Siga normalmente os dermocosméticos combinados no seu protocolo e avise a clínica antes de introduzir qualquer ativo novo em casa.',
    },
    peeling: {
      title: 'Cuidados Pós-Peeling & Renovação',
      subtitle: 'Proteção e suporte de barreira durante o processo de renovação celular',
      numberingStyle: 'numeric',
      blocks: [
        {
          heading: 'Respeite a Descamação Natural',
          style: 'paragraph',
          content:
            'Caso a pele apresente descamação fina nos dias seguintes, não puxe as pelinhas — permita que se soltem naturalmente durante a higienização suave.',
        },
        {
          heading: 'Limpeza e Hidratação Reparadora',
          style: 'paragraph',
          content:
            'Utilize sabonete suave sem partículas esfoliantes e aplique seu sérum ou creme reparador conforme orientação da consulta.',
        },
        {
          heading: 'Sol e Ativos Irritativos',
          style: 'bullets',
          content:
            'Protetor Solar: Uso obrigatório e reaplicação a cada 3 horas durante exposição à luz natural.\nPausa de Ativos: Suspenda esfoliantes e outros ácidos até a pele retornar completamente ao conforto habitual.',
        },
      ],
      attention:
        'Em caso de sensibilidade fora do previsto ou dúvida sobre algum produto da sua rotina, envie uma mensagem pelo WhatsApp da clínica.',
    },
    branco: {
      title: 'Orientações Pós-Procedimento',
      subtitle: 'Recomendações personalizadas de cuidados após seu atendimento',
      numberingStyle: 'numeric',
      blocks: [
        {
          heading: 'Cuidado Principal',
          style: 'paragraph',
          content: 'Escreva aqui as instruções específicas para a cliente.',
        },
      ],
      attention: '',
    },
  };

  function todayPtBr() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  }

  function cloneData(value) {
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultState() {
    const today = todayPtBr();
    return {
      version: 2,
      activeModel: 'plano',
      theme: 'clean',
      whatsappCustomEdited: false,
      whatsappText: '',
      anamneseCustomEdited: false,
      anamneseInviteText: '',
      plano: {
        title: 'Plano de Tratamento & Home Care',
        subtitle: 'Protocolo personalizado para a saúde e vitalidade da sua pele',
        clientName: '',
        date: today,
        goal: 'Renovação celular, equilíbrio da barreira cutânea e estímulo de colágeno',
        includeProcedures: true,
        procedures: [
          {
            name: 'Limpeza de Pele Profunda',
            frequency: '2 sessões • 1x a cada 30 dias',
            notes: 'Higienização profunda, desobstrução dos poros e preparo biológico da pele.',
          },
          {
            name: 'Microagulhamento Facial',
            frequency: '3 sessões • intervalo de 30 dias',
            notes: 'Estímulo de colágeno, uniformização da textura e viço natural.',
          },
        ],
        includeProducts: true,
        products: [
          {
            name: 'Sabonete Facial Suave',
            period: 'Manhã e Noite',
            notes: 'Lavar o rosto suavemente com água fria ou morna para preservar a barreira cutânea.',
          },
          {
            name: 'Sérum Hidratante Reparador',
            period: 'Manhã e Noite',
            notes: 'Aplicar 3 a 4 gotas sobre a pele limpa para hidratar e acalmar diariamente.',
          },
          {
            name: 'Protetor Solar Facial FPS 50+',
            period: 'Manhã',
            notes: 'Aplicar generosamente pela manhã e reaplicar ao longo do dia.',
          },
        ],
        clinicProductsNote: true,
        notes:
          'Iniciaremos pela higienização e preparo da pele antes das sessões de microagulhamento. Qualquer dúvida entre os atendimentos, estou à disposição pelo WhatsApp.',
      },
      pos: {
        presetKey: 'microagulhamento',
        title: POS_PRESETS.microagulhamento.title,
        subtitle: POS_PRESETS.microagulhamento.subtitle,
        clientName: '',
        date: '',
        numberingStyle: POS_PRESETS.microagulhamento.numberingStyle,
        blocks: cloneData(POS_PRESETS.microagulhamento.blocks),
        attention: POS_PRESETS.microagulhamento.attention,
      },
      rotina: {
        title: 'Rotina Personalizada Home Care',
        subtitle: 'Passo a passo diário para manter sua pele saudável, equilibrada e protegida',
        clientName: '',
        date: today,
        goal: 'Fortalecimento da barreira cutânea, hidratação e fotoproteção diária',
        morning: [
          {
            product: 'Sabonete Facial Suave',
            usage: 'Lavar o rosto com movimentos leves e água fria ou morna ao acordar.',
          },
          {
            product: 'Sérum Hidratante / Antioxidante',
            usage: 'Aplicar 3 a 4 gotas sobre a pele limpa e seca antes do protetor.',
          },
          {
            product: 'Protetor Solar Facial FPS 50+',
            usage: 'Aplicar camada generosa no rosto e pescoço e reaplicar ao longo do dia.',
          },
        ],
        night: [
          {
            product: 'Demaquilante ou Sabonete Suave',
            usage: 'Remover protetor solar e impurezas acumuladas ao longo do dia.',
          },
          {
            product: 'Sérum ou Creme Reparador Noturno',
            usage: 'Aplicar camada uniforme sobre a pele bem seca antes de dormir.',
          },
        ],
        clinicProductsNote: true,
        notes:
          'A constância diária potencializa os resultados dos atendimentos em cabine. Se precisar repor algum item, reserve diretamente aqui na clínica.',
      },
      livre: {
        title: 'Tratamento & Orientações Personalizadas',
        subtitle: '',
        clientName: '',
        date: '',
        blocks: [
          {
            heading: '',
            style: 'paragraph',
            content:
              'O protocolo indicado foi desenhado de acordo com a avaliação individual da sua pele, associando ativos de cosmetologia clínica com recursos de fotobiomodulação para restaurar equilíbrio, viço e saúde cutânea.\nO atendimento é realizado em cabine privativa, com conforto e preparo cuidadoso em cada etapa.\nO número de sessões e o intervalo entre os encontros podem variar conforme a resposta biológica da sua pele e seus objetivos.\nQualquer alteração na rotina de casa ou dúvida entre as sessões deve ser alinhada diretamente com a clínica para mantermos os resultados seguros e progressivos.',
          },
        ],
        closing: 'Estamos à disposição para maiores esclarecimentos.',
        callout: '',
      },
    };
  }

  function mergeLoadedState(raw) {
    const base = createDefaultState();
    if (!raw || typeof raw !== 'object') return base;
    if (['plano', 'pos', 'rotina', 'livre'].includes(raw.activeModel)) {
      base.activeModel = raw.activeModel;
    }
    if (['clean', 'porcelana', 'editorial'].includes(raw.theme)) {
      base.theme = raw.theme;
    }
    base.whatsappCustomEdited = Boolean(raw.whatsappCustomEdited);
    if (typeof raw.whatsappText === 'string') {
      base.whatsappText = raw.whatsappText;
    }
    base.anamneseCustomEdited = Boolean(raw.anamneseCustomEdited);
    if (typeof raw.anamneseInviteText === 'string') {
      base.anamneseInviteText = raw.anamneseInviteText;
    }
    if (raw.plano && typeof raw.plano === 'object') {
      const defProcs = base.plano.procedures;
      const defProds = base.plano.products;
      Object.assign(base.plano, raw.plano);
      if (!Array.isArray(base.plano.procedures)) base.plano.procedures = defProcs;
      if (!Array.isArray(base.plano.products)) base.plano.products = defProds;
    }
    if (raw.pos && typeof raw.pos === 'object') {
      const defBlocks = base.pos.blocks;
      Object.assign(base.pos, raw.pos);
      if (!Array.isArray(base.pos.blocks)) base.pos.blocks = defBlocks;
    }
    if (raw.rotina && typeof raw.rotina === 'object') {
      const defMorning = base.rotina.morning;
      const defNight = base.rotina.night;
      Object.assign(base.rotina, raw.rotina);
      if (!Array.isArray(base.rotina.morning)) base.rotina.morning = defMorning;
      if (!Array.isArray(base.rotina.night)) base.rotina.night = defNight;
    }
    if (raw.livre && typeof raw.livre === 'object') {
      const defBlocks = base.livre.blocks;
      Object.assign(base.livre, raw.livre);
      if (!Array.isArray(base.livre.blocks)) base.livre.blocks = defBlocks;
    }
    return base;
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      if (!saved) return createDefaultState();
      return mergeLoadedState(JSON.parse(saved));
    } catch {
      return createDefaultState();
    }
  }

  let state = loadState();
  let isDesktopLayout = window.matchMedia('(min-width: 64rem)').matches;
  let mobileViewMode = 'editor';
  let saveTimer = null;
  let resetConfirmTimer = null;
  let pdfLibrariesPromise = null;
  let isExporting = false;

  // =========================================================================
  // Elementos DOM
  // =========================================================================

  const pinGate = document.getElementById('pinGate');
  const pinForm = document.getElementById('pinForm');
  const pinInput = document.getElementById('pinInput');
  const pinErrorText = document.getElementById('pinErrorText');
  const rememberPinCheckbox = document.getElementById('rememberPinCheckbox');
  const studioApp = document.getElementById('studioApp');

  const mobileViewTablist = document.querySelector('.mobile-view-tablist');
  const mobileViewTabs = Array.from(document.querySelectorAll('.mobile-view-tablist [role="tab"]'));
  const modelTablist = document.querySelector('.model-tablist');
  const modelTabs = Array.from(document.querySelectorAll('.model-tablist [role="tab"]'));
  const modelPanels = {
    plano: document.getElementById('panelModelPlano'),
    pos: document.getElementById('panelModelPos'),
    rotina: document.getElementById('panelModelRotina'),
    livre: document.getElementById('panelModelLivre'),
  };

  const editorPanel = document.getElementById('editorPanel');
  const previewPanel = document.getElementById('previewPanel');
  const a4Stage = document.getElementById('a4Stage');
  const a4PagesList = document.getElementById('a4PagesList');
  const pageEstimateBadge = document.getElementById('pageEstimateBadge');
  const previewHintText = document.getElementById('previewHintText');
  const modelHelperText = document.getElementById('modelHelperText');
  const jumpToPreviewBtn = document.getElementById('jumpToPreviewBtn');
  const autosaveStatus = document.getElementById('autosaveStatus');
  const studioStatus = document.getElementById('studioStatus');

  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const mobileExportPdfBtn = document.getElementById('mobileExportPdfBtn');
  const printPdfBtn = document.getElementById('printPdfBtn');
  const lockStudioBtn = document.getElementById('lockStudioBtn');

  const whatsappTextarea = document.getElementById('whatsappMessageOutput');
  const regenerateWhatsappBtn = document.getElementById('regenerateWhatsappBtn');

  const resetTemplateBtn = document.getElementById('resetTemplateBtn');
  const resetConfirmGroup = document.getElementById('resetConfirmGroup');
  const confirmResetBtn = document.getElementById('confirmResetBtn');
  const cancelResetBtn = document.getElementById('cancelResetBtn');

  // =========================================================================
  // Utilitários de Segurança, Texto e Formatação
  // =========================================================================

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatWithLineBreaks(text) {
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function formatBulletLine(line) {
    const clean = String(line ?? '').trim();
    const colonIndex = clean.indexOf(':');
    if (colonIndex > 0 && colonIndex <= 36) {
      const lead = clean.slice(0, colonIndex + 1);
      const rest = clean.slice(colonIndex + 1);
      return `<strong>${escapeHtml(lead)}</strong>${escapeHtml(rest)}`;
    }
    return escapeHtml(clean);
  }

  function toRoman(num) {
    const numerals = [
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    let n = Math.max(1, Math.min(39, num));
    let out = '';
    for (const [value, symbol] of numerals) {
      while (n >= value) {
        out += symbol;
        n -= value;
      }
    }
    return `${out}.`;
  }

  function slugifyFilename(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 44);
  }

  function buildPdfFilename() {
    const modelLabels = {
      plano: 'Plano',
      pos: 'Pos-Procedimento',
      rotina: 'Rotina-Home-Care',
      livre: 'Orientacoes',
    };
    const activeData = state[state.activeModel];
    const base = modelLabels[state.activeModel] || 'Material';
    const clientSlug = slugifyFilename(activeData?.clientName);
    const titleSlug = !clientSlug && state.activeModel === 'pos' ? slugifyFilename(activeData?.title) : '';
    const suffix = clientSlug || titleSlug;
    return suffix ? `Adri-SantAnna-${base}-${suffix}.pdf` : `Adri-SantAnna-${base}.pdf`;
  }

  function announceStudio(message) {
    if (!studioStatus) return;
    studioStatus.textContent = '';
    requestAnimationFrame(() => {
      studioStatus.textContent = message;
    });
  }

  // =========================================================================
  // Portão de Acesso por PIN (0838)
  // =========================================================================

  function fnv1aHex(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  async function verifyPin(pin) {
    const payload = `adri-santanna-${pin}`;
    if (window.crypto?.subtle) {
      const encoded = new TextEncoder().encode(payload);
      const buffer = await window.crypto.subtle.digest('SHA-256', encoded);
      const digest = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return digest === PIN_HASH_SHA256;
    }
    return fnv1aHex(payload) === PIN_HASH_FNV1A;
  }

  function isSessionUnlocked() {
    try {
      return (
        localStorage.getItem(STORAGE_KEY_UNLOCK) === '1' ||
        sessionStorage.getItem(SESSION_KEY_UNLOCK) === '1'
      );
    } catch {
      return false;
    }
  }

  function syncPinAriaInvalid(showError, message) {
    if (!pinInput) return;
    if (showError) {
      if (message && pinErrorText) pinErrorText.textContent = message;
      pinInput.classList.add('is-invalid');
      pinInput.setAttribute('aria-invalid', 'true');
      pinInput.setAttribute('aria-describedby', 'pinHint pinError');
    } else {
      pinInput.classList.remove('is-invalid');
      pinInput.setAttribute('aria-invalid', 'false');
      pinInput.setAttribute('aria-describedby', 'pinHint');
    }
  }

  function unlockStudio({ persist, focusEditor = false } = {}) {
    try {
      sessionStorage.setItem(SESSION_KEY_UNLOCK, '1');
      if (persist) {
        localStorage.setItem(STORAGE_KEY_UNLOCK, '1');
      }
    } catch {
      // Ignora caso armazenamento esteja indisponível
    }
    pinGate.hidden = true;
    studioApp.hidden = false;
    syncPinAriaInvalid(false);
    applyLayoutMode();
    renderAll();
    requestAnimationFrame(updatePreviewScale);
    if (focusEditor) {
      modelTabs.find((t) => t.getAttribute('aria-selected') === 'true')?.focus();
    }
  }

  function lockStudio() {
    try {
      localStorage.removeItem(STORAGE_KEY_UNLOCK);
      sessionStorage.removeItem(SESSION_KEY_UNLOCK);
    } catch {
      // Ignora erro de storage
    }
    studioApp.hidden = true;
    pinGate.hidden = false;
    pinInput.value = '';
    syncPinAriaInvalid(false);
    pinInput.focus();
  }

  if (pinForm) {
    pinInput.addEventListener('input', () => {
      pinInput.value = pinInput.value.replace(/\D/g, '').slice(0, 4);
      if (pinInput.classList.contains('is-invalid') || pinInput.matches(':user-invalid')) {
        syncPinAriaInvalid(false);
      }
    });

    pinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const value = pinInput.value.trim();
      if (!/^\d{4}$/.test(value)) {
        syncPinAriaInvalid(true, 'Informe exatamente 4 números para acessar o estúdio.');
        pinInput.focus();
        return;
      }

      const valid = await verifyPin(value);
      if (!valid) {
        syncPinAriaInvalid(true, 'PIN incorreto. Verifique os 4 dígitos da clínica e tente novamente.');
        pinInput.select();
        return;
      }

      unlockStudio({ persist: rememberPinCheckbox.checked, focusEditor: true });
    });
  }

  if (lockStudioBtn) {
    lockStudioBtn.addEventListener('click', lockStudio);
  }

  // =========================================================================
  // Persistência Automática
  // =========================================================================

  function scheduleSave() {
    if (autosaveStatus) {
      autosaveStatus.textContent = 'Salvando rascunho...';
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
        if (autosaveStatus) {
          autosaveStatus.textContent = 'Rascunho salvo neste aparelho';
        }
      } catch {
        if (autosaveStatus) {
          autosaveStatus.textContent = 'Rascunho ativo na sessão';
        }
      }
    }, 280);
  }

  // =========================================================================
  // Abas Acessíveis (tabs guide + fallback arrow keys)
  // =========================================================================

  function activateTab(tablistEl, tabs, selectedTab) {
    for (const tab of tabs) {
      const active = tab === selectedTab;
      tab.setAttribute('aria-selected', String(active));
      tab.toggleAttribute('focusgroupstart', active);
      tab.tabIndex = active ? 0 : -1;
    }
    selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function setupTablist(tablistEl, tabs, onSelect) {
    if (!tablistEl || !tabs.length) return;

    const initial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    activateTab(tablistEl, tabs, initial);

    tablistEl.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (!tab || !tabs.includes(tab)) return;
      activateTab(tablistEl, tabs, tab);
      onSelect(tab);
    });

    tablistEl.addEventListener('keydown', (event) => {
      const current = event.target.closest('[role="tab"]');
      if (!current) return;
      const idx = tabs.indexOf(current);
      if (idx === -1) return;

      let nextIdx = null;
      if (event.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = tabs.length - 1;

      if (nextIdx === null) return;
      event.preventDefault();
      const targetTab = tabs[nextIdx];
      targetTab.focus();
      activateTab(tablistEl, tabs, targetTab);
      onSelect(targetTab);
    });
  }

  function applyLayoutMode() {
    isDesktopLayout = window.matchMedia('(min-width: 64rem)').matches;
    if (isDesktopLayout) {
      editorPanel.hidden = false;
      previewPanel.hidden = false;
      editorPanel.removeAttribute('role');
      previewPanel.removeAttribute('role');
      editorPanel.removeAttribute('aria-labelledby');
      previewPanel.removeAttribute('aria-labelledby');
    } else {
      editorPanel.setAttribute('role', 'tabpanel');
      previewPanel.setAttribute('role', 'tabpanel');
      editorPanel.setAttribute('aria-labelledby', 'tabViewEditor');
      previewPanel.setAttribute('aria-labelledby', 'tabViewPreview');
      editorPanel.hidden = mobileViewMode !== 'editor';
      previewPanel.hidden = mobileViewMode !== 'preview';
    }
    requestAnimationFrame(updatePreviewScale);
  }

  window.matchMedia('(min-width: 64rem)').addEventListener('change', applyLayoutMode);

  setupTablist(mobileViewTablist, mobileViewTabs, (tab) => {
    mobileViewMode = tab.dataset.view === 'preview' ? 'preview' : 'editor';
    applyLayoutMode();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (mobileViewMode === 'preview') {
      updatePreviewScale();
    }
  });

  setupTablist(modelTablist, modelTabs, (tab) => {
    const nextModel = tab.dataset.model;
    if (!nextModel || !modelPanels[nextModel]) return;
    state.activeModel = nextModel;
    syncActiveModelUI();
    scheduleSave();
    renderDocument();
    updateWhatsappMessage();
  });

  const MODEL_HELPERS = {
    plano: 'Para indicar sessões na clínica e os produtos para a cliente usar em casa.',
    pos: 'Guias prontos de cuidados após o atendimento — escolha um modelo ou edite.',
    rotina: 'Passo a passo organizado da manhã e da noite para a cliente seguir em casa.',
    livre: 'Folha livre para informativos ou textos corridos. Aperte Enter para separar os parágrafos.',
  };

  function syncActiveModelUI() {
    const activeTab = modelTabs.find((t) => t.dataset.model === state.activeModel) || modelTabs[0];
    if (activeTab) {
      activateTab(modelTablist, modelTabs, activeTab);
    }
    for (const [key, panel] of Object.entries(modelPanels)) {
      if (panel) panel.hidden = key !== state.activeModel;
    }
    if (modelHelperText && MODEL_HELPERS[state.activeModel]) {
      modelHelperText.textContent = MODEL_HELPERS[state.activeModel];
    }
  }

  jumpToPreviewBtn?.addEventListener('click', () => {
    const previewTab = document.getElementById('tabViewPreview');
    if (previewTab && mobileViewTablist) {
      activateTab(mobileViewTablist, mobileViewTabs, previewTab);
    }
    mobileViewMode = 'preview';
    applyLayoutMode();
    window.scrollTo({ top: 0, behavior: 'auto' });
    updatePreviewScale();
  });

  // =========================================================================
  // Seletor de Estilo da Folha (Clínico Clean / Porcelana / Editorial Verde)
  // =========================================================================

  const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));

  function syncThemeUI() {
    for (const btn of themeButtons) {
      const selected = btn.dataset.themeChoice === state.theme;
      btn.setAttribute('aria-pressed', String(selected));
    }
    a4PagesList?.querySelectorAll('.a4-sheet').forEach((sheet) => {
      sheet.setAttribute('data-theme', state.theme);
    });
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTheme = btn.dataset.themeChoice;
      if (!nextTheme || !['clean', 'porcelana', 'editorial'].includes(nextTheme)) return;
      state.theme = nextTheme;
      syncThemeUI();
      scheduleSave();
      renderDocument();
    });
  });

  // =========================================================================
  // Construtor Genérico de Listas Dinâmicas (Sem Duplicação de Lógica)
  // =========================================================================

  function renderDynamicList(container, items, config) {
    if (!container) return;
    container.innerHTML = '';

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'dynamic-empty';
      empty.textContent = config.emptyText;
      container.append(empty);
      return;
    }

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'editor-item';

      const head = document.createElement('div');
      head.className = 'editor-item-head';

      const title = document.createElement('span');
      title.className = 'editor-item-index';
      title.textContent = `${config.itemLabel} ${index + 1}`;

      const controls = document.createElement('div');
      controls.className = 'editor-item-controls';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'icon-btn';
      upBtn.disabled = index === 0;
      upBtn.setAttribute('aria-label', `Mover ${config.itemLabel.toLowerCase()} ${index + 1} para cima`);
      upBtn.innerHTML = SVG_ICONS.up;
      upBtn.addEventListener('click', () => {
        if (index === 0) return;
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
        renderDynamicList(container, items, config);
        scheduleSave();
        renderDocument();
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'icon-btn';
      downBtn.disabled = index === items.length - 1;
      downBtn.setAttribute('aria-label', `Mover ${config.itemLabel.toLowerCase()} ${index + 1} para baixo`);
      downBtn.innerHTML = SVG_ICONS.down;
      downBtn.addEventListener('click', () => {
        if (index >= items.length - 1) return;
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
        renderDynamicList(container, items, config);
        scheduleSave();
        renderDocument();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'icon-btn icon-btn--danger';
      removeBtn.setAttribute('aria-label', `Remover ${config.itemLabel.toLowerCase()} ${index + 1}`);
      removeBtn.innerHTML = SVG_ICONS.trash;
      removeBtn.addEventListener('click', () => {
        items.splice(index, 1);
        renderDynamicList(container, items, config);
        scheduleSave();
        renderDocument();
        announceStudio(`${config.itemLabel} removido.`);
      });

      controls.append(upBtn, downBtn, removeBtn);
      head.append(title, controls);
      card.append(head);

      const grid = document.createElement('div');
      grid.className = 'field-grid';

      config.fields.forEach((fieldDef) => {
        const group = document.createElement('div');
        group.className = fieldDef.full ? 'field-group field-span-2' : 'field-group';
        const inputId = `${config.idPrefix}_${index}_${fieldDef.key}`;

        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = fieldDef.label;

        let control;
        if (fieldDef.type === 'select') {
          control = document.createElement('select');
          fieldDef.options.forEach((opt) => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            control.append(option);
          });
          control.value = item[fieldDef.key] ?? fieldDef.options[0]?.value ?? '';
        } else if (fieldDef.type === 'textarea') {
          control = document.createElement('textarea');
          control.rows = fieldDef.rows || 3;
          control.placeholder = fieldDef.placeholder || '';
          control.value = item[fieldDef.key] ?? '';
        } else {
          control = document.createElement('input');
          control.type = 'text';
          control.placeholder = fieldDef.placeholder || '';
          control.value = item[fieldDef.key] ?? '';
        }

        control.id = inputId;
        const eventType = fieldDef.type === 'select' ? 'change' : 'input';
        control.addEventListener(eventType, () => {
          item[fieldDef.key] = control.value;
          scheduleSave();
          renderDocument();
        });

        group.append(label);
        if (fieldDef.hint) {
          const hint = document.createElement('span');
          hint.className = 'field-hint';
          hint.textContent = fieldDef.hint;
          group.append(hint);
        }
        group.append(control);
        grid.append(group);
      });

      card.append(grid);
      container.append(card);
    });
  }

  // Configurações de cada lista dinâmica
  const LIST_CONFIGS = {
    planoProcedures: {
      idPrefix: 'proc',
      itemLabel: 'Procedimento',
      emptyText: 'Nenhum procedimento adicionado. Toque nos atalhos acima para incluir.',
      fields: [
        { key: 'name', label: 'Nome do procedimento', placeholder: 'Ex.: Limpeza de Pele Profunda' },
        { key: 'frequency', label: 'Sessões e intervalo', placeholder: 'Ex.: 2 sessões • 1x a cada 30 dias' },
        {
          key: 'notes',
          label: 'Descrição / Objetivo (opcional)',
          placeholder: 'Ex.: Higienização profunda e preparo da pele.',
          full: true,
        },
      ],
    },
    planoProducts: {
      idPrefix: 'prod',
      itemLabel: 'Produto',
      emptyText: 'Nenhum produto adicionado. Toque em “Adicionar produto” abaixo.',
      fields: [
        { key: 'name', label: 'Nome do produto', placeholder: 'Ex.: Sérum Hidratante Reparador' },
        {
          key: 'period',
          label: 'Uso indicado',
          type: 'select',
          options: [
            { value: 'Manhã e Noite', label: 'Manhã e Noite' },
            { value: 'Manhã', label: 'Manhã' },
            { value: 'Noite', label: 'Noite' },
            { value: 'Conforme orientação', label: 'Conforme orientação' },
          ],
        },
        {
          key: 'notes',
          label: 'Como usar / Benefício',
          placeholder: 'Ex.: Aplicar 3 gotas sobre a pele limpa antes do protetor.',
          full: true,
        },
      ],
    },
    posBlocks: {
      idPrefix: 'pos_block',
      itemLabel: 'Bloco',
      emptyText: 'Nenhum bloco adicionado. Toque em “Adicionar bloco de cuidado” abaixo.',
      fields: [
        { key: 'heading', label: 'Título do cuidado', placeholder: 'Ex.: Higienização Suave' },
        {
          key: 'style',
          label: 'Formato do texto',
          type: 'select',
          options: [
            { value: 'paragraph', label: 'Parágrafo contínuo' },
            { value: 'bullets', label: 'Lista com marcadores' },
          ],
        },
        {
          key: 'content',
          label: 'Orientações',
          type: 'textarea',
          rows: 3,
          hint: 'No formato lista com marcadores, coloque 1 item por linha (pode usar “Rótulo: texto”).',
          placeholder: 'Escreva as instruções deste bloco...',
          full: true,
        },
      ],
    },
    rotinaMorning: {
      idPrefix: 'rotina_am',
      itemLabel: 'Passo',
      emptyText: 'Nenhum passo da manhã adicionado.',
      fields: [
        { key: 'product', label: 'Produto / Etapa', placeholder: 'Ex.: Protetor Solar FPS 50+', full: true },
        {
          key: 'usage',
          label: 'Modo de aplicação',
          placeholder: 'Ex.: Aplicar camada generosa no rosto e pescoço.',
          full: true,
        },
      ],
    },
    rotinaNight: {
      idPrefix: 'rotina_pm',
      itemLabel: 'Passo',
      emptyText: 'Nenhum passo da noite adicionado.',
      fields: [
        { key: 'product', label: 'Produto / Etapa', placeholder: 'Ex.: Sérum Reparador Noturno', full: true },
        {
          key: 'usage',
          label: 'Modo de aplicação',
          placeholder: 'Ex.: Aplicar sobre a pele limpa e seca antes de dormir.',
          full: true,
        },
      ],
    },
    livreBlocks: {
      idPrefix: 'livre_block',
      itemLabel: 'Bloco',
      emptyText: 'Nenhum bloco adicionado.',
      fields: [
        { key: 'heading', label: 'Subtítulo do bloco', placeholder: 'Ex.: Preparo pré-atendimento' },
        {
          key: 'style',
          label: 'Formato do texto',
          type: 'select',
          options: [
            { value: 'paragraph', label: 'Parágrafo contínuo' },
            { value: 'bullets', label: 'Lista com marcadores' },
          ],
        },
        {
          key: 'content',
          label: 'Conteúdo',
          type: 'textarea',
          rows: 5,
          hint: 'Aperte Enter para separar os parágrafos — se ficar longo, o PDF divide as páginas sozinho.',
          placeholder: 'Escreva o conteúdo deste bloco...',
          full: true,
        },
      ],
    },
  };

  // =========================================================================
  // Ligação Bidirecional dos Formulários com o Estado
  // =========================================================================

  function bindSimpleField(id, section, key, { refreshWhatsapp = false, type = 'value' } = {}) {
    const el = document.getElementById(id);
    if (!el) return;

    const eventType = type === 'checked' || el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(eventType, () => {
      state[section][key] = type === 'checked' ? el.checked : el.value;
      if (section === 'plano' && (key === 'includeProcedures' || key === 'includeProducts')) {
        syncPlanoSectionVisibility();
      }
      scheduleSave();
      renderDocument();
      if (refreshWhatsapp) {
        updateWhatsappMessage();
      }
    });
  }

  function syncPlanoSectionVisibility() {
    const procWrap = document.getElementById('planoProceduresWrap');
    const prodWrap = document.getElementById('planoProductsWrap');
    if (procWrap) procWrap.hidden = !state.plano.includeProcedures;
    if (prodWrap) prodWrap.hidden = !state.plano.includeProducts;
  }

  function syncPosPresetButtons() {
    document.querySelectorAll('[data-pos-preset]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.posPreset === state.pos.presetKey));
    });
  }

  function syncFormValuesFromState() {
    // Plano
    document.getElementById('planoTitle').value = state.plano.title;
    document.getElementById('planoSubtitle').value = state.plano.subtitle;
    document.getElementById('planoClientName').value = state.plano.clientName;
    document.getElementById('planoDate').value = state.plano.date;
    document.getElementById('planoGoal').value = state.plano.goal;
    document.getElementById('planoIncludeProcedures').checked = state.plano.includeProcedures;
    document.getElementById('planoIncludeProducts').checked = state.plano.includeProducts;
    document.getElementById('planoClinicProductsNote').checked = state.plano.clinicProductsNote;
    document.getElementById('planoNotes').value = state.plano.notes;
    syncPlanoSectionVisibility();

    // Pós
    document.getElementById('posTitle').value = state.pos.title;
    document.getElementById('posSubtitle').value = state.pos.subtitle;
    document.getElementById('posClientName').value = state.pos.clientName;
    document.getElementById('posDate').value = state.pos.date;
    document.getElementById('posNumberingStyle').value = state.pos.numberingStyle;
    document.getElementById('posAttention').value = state.pos.attention;
    syncPosPresetButtons();

    // Rotina
    document.getElementById('rotinaTitle').value = state.rotina.title;
    document.getElementById('rotinaSubtitle').value = state.rotina.subtitle;
    document.getElementById('rotinaClientName').value = state.rotina.clientName;
    document.getElementById('rotinaDate').value = state.rotina.date;
    document.getElementById('rotinaGoal').value = state.rotina.goal;
    document.getElementById('rotinaClinicProductsNote').checked = state.rotina.clinicProductsNote;
    document.getElementById('rotinaNotes').value = state.rotina.notes;

    // Livre
    document.getElementById('livreTitle').value = state.livre.title;
    document.getElementById('livreSubtitle').value = state.livre.subtitle;
    document.getElementById('livreClientName').value = state.livre.clientName;
    document.getElementById('livreDate').value = state.livre.date;
    document.getElementById('livreClosing').value = state.livre.closing ?? '';
    document.getElementById('livreCallout').value = state.livre.callout;

    // Listas dinâmicas
    renderDynamicList(document.getElementById('planoProceduresList'), state.plano.procedures, LIST_CONFIGS.planoProcedures);
    renderDynamicList(document.getElementById('planoProductsList'), state.plano.products, LIST_CONFIGS.planoProducts);
    renderDynamicList(document.getElementById('posBlocksList'), state.pos.blocks, LIST_CONFIGS.posBlocks);
    renderDynamicList(document.getElementById('rotinaMorningList'), state.rotina.morning, LIST_CONFIGS.rotinaMorning);
    renderDynamicList(document.getElementById('rotinaNightList'), state.rotina.night, LIST_CONFIGS.rotinaNight);
    renderDynamicList(document.getElementById('livreBlocksList'), state.livre.blocks, LIST_CONFIGS.livreBlocks);
  }

  function setupFormBindings() {
    // Plano
    bindSimpleField('planoTitle', 'plano', 'title', { refreshWhatsapp: true });
    bindSimpleField('planoSubtitle', 'plano', 'subtitle');
    bindSimpleField('planoClientName', 'plano', 'clientName', { refreshWhatsapp: true });
    bindSimpleField('planoDate', 'plano', 'date');
    bindSimpleField('planoGoal', 'plano', 'goal');
    bindSimpleField('planoIncludeProcedures', 'plano', 'includeProcedures', { type: 'checked', refreshWhatsapp: true });
    bindSimpleField('planoIncludeProducts', 'plano', 'includeProducts', { type: 'checked', refreshWhatsapp: true });
    bindSimpleField('planoClinicProductsNote', 'plano', 'clinicProductsNote', { type: 'checked' });
    bindSimpleField('planoNotes', 'plano', 'notes');

    // Pós
    bindSimpleField('posTitle', 'pos', 'title', { refreshWhatsapp: true });
    bindSimpleField('posSubtitle', 'pos', 'subtitle');
    bindSimpleField('posClientName', 'pos', 'clientName', { refreshWhatsapp: true });
    bindSimpleField('posDate', 'pos', 'date');
    bindSimpleField('posNumberingStyle', 'pos', 'numberingStyle');
    bindSimpleField('posAttention', 'pos', 'attention');

    // Rotina
    bindSimpleField('rotinaTitle', 'rotina', 'title', { refreshWhatsapp: true });
    bindSimpleField('rotinaSubtitle', 'rotina', 'subtitle');
    bindSimpleField('rotinaClientName', 'rotina', 'clientName', { refreshWhatsapp: true });
    bindSimpleField('rotinaDate', 'rotina', 'date');
    bindSimpleField('rotinaGoal', 'rotina', 'goal');
    bindSimpleField('rotinaClinicProductsNote', 'rotina', 'clinicProductsNote', { type: 'checked' });
    bindSimpleField('rotinaNotes', 'rotina', 'notes');

    // Livre
    bindSimpleField('livreTitle', 'livre', 'title', { refreshWhatsapp: true });
    bindSimpleField('livreSubtitle', 'livre', 'subtitle');
    bindSimpleField('livreClientName', 'livre', 'clientName', { refreshWhatsapp: true });
    bindSimpleField('livreDate', 'livre', 'date');
    bindSimpleField('livreClosing', 'livre', 'closing');
    bindSimpleField('livreCallout', 'livre', 'callout');

    // Botões rápidos de procedimentos no Plano
    document.querySelectorAll('[data-add-procedure]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.plano.includeProcedures = true;
        document.getElementById('planoIncludeProcedures').checked = true;
        syncPlanoSectionVisibility();

        state.plano.procedures.push({
          name: btn.dataset.addProcedure || '',
          frequency: btn.dataset.freq || '',
          notes: btn.dataset.notes || '',
        });
        const listEl = document.getElementById('planoProceduresList');
        renderDynamicList(listEl, state.plano.procedures, LIST_CONFIGS.planoProcedures);
        scheduleSave();
        renderDocument();
        updateWhatsappMessage();
        const lastInput = listEl.querySelector('.editor-item:last-child input');
        if (lastInput && !btn.dataset.addProcedure) lastInput.focus();
      });
    });

    // Botões adicionar item
    document.getElementById('addPlanoProductBtn')?.addEventListener('click', () => {
      state.plano.products.push({ name: '', period: 'Manhã e Noite', notes: '' });
      const listEl = document.getElementById('planoProductsList');
      renderDynamicList(listEl, state.plano.products, LIST_CONFIGS.planoProducts);
      scheduleSave();
      renderDocument();
      listEl.querySelector('.editor-item:last-child input')?.focus();
    });

    document.getElementById('addPosBlockBtn')?.addEventListener('click', () => {
      state.pos.blocks.push({ heading: '', style: 'paragraph', content: '' });
      const listEl = document.getElementById('posBlocksList');
      renderDynamicList(listEl, state.pos.blocks, LIST_CONFIGS.posBlocks);
      scheduleSave();
      renderDocument();
      listEl.querySelector('.editor-item:last-child input')?.focus();
    });

    document.getElementById('addRotinaMorningBtn')?.addEventListener('click', () => {
      state.rotina.morning.push({ product: '', usage: '' });
      const listEl = document.getElementById('rotinaMorningList');
      renderDynamicList(listEl, state.rotina.morning, LIST_CONFIGS.rotinaMorning);
      scheduleSave();
      renderDocument();
      listEl.querySelector('.editor-item:last-child input')?.focus();
    });

    document.getElementById('addRotinaNightBtn')?.addEventListener('click', () => {
      state.rotina.night.push({ product: '', usage: '' });
      const listEl = document.getElementById('rotinaNightList');
      renderDynamicList(listEl, state.rotina.night, LIST_CONFIGS.rotinaNight);
      scheduleSave();
      renderDocument();
      listEl.querySelector('.editor-item:last-child input')?.focus();
    });

    document.getElementById('addLivreBlockBtn')?.addEventListener('click', () => {
      state.livre.blocks.push({ heading: '', style: 'paragraph', content: '' });
      const listEl = document.getElementById('livreBlocksList');
      renderDynamicList(listEl, state.livre.blocks, LIST_CONFIGS.livreBlocks);
      scheduleSave();
      renderDocument();
      listEl.querySelector('.editor-item:last-child input')?.focus();
    });

    // Presets do Guia Pós-Procedimento
    document.querySelectorAll('[data-pos-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.posPreset;
        const preset = POS_PRESETS[key];
        if (!preset) return;
        state.pos.presetKey = key;
        state.pos.title = preset.title;
        state.pos.subtitle = preset.subtitle;
        state.pos.numberingStyle = preset.numberingStyle;
        state.pos.blocks = cloneData(preset.blocks);
        state.pos.attention = preset.attention;
        syncFormValuesFromState();
        scheduleSave();
        renderDocument();
        updateWhatsappMessage();
        announceStudio(`Modelo ${btn.textContent.trim()} carregado.`);
      });
    });

    // Mensagem WhatsApp (sincronização manual vs automática)
    whatsappTextarea?.addEventListener('input', () => {
      state.whatsappCustomEdited = true;
      state.whatsappText = whatsappTextarea.value;
      regenerateWhatsappBtn.hidden = false;
      scheduleSave();
    });

    regenerateWhatsappBtn?.addEventListener('click', () => {
      state.whatsappCustomEdited = false;
      updateWhatsappMessage();
      scheduleSave();
    });

    const toggleAnamneseEditBtn = document.getElementById('toggleAnamneseEditBtn');
    const anamneseInviteEditor = document.getElementById('anamneseInviteEditor');
    const anamneseInviteSource = document.getElementById('anamneseInviteSource');
    const resetAnamneseInviteBtn = document.getElementById('resetAnamneseInviteBtn');

    toggleAnamneseEditBtn?.addEventListener('click', () => {
      if (!anamneseInviteEditor) return;
      const isOpening = anamneseInviteEditor.hidden;
      anamneseInviteEditor.hidden = !isOpening;
      toggleAnamneseEditBtn.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
      toggleAnamneseEditBtn.textContent = isOpening ? 'Ocultar mensagem' : 'Editar mensagem';
      if (isOpening) {
        anamneseInviteSource?.focus();
      }
    });

    anamneseInviteSource?.addEventListener('input', () => {
      state.anamneseCustomEdited = true;
      state.anamneseInviteText = anamneseInviteSource.value;
      if (resetAnamneseInviteBtn) resetAnamneseInviteBtn.hidden = false;
      scheduleSave();
    });

    resetAnamneseInviteBtn?.addEventListener('click', () => {
      state.anamneseCustomEdited = false;
      state.anamneseInviteText = '';
      updateAnamneseInviteMessage();
      scheduleSave();
    });

    // Restauração inline em 2 cliques (sem modal)
    resetTemplateBtn?.addEventListener('click', () => {
      resetTemplateBtn.hidden = true;
      resetConfirmGroup.hidden = false;
      confirmResetBtn.focus();
      clearTimeout(resetConfirmTimer);
      resetConfirmTimer = setTimeout(cancelResetConfirm, 6000);
    });

    cancelResetBtn?.addEventListener('click', cancelResetConfirm);

    confirmResetBtn?.addEventListener('click', () => {
      const defaults = createDefaultState();
      const active = state.activeModel;
      state[active] = defaults[active];
      state.whatsappCustomEdited = false;
      cancelResetConfirm();
      syncFormValuesFromState();
      renderDocument();
      updateWhatsappMessage();
      scheduleSave();
      announceStudio('Exemplo padrão restaurado para o modelo atual.');
    });
  }

  function cancelResetConfirm() {
    clearTimeout(resetConfirmTimer);
    resetConfirmGroup.hidden = true;
    resetTemplateBtn.hidden = false;
  }

  // =========================================================================
  // Mensagem para WhatsApp
  // =========================================================================

  function buildSuggestedWhatsappMessage() {
    const activeData = state[state.activeModel] || {};
    const firstName = String(activeData.clientName || '').trim().split(/\s+/)[0];
    const greeting = firstName ? `Olá, ${firstName}! Tudo bem?` : 'Olá! Tudo bem?';

    if (state.activeModel === 'plano') {
      const hasProds = state.plano.includeProducts && state.plano.products.some((p) => p.name.trim());
      const hasProcs = state.plano.includeProcedures && state.plano.procedures.some((p) => p.name.trim());
      if (hasProcs && hasProds) {
        return `${greeting} Preparei com muito carinho o seu Plano de Tratamento & Home Care aqui da Adri Sant’Anna Beauty. Segue o PDF com os procedimentos indicados e a rotina de produtos recomendada — lembrando que todos os itens estão disponíveis aqui na clínica quando quiser reservar. Qualquer dúvida, é só me chamar por aqui!`;
      }
      if (hasProds) {
        return `${greeting} Preparei sua indicação personalizada de produtos Home Care aqui da Adri Sant’Anna Beauty. Todos os dermocosméticos do PDF estão disponíveis aqui na clínica. Qualquer dúvida sobre o uso, estou à disposição!`;
      }
      return `${greeting} Preparei o seu Plano de Tratamentos da Adri Sant’Anna Beauty em PDF com as sessões indicadas para o cuidado da sua pele. Qualquer dúvida ou para agendar seu próximo horário, é só responder por aqui!`;
    }

    if (state.activeModel === 'pos') {
      const guideName = String(state.pos.title || 'Cuidados Pós-Procedimento').trim();
      return `${greeting} Segue o nosso guia oficial de ${guideName} da Adri Sant’Anna Beauty para te acompanhar nos próximos dias. Leia com atenção e, se surgir qualquer dúvida durante a recuperação da sua pele, me chama por aqui!`;
    }

    if (state.activeModel === 'rotina') {
      return `${greeting} Montei a sua Rotina Personalizada Home Care (Manhã & Noite) da Adri Sant’Anna Beauty. Segue o PDF bem organizadinho para facilitar o seu dia a dia — e se precisar repor algum produto da clínica, é só me avisar por aqui!`;
    }

    const docTitle = String(state.livre.title || 'orientações').trim();
    return `${greeting} Segue o material em PDF (${docTitle}) da Adri Sant’Anna Beauty com todas as orientações combinadas. Qualquer dúvida, estou à disposição!`;
  }

  function buildAnamneseInviteMessage() {
    const activeData = state[state.activeModel] || {};
    const firstName = String(activeData.clientName || '').trim().split(/\s+/)[0];
    const greeting = firstName ? `Olá, ${firstName}! Tudo bem?` : 'Olá! Tudo bem?';
    return `${greeting} Para preparar o seu atendimento com ainda mais cuidado na Adri Sant’Anna Beauty, preencha rapidinho esta ficha antes da sua visita (leva cerca de 2 minutos): https://adri-santanna-beauty.vercel.app/anamnese`;
  }

  function updateAnamneseInviteMessage() {
    const inviteSource = document.getElementById('anamneseInviteSource');
    const resetBtn = document.getElementById('resetAnamneseInviteBtn');
    if (!inviteSource) return;
    if (state.anamneseCustomEdited && state.anamneseInviteText.trim()) {
      inviteSource.value = state.anamneseInviteText;
      if (resetBtn) resetBtn.hidden = false;
      return;
    }
    const suggested = buildAnamneseInviteMessage();
    state.anamneseInviteText = suggested;
    inviteSource.value = suggested;
    if (resetBtn) resetBtn.hidden = true;
  }

  function updateWhatsappMessage() {
    updateAnamneseInviteMessage();
    if (!whatsappTextarea) return;
    if (state.whatsappCustomEdited && state.whatsappText.trim()) {
      whatsappTextarea.value = state.whatsappText;
      regenerateWhatsappBtn.hidden = false;
      return;
    }
    const suggested = buildSuggestedWhatsappMessage();
    state.whatsappText = suggested;
    whatsappTextarea.value = suggested;
    regenerateWhatsappBtn.hidden = true;
  }

  // =========================================================================
  // Botão Copiar (Modern Web Guidance: copy-button + Invoker Commands)
  // =========================================================================

  const copyTimers = new WeakMap();
  let lastCopiedAnnouncement = '';

  function legacyCopy(text) {
    const field = Object.assign(document.createElement('textarea'), { value: text });
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0;';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } finally {
      field.remove();
    }
  }

  function reportCopyOutcome(button, ok) {
    const tip = button.nextElementSibling;
    if (!tip) return;
    clearTimeout(copyTimers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    let message = ok ? 'Mensagem copiada!' : 'Não foi possível copiar';
    if (message === lastCopiedAnnouncement) message += '\u00A0';
    lastCopiedAnnouncement = message;

    tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    requestAnimationFrame(() => {
      tip.textContent = message;
    });

    copyTimers.set(
      button,
      setTimeout(() => {
        button.removeAttribute('data-copied');
        button.removeAttribute('data-failed');
        tip.textContent = '';
      }, 2200)
    );
  }

  async function executeCopy(button, target) {
    if (!button || !target) return;
    const text = target.matches('input, textarea') ? target.value.trim() : target.innerText.trim();
    if (!text) {
      reportCopyOutcome(button, false);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      reportCopyOutcome(button, true);
    } catch {
      const ok = legacyCopy(text);
      reportCopyOutcome(button, ok);
    }
  }

  document.addEventListener(
    'command',
    (event) => {
      if (event.command === '--copy') {
        executeCopy(event.source, event.target);
      }
    },
    true
  );

  if (!('CommandEvent' in window)) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button[command="--copy"]');
      if (!button) return;
      const target = document.getElementById(button.getAttribute('commandfor'));
      if (target) executeCopy(button, target);
    });
  }

  // =========================================================================
  // Construção do HTML da Folha A4 (Compartilhado entre Prévia e Exportação)
  // =========================================================================

  function buildWordmarkHtml(light) {
    const lightClass = light ? ' brand-wordmark--light' : '';
    return `
      <div class="brand-wordmark doc-wordmark${lightClass}">
        <span class="wordmark-main">
          <span class="wordmark-first">Adri</span>
          <span class="wordmark-last">Sant<span class="wordmark-apostrophe">’</span>Anna</span>
        </span>
        <span class="wordmark-sub">
          <span class="wordmark-rule"></span>
          <span class="wordmark-beauty">Beauty</span>
          <span class="wordmark-ornament">${SVG_ICONS.star}</span>
          <span class="wordmark-rule"></span>
        </span>
      </div>
    `;
  }

  function buildLetterheadHtml(theme, compact = false) {
    const light = theme === 'editorial';
    const compactClass = compact ? ' doc-letterhead--compact' : '';
    return `
      <header class="doc-letterhead${compactClass}">
        ${buildWordmarkHtml(light)}
      </header>
    `;
  }

  function buildMetaStripHtml(clientName, date, goal) {
    const parts = [];
    if (clientName && clientName.trim()) {
      parts.push(`<div class="doc-meta-item"><span class="doc-meta-label">Cliente:</span><span>${escapeHtml(clientName.trim())}</span></div>`);
    }
    if (date && date.trim()) {
      parts.push(`<div class="doc-meta-item"><span class="doc-meta-label">Data:</span><span>${escapeHtml(date.trim())}</span></div>`);
    }
    if (goal && goal.trim()) {
      parts.push(`<div class="doc-meta-item doc-meta-item--full"><span class="doc-meta-label">Objetivo:</span><span>${escapeHtml(goal.trim())}</span></div>`);
    }
    if (!parts.length) return '';
    return `<div class="doc-meta-strip">${parts.join('')}</div>`;
  }

  function buildFooterHtml(pageNumber = 1, totalPages = 1) {
    const pageLabel =
      totalPages > 1 ? `<p class="doc-page-tag">Página ${pageNumber} de ${totalPages}</p>` : '';
    return `
      <footer class="doc-footer">
        <div class="doc-signature">
          <div class="doc-signature-line"></div>
          <div class="doc-signature-name">${escapeHtml(CLINIC.signature)}</div>
          <div class="doc-signature-role">${escapeHtml(CLINIC.role)}</div>
        </div>
        <div class="doc-contact-bar">
          <div class="doc-address-group">
            ${SVG_ICONS.monogram}
            <div>
              <div><strong>${escapeHtml(CLINIC.addressLine1)}</strong></div>
              <div>${escapeHtml(CLINIC.addressLine2)}</div>
            </div>
          </div>
          <div class="doc-channels">
            <a class="doc-channel-link" href="${CLINIC.whatsappUrl}">${SVG_ICONS.whatsapp}<span>${escapeHtml(CLINIC.whatsappDisplay)}</span></a>
            <a class="doc-channel-link" href="${CLINIC.instagramUrl}">${SVG_ICONS.instagram}<span>${escapeHtml(CLINIC.instagramHandle)}</span></a>
          </div>
        </div>
        ${pageLabel}
      </footer>
    `;
  }

  function buildTextBlocksHtml(blocks, numberingStyle) {
    const valid = (blocks || []).filter((b) => b.heading.trim() || b.content.trim());
    if (!valid.length) {
      return '<div class="doc-empty-hint">Adicione ou edite os blocos no painel ao lado para montar seu material.</div>';
    }

    return `
      <div class="doc-section">
        <div class="doc-numbered-list">
          ${valid
            .map((block, index) => {
              let numHtml = '';
              if (numberingStyle === 'roman') {
                numHtml = `<div class="doc-item-num">${toRoman(index + 1)}</div>`;
              } else if (numberingStyle === 'numeric') {
                numHtml = `<div class="doc-item-num">${index + 1}.</div>`;
              }

              let bodyHtml = '';
              if (block.style === 'bullets') {
                const lines = block.content
                  .split('\n')
                  .map((l) => l.trim())
                  .filter(Boolean);
                if (lines.length) {
                  bodyHtml = `<ul class="doc-bullets">${lines.map((line) => `<li>${formatBulletLine(line)}</li>`).join('')}</ul>`;
                }
              } else if (block.content.trim()) {
                const paragraphs = block.content
                  .split(/\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean);
                bodyHtml = `<div class="doc-prose">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
              }

              return `
                <div class="doc-numbered-item">
                  ${numHtml}
                  <div class="doc-item-content">
                    ${block.heading.trim() ? `<h3 class="doc-item-heading">${escapeHtml(block.heading.trim())}</h3>` : ''}
                    ${bodyHtml}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function buildDocumentSectionsHtml() {
    if (state.activeModel === 'plano') {
      const p = state.plano;
      const chunks = [];
      chunks.push(`
        <div class="doc-title-block">
          <h2 class="doc-title">${escapeHtml(p.title.trim() || 'Plano de Tratamento & Home Care')}</h2>
          ${p.subtitle.trim() ? `<p class="doc-subtitle">${escapeHtml(p.subtitle.trim())}</p>` : ''}
        </div>
      `);

      const metaHtml = buildMetaStripHtml(p.clientName, p.date, p.goal);
      if (metaHtml) chunks.push(metaHtml);

      if (p.includeProcedures) {
        const procs = p.procedures.filter((item) => item.name.trim() || item.frequency.trim() || item.notes.trim());
        chunks.push(`
          <section class="doc-section">
            <h3 class="doc-section-title">
              <span>Indicação de Procedimentos em Clínica</span>
              <span class="doc-section-count">${procs.length} ${procs.length === 1 ? 'protocolo' : 'protocolos'}</span>
            </h3>
            ${
              procs.length
                ? `<div class="doc-entries">${procs
                    .map(
                      (item) => `
                    <div class="doc-entry">
                      <div class="doc-entry-row">
                        <span class="doc-entry-name">${escapeHtml(item.name.trim() || 'Procedimento indicado')}</span>
                        ${item.frequency.trim() ? `<span class="doc-entry-badge">${escapeHtml(item.frequency.trim())}</span>` : ''}
                      </div>
                      ${item.notes.trim() ? `<p class="doc-entry-desc">${formatWithLineBreaks(item.notes.trim())}</p>` : ''}
                    </div>
                  `
                    )
                    .join('')}</div>`
                : '<div class="doc-empty-hint">Adicione os procedimentos indicados no painel ao lado.</div>'
            }
          </section>
        `);
      }

      if (p.includeProducts) {
        const prods = p.products.filter((item) => item.name.trim() || item.notes.trim());
        chunks.push(`
          <section class="doc-section">
            <h3 class="doc-section-title">
              <span>Cuidados &amp; Produtos Recomendados (Home Care)</span>
              <span class="doc-section-count">${prods.length} ${prods.length === 1 ? 'item' : 'itens'}</span>
            </h3>
            ${
              prods.length
                ? `<div class="doc-entries">${prods
                    .map(
                      (item) => `
                    <div class="doc-entry">
                      <div class="doc-entry-row">
                        <span class="doc-entry-name">${escapeHtml(item.name.trim() || 'Produto recomendado')}</span>
                        ${item.period.trim() ? `<span class="doc-entry-badge doc-entry-badge--rose">${escapeHtml(item.period.trim())}</span>` : ''}
                      </div>
                      ${item.notes.trim() ? `<p class="doc-entry-desc">${formatWithLineBreaks(item.notes.trim())}</p>` : ''}
                    </div>
                  `
                    )
                    .join('')}</div>`
                : '<div class="doc-empty-hint">Adicione os produtos da rotina no painel ao lado.</div>'
            }
            ${
              p.clinicProductsNote
                ? `<div class="doc-callout doc-callout--rose">${SVG_ICONS.bag}<div><strong>Disponível na clínica:</strong> Todos os dermocosméticos indicados acima são selecionados para a sua pele e podem ser adquiridos diretamente com a Adri no consultório.</div></div>`
                : ''
            }
          </section>
        `);
      }

      if (p.notes.trim()) {
        chunks.push(`
          <div class="doc-notes-box">
            <span class="doc-notes-label">Observações da Especialista</span>
            <div>${formatWithLineBreaks(p.notes.trim())}</div>
          </div>
        `);
      }

      return chunks.join('');
    }

    if (state.activeModel === 'pos') {
      const pos = state.pos;
      const chunks = [];
      chunks.push(`
        <div class="doc-title-block">
          <h2 class="doc-title">${escapeHtml(pos.title.trim() || 'Orientações Pós-Procedimento')}</h2>
          ${pos.subtitle.trim() ? `<p class="doc-subtitle">${escapeHtml(pos.subtitle.trim())}</p>` : ''}
        </div>
      `);
      const metaHtml = buildMetaStripHtml(pos.clientName, pos.date, '');
      if (metaHtml) chunks.push(metaHtml);
      chunks.push(buildTextBlocksHtml(pos.blocks, pos.numberingStyle));
      if (pos.attention.trim()) {
        chunks.push(`
          <div class="doc-callout doc-callout--green">
            ${SVG_ICONS.alert}
            <div><strong>Atenção:</strong> ${formatWithLineBreaks(pos.attention.trim())}</div>
          </div>
        `);
      }
      return chunks.join('');
    }

    if (state.activeModel === 'rotina') {
      const r = state.rotina;
      const chunks = [];
      chunks.push(`
        <div class="doc-title-block">
          <h2 class="doc-title">${escapeHtml(r.title.trim() || 'Rotina Personalizada Home Care')}</h2>
          ${r.subtitle.trim() ? `<p class="doc-subtitle">${escapeHtml(r.subtitle.trim())}</p>` : ''}
        </div>
      `);
      const metaHtml = buildMetaStripHtml(r.clientName, r.date, r.goal);
      if (metaHtml) chunks.push(metaHtml);

      const morning = r.morning.filter((i) => i.product.trim() || i.usage.trim());
      if (morning.length) {
        chunks.push(`
          <section class="doc-section">
            <h3 class="doc-section-title">
              <span>Rotina da Manhã</span>
              <span class="doc-section-count">${morning.length} ${morning.length === 1 ? 'passo' : 'passos'}</span>
            </h3>
            <div class="doc-numbered-list">
              ${morning
                .map(
                  (item, idx) => `
                <div class="doc-numbered-item">
                  <div class="doc-item-num">${String(idx + 1).padStart(2, '0')}</div>
                  <div class="doc-item-content">
                    ${item.product.trim() ? `<h4 class="doc-item-heading">${escapeHtml(item.product.trim())}</h4>` : ''}
                    ${item.usage.trim() ? `<p class="doc-item-text">${formatWithLineBreaks(item.usage.trim())}</p>` : ''}
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </section>
        `);
      }

      const night = r.night.filter((i) => i.product.trim() || i.usage.trim());
      if (night.length) {
        chunks.push(`
          <section class="doc-section">
            <h3 class="doc-section-title">
              <span>Rotina da Noite</span>
              <span class="doc-section-count">${night.length} ${night.length === 1 ? 'passo' : 'passos'}</span>
            </h3>
            <div class="doc-numbered-list">
              ${night
                .map(
                  (item, idx) => `
                <div class="doc-numbered-item">
                  <div class="doc-item-num">${String(idx + 1).padStart(2, '0')}</div>
                  <div class="doc-item-content">
                    ${item.product.trim() ? `<h4 class="doc-item-heading">${escapeHtml(item.product.trim())}</h4>` : ''}
                    ${item.usage.trim() ? `<p class="doc-item-text">${formatWithLineBreaks(item.usage.trim())}</p>` : ''}
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </section>
        `);
      }

      if (r.clinicProductsNote) {
        chunks.push(`
          <div class="doc-callout doc-callout--rose">
            ${SVG_ICONS.bag}
            <div><strong>Produtos disponíveis na clínica:</strong> Todos os itens da sua rotina podem ser adquiridos ou repostos diretamente com a Adri no consultório.</div>
          </div>
        `);
      }

      if (r.notes.trim()) {
        chunks.push(`
          <div class="doc-notes-box">
            <span class="doc-notes-label">Observações da Especialista</span>
            <div>${formatWithLineBreaks(r.notes.trim())}</div>
          </div>
        `);
      }

      return chunks.join('');
    }

    // Modelo Livre
    const lv = state.livre;
    const chunks = [];
    chunks.push(`
      <div class="doc-title-block">
        <h2 class="doc-title">${escapeHtml(lv.title.trim() || 'Orientações da Clínica')}</h2>
        ${lv.subtitle.trim() ? `<p class="doc-subtitle">${escapeHtml(lv.subtitle.trim())}</p>` : ''}
      </div>
    `);
    const metaHtml = buildMetaStripHtml(lv.clientName, lv.date, '');
    if (metaHtml) chunks.push(metaHtml);
    chunks.push(buildTextBlocksHtml(lv.blocks, 'none'));
    if (lv.closing && lv.closing.trim()) {
      chunks.push(`<p class="doc-closing-line">${escapeHtml(lv.closing.trim())}</p>`);
    }
    if (lv.callout.trim()) {
      chunks.push(`
        <div class="doc-callout doc-callout--green">
          ${SVG_ICONS.alert}
          <div>${formatWithLineBreaks(lv.callout.trim())}</div>
        </div>
      `);
    }
    return chunks.join('');
  }

  function buildWatermarkHtml(theme) {
    return theme === 'clean' ? SVG_ICONS.watermark : '';
  }

  function createPageShell(theme, compactHeader, reservePageTag = false) {
    const page = document.createElement('article');
    page.className = 'a4-sheet';
    page.setAttribute('data-theme', theme);
    page.setAttribute('aria-label', 'Folha A4 do documento');
    page.style.width = `${A4_WIDTH_PX}px`;
    page.style.height = `${A4_HEIGHT_PX}px`;
    page.style.minHeight = `${A4_HEIGHT_PX}px`;
    page.innerHTML = `
      ${buildWatermarkHtml(theme)}
      ${buildLetterheadHtml(theme, compactHeader)}
      <div class="doc-body"></div>
      ${buildFooterHtml(1, reservePageTag ? 2 : 1)}
    `;
    return page;
  }

  function makeNumberedSlice(secTitle, listClass, itemNumHtml, headingHtml, innerEl, { isLastOfSection, isLastOfItem }) {
    const slice = document.createElement('section');
    slice.className = 'doc-section';
    slice.style.marginBottom = isLastOfSection ? '14px' : '6px';
    if (secTitle) slice.append(secTitle.cloneNode(true));

    const wrap = document.createElement('div');
    wrap.className = listClass;

    const item = document.createElement('div');
    item.className = 'doc-numbered-item';
    if (!isLastOfItem) {
      item.style.paddingBottom = '0';
      item.style.borderBottom = '0';
    }
    if (itemNumHtml) {
      const numDiv = document.createElement('div');
      numDiv.className = 'doc-item-num';
      numDiv.innerHTML = itemNumHtml;
      item.append(numDiv);
    }

    const content = document.createElement('div');
    content.className = 'doc-item-content';
    if (headingHtml) {
      content.insertAdjacentHTML('beforeend', headingHtml);
    }
    content.append(innerEl);
    item.append(content);
    wrap.append(item);
    slice.append(wrap);
    return slice;
  }

  function splitIntoAtomicUnits(sourceBody) {
    const units = [];

    Array.from(sourceBody.children).forEach((child) => {
      if (!child.classList.contains('doc-section')) {
        units.push(child.cloneNode(true));
        return;
      }

      const secTitle = child.querySelector('.doc-section-title');
      const entriesWrap = child.querySelector('.doc-entries');
      const numberedWrap = child.querySelector('.doc-numbered-list');

      if (entriesWrap) {
        const items = Array.from(entriesWrap.children);
        items.forEach((entryEl, idx) => {
          const slice = document.createElement('section');
          slice.className = 'doc-section';
          slice.style.marginBottom = idx === items.length - 1 ? '14px' : '6px';
          if (idx === 0 && secTitle) slice.append(secTitle.cloneNode(true));
          const wrap = document.createElement('div');
          wrap.className = 'doc-entries';
          wrap.append(entryEl.cloneNode(true));
          slice.append(wrap);
          units.push(slice);
        });
        const extraCallout = child.querySelector('.doc-callout');
        if (extraCallout) units.push(extraCallout.cloneNode(true));
        return;
      }

      if (numberedWrap) {
        const items = Array.from(numberedWrap.children);
        let sectionTitlePending = secTitle;

        items.forEach((itemEl, itemIdx) => {
          const numEl = itemEl.querySelector('.doc-item-num');
          const headingEl = itemEl.querySelector('.doc-item-heading');
          const proseEl = itemEl.querySelector('.doc-prose');
          const bulletsEl = itemEl.querySelector('.doc-bullets');
          const isLastItemInList = itemIdx === items.length - 1;

          if (proseEl) {
            const paragraphs = Array.from(proseEl.querySelectorAll('p'));
            if (paragraphs.length > 0) {
              paragraphs.forEach((pEl, pIdx) => {
                const isFirstP = pIdx === 0;
                const isLastP = pIdx === paragraphs.length - 1;
                const proseBox = document.createElement('div');
                proseBox.className = 'doc-prose';
                proseBox.append(pEl.cloneNode(true));

                const numContent = numEl ? (isFirstP ? numEl.innerHTML : '&nbsp;') : '';
                const headContent = isFirstP && headingEl ? headingEl.outerHTML : '';
                const slice = makeNumberedSlice(
                  sectionTitlePending,
                  'doc-numbered-list',
                  numContent,
                  headContent,
                  proseBox,
                  {
                    isLastOfSection: isLastItemInList && isLastP,
                    isLastOfItem: isLastP && !isLastItemInList,
                  }
                );
                sectionTitlePending = null;
                units.push(slice);
              });
              return;
            }
          }

          if (bulletsEl) {
            const lis = Array.from(bulletsEl.querySelectorAll('li'));
            if (lis.length > 0) {
              lis.forEach((liEl, liIdx) => {
                const isFirstLi = liIdx === 0;
                const isLastLi = liIdx === lis.length - 1;
                const ulBox = document.createElement('ul');
                ulBox.className = 'doc-bullets';
                ulBox.append(liEl.cloneNode(true));

                const numContent = numEl ? (isFirstLi ? numEl.innerHTML : '&nbsp;') : '';
                const headContent = isFirstLi && headingEl ? headingEl.outerHTML : '';
                const slice = makeNumberedSlice(
                  sectionTitlePending,
                  'doc-numbered-list',
                  numContent,
                  headContent,
                  ulBox,
                  {
                    isLastOfSection: isLastItemInList && isLastLi,
                    isLastOfItem: isLastLi && !isLastItemInList,
                  }
                );
                sectionTitlePending = null;
                units.push(slice);
              });
              return;
            }
          }

          const slice = document.createElement('section');
          slice.className = 'doc-section';
          slice.style.marginBottom = isLastItemInList ? '14px' : '6px';
          if (sectionTitlePending) {
            slice.append(sectionTitlePending.cloneNode(true));
            sectionTitlePending = null;
          }
          const wrap = document.createElement('div');
          wrap.className = 'doc-numbered-list';
          const itemClone = itemEl.cloneNode(true);
          if (isLastItemInList) {
            itemClone.style.paddingBottom = '0';
            itemClone.style.borderBottom = '0';
          }
          wrap.append(itemClone);
          slice.append(wrap);
          units.push(slice);
        });
        return;
      }

      units.push(child.cloneNode(true));
    });

    return units;
  }

  function splitOversizedParagraphUnit(unit, currentPage, currentBody) {
    const pEl = unit.querySelector('.doc-prose p');
    if (!pEl) return null;
    const words = pEl.textContent.trim().split(/\s+/);
    if (words.length < 2) return null;

    let low = 1;
    let high = words.length - 1;
    let bestFit = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      pEl.textContent = words.slice(0, mid).join(' ');
      if (currentPage.scrollHeight <= A4_HEIGHT_PX) {
        bestFit = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (bestFit <= 0) {
      pEl.textContent = words.join(' ');
      return null;
    }

    pEl.textContent = words.slice(0, bestFit).join(' ');
    const remainderUnit = unit.cloneNode(true);
    const remTitle = remainderUnit.querySelector('.doc-section-title');
    if (remTitle) remTitle.remove();
    const remHead = remainderUnit.querySelector('.doc-item-heading');
    if (remHead) remHead.remove();
    const remNum = remainderUnit.querySelector('.doc-item-num');
    if (remNum) remNum.innerHTML = '&nbsp;';
    const remP = remainderUnit.querySelector('.doc-prose p');
    if (remP) remP.textContent = words.slice(bestFit).join(' ');
    return remainderUnit;
  }

  function buildPaginatedSheetElements(theme) {
    const sandbox = document.createElement('div');
    sandbox.style.cssText = 'position:fixed;left:-12000px;top:0;width:794px;pointer-events:none;z-index:-1;';
    document.body.append(sandbox);

    const measureSheet = createPageShell(theme, false, false);
    measureSheet.style.height = 'auto';
    measureSheet.querySelector('.doc-body').innerHTML = buildDocumentSectionsHtml();
    sandbox.append(measureSheet);

    // 1. Verifica se cabe confortavelmente em 1 única página A4
    if (measureSheet.scrollHeight <= A4_HEIGHT_PX) {
      measureSheet.style.height = `${A4_HEIGHT_PX}px`;
      return { sandbox, pages: [measureSheet] };
    }

    // 2. Paginação automática em múltiplas folhas A4 (já reservando espaço do rodapé "Página X de Y")
    const atomicUnits = splitIntoAtomicUnits(measureSheet.querySelector('.doc-body'));
    const pages = [];
    let currentPage = createPageShell(theme, false, true);
    sandbox.append(currentPage);
    let currentBody = currentPage.querySelector('.doc-body');

    let i = 0;
    while (i < atomicUnits.length) {
      const unit = atomicUnits[i];
      currentBody.append(unit);

      if (currentPage.scrollHeight > A4_HEIGHT_PX) {
        if (currentBody.children.length > 1) {
          unit.remove();
          pages.push(currentPage);

          currentPage = createPageShell(theme, true, true);
          sandbox.append(currentPage);
          currentBody = currentPage.querySelector('.doc-body');
          continue;
        }

        // Caso um único parágrafo gigante sem Enter exceda a folha inteira sozinho
        const remainder = splitOversizedParagraphUnit(unit, currentPage, currentBody);
        if (remainder) {
          pages.push(currentPage);
          currentPage = createPageShell(theme, true, true);
          sandbox.append(currentPage);
          currentBody = currentPage.querySelector('.doc-body');
          atomicUnits.splice(i + 1, 0, remainder);
        }
      }
      i += 1;
    }

    pages.push(currentPage);

    const total = pages.length;
    pages.forEach((pageEl, idx) => {
      const footer = pageEl.querySelector('.doc-footer');
      if (footer) {
        footer.outerHTML = buildFooterHtml(idx + 1, total);
      }
    });

    measureSheet.remove();
    return { sandbox, pages };
  }

  function renderDocument() {
    if (!a4PagesList) return;

    const { sandbox, pages } = buildPaginatedSheetElements(state.theme);
    a4PagesList.innerHTML = '';

    pages.forEach((sheet, idx) => {
      const slot = document.createElement('div');
      slot.className = 'a4-page-slot';

      if (pages.length > 1) {
        const label = document.createElement('span');
        label.className = 'a4-page-label';
        label.textContent = `Página ${idx + 1} de ${pages.length}`;
        slot.append(label);
      }

      const scaleBox = document.createElement('div');
      scaleBox.className = 'a4-scale-box';
      scaleBox.append(sheet);
      slot.append(scaleBox);
      a4PagesList.append(slot);
    });

    sandbox.remove();

    if (pageEstimateBadge) {
      pageEstimateBadge.textContent =
        pages.length === 1
          ? 'Prévia real do PDF • 1 página'
          : `Prévia real do PDF • ${pages.length} páginas`;
    }
    if (previewHintText) {
      previewHintText.textContent =
        pages.length === 1
          ? 'O PDF baixado sai idêntico à folha abaixo.'
          : 'Divisão automática entre folhas: o PDF baixado sai igual.';
    }

    if (!state.whatsappCustomEdited) {
      updateWhatsappMessage();
    }

    requestAnimationFrame(updatePreviewScale);
  }

  function updatePreviewScale() {
    if (!a4Stage || !a4PagesList || studioApp.hidden) return;
    const available = a4Stage.clientWidth;
    if (!available) return;
    const scale = Math.min(1, available / A4_WIDTH_PX);

    a4PagesList.querySelectorAll('.a4-scale-box').forEach((scaleBox) => {
      const sheet = scaleBox.querySelector('.a4-sheet');
      if (!sheet) return;
      sheet.style.transform = scale < 1 ? `scale(${scale})` : 'none';
      scaleBox.style.width = `${Math.round(A4_WIDTH_PX * scale)}px`;
      scaleBox.style.height = `${Math.round(A4_HEIGHT_PX * scale)}px`;
    });
  }

  if (typeof ResizeObserver === 'function' && a4Stage) {
    const ro = new ResizeObserver(() => {
      updatePreviewScale();
    });
    ro.observe(a4Stage);
  }

  // =========================================================================
  // Exportação Dual de PDF: Baixar / Enviar (Canvas -> jsPDF) + Impressão
  // =========================================================================

  function loadExternalScript(src, globalCheck) {
    if (globalCheck()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Falha ao carregar ${src}`)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
      document.head.append(script);
    });
  }

  function ensurePdfLibraries() {
    if (!pdfLibrariesPromise) {
      pdfLibrariesPromise = Promise.all([
        loadExternalScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', () => typeof window.html2canvas === 'function'),
        loadExternalScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js', () => Boolean(window.jspdf?.jsPDF)),
      ]).catch((err) => {
        pdfLibrariesPromise = null;
        throw err;
      });
    }
    return pdfLibrariesPromise;
  }

  function setExportButtonLoading(loading) {
    isExporting = loading;
    [exportPdfBtn, mobileExportPdfBtn].forEach((btn) => {
      if (!btn) return;
      btn.disabled = loading;
      const label = btn.querySelector('.btn-label');
      if (!label) return;
      if (!btn.dataset.defaultLabel) btn.dataset.defaultLabel = label.textContent;
      label.textContent = loading ? 'Gerando PDF...' : btn.dataset.defaultLabel;
    });
  }

  async function exportDirectPdf() {
    if (isExporting) return;
    setExportButtonLoading(true);
    announceStudio('Gerando PDF A4, aguarde um instante.');

    let sandboxRef = null;
    try {
      await ensurePdfLibraries();
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const { sandbox, pages } = buildPaginatedSheetElements(state.theme);
      sandboxRef = sandbox;

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pages.length; i += 1) {
        pages[i].style.boxShadow = 'none';
        pages[i].style.transform = 'none';
        const canvas = await window.html2canvas(pages[i], {
          scale: 2.2,
          useCORS: true,
          backgroundColor: state.theme === 'clean' ? '#FFFFFF' : '#FBF7F7',
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          windowWidth: A4_WIDTH_PX,
          logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.94);
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const filename = buildPdfFilename();
      const blob = pdf.output('blob');
      const file = new File([blob], filename, { type: 'application/pdf' });
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

      if (isTouchDevice && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: filename.replace(/\.pdf$/i, ''),
            text: whatsappTextarea?.value?.trim() || '',
          });
          announceStudio('PDF pronto para compartilhar.');
          return;
        } catch (shareErr) {
          if (shareErr?.name === 'AbortError') {
            announceStudio('Compartilhamento cancelado.');
            return;
          }
          // Continua para download direto se Web Share falhar
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      announceStudio(`PDF ${filename} gerado e baixado.`);
    } catch {
      announceStudio('Abrindo diálogo de impressão do navegador como alternativa.');
      exportPrintPdf();
    } finally {
      if (sandboxRef) sandboxRef.remove();
      setExportButtonLoading(false);
    }
  }

  function exportPrintPdf() {
    const previousTitle = document.title;
    const filenameTitle = buildPdfFilename().replace(/\.pdf$/i, '');
    document.title = filenameTitle;

    const restore = () => {
      document.title = previousTitle;
    };
    window.addEventListener('afterprint', restore, { once: true });
    window.print();
    setTimeout(restore, 1500);
  }

  exportPdfBtn?.addEventListener('click', exportDirectPdf);
  mobileExportPdfBtn?.addEventListener('click', exportDirectPdf);
  printPdfBtn?.addEventListener('click', exportPrintPdf);

  // =========================================================================
  // Inicialização Geral
  // =========================================================================

  function renderAll() {
    syncThemeUI();
    syncActiveModelUI();
    syncFormValuesFromState();
    renderDocument();
    updateWhatsappMessage();
  }

  setupFormBindings();

  if (isSessionUnlocked()) {
    unlockStudio({ persist: false, focusEditor: false });
  } else {
    pinGate.hidden = false;
    studioApp.hidden = true;
  }
})();
