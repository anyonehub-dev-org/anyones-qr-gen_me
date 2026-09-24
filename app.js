/**
 * anyone's QR gen & Digital Business Card Profile Builder
 * Domain: anyone's-QR_gen.me
 * 100% Client-Side, Zero-Database, Serverless Developer Utilities.
 */

import QRCodeStyling from 'qr-code-styling';

// ============================================================================
// State Management: QR Code Engine
// ============================================================================
const DEFAULT_PAYLOAD = "https://your-website-url.com";
const DEFAULT_BRAND = "YOUR COMPANY NAME";

const qrState = {
  data: DEFAULT_PAYLOAD,
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  dotsColor: '#00F2FE',
  bgColor: '#08090E',
  ecc: 'H',
  logoSrc: '',
  logoName: '',
  logoSize: 0.28,
  logoMargin: 4,

  // Brand / Company Identifier
  brandText: DEFAULT_BRAND,
  brandPosition: 'top', // 'top' | 'bottom' | 'none'
  brandFont: "'JetBrains Mono', monospace",
  brandColor: '#00F2FE',
  brandSize: 15,
  brandSpacing: 2.5
};

let qrCodeInstance = null;

// ============================================================================
// State Management: Digital Business Card Profile Builder (Pristine Sandbox)
// ============================================================================
const profileState = {
  fullName: '',
  jobTitle: '',
  company: '',
  location: '',
  bio: '',
  email: '',
  phone: '',

  // Brand Identity
  avatarDataUrl: '',
  avatarFileName: '',

  // Theme Styling
  bgColor: '#090B10',
  bgGradient: 'radial', // 'radial' | 'mesh' | 'emerald' | 'rose' | 'aurora'
  accentColor: '#00F2FE',

  // Dynamic Flex-Box Links (Array of { id, title, url, icon })
  links: [],

  // Document Integration
  pdfDataUrl: '',
  pdfFileName: '',
  pdfFileSize: ''
};

// ============================================================================
// Rich SVG Icon Repository for Profile Links
// ============================================================================
const LINK_ICONS = {
  website: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>`,
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  youtube: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>`,
  tiktok: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`,
  email: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>`,
  discord: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/><path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .5-1.5.5-4 .5-6 0-3-2-4.5-2.5-5-.5 0-1.5.5-2 .5"/><path d="M8.5 17c0 1-1.5 3-2 3-1.5 0-2.833-1.667-3.5-3-.5-1.5-.5-4-.5-6 0-3 2-4.5 2.5-5 .5 0 1.5.5 2 .5"/></svg>`,
  telegram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  portfolio: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  custom: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

// ============================================================================
// Cached DOM Elements
// ============================================================================
const elements = {
  // Navigation Tabs & Engine Panels
  tabNavQr: document.getElementById('tab-nav-qr'),
  tabNavProfile: document.getElementById('tab-nav-profile'),
  panelQrEngine: document.getElementById('panel-qr-engine'),
  panelProfileBuilder: document.getElementById('panel-profile-builder'),
  stageQrView: document.getElementById('stage-qr-view'),
  stageProfileView: document.getElementById('stage-profile-view'),

  // --- QR Code Engine Elements ---
  qrDataInput: document.getElementById('qr-data-input'),
  btnClearPayload: document.getElementById('btn-clear-payload'),
  charCount: document.getElementById('char-count'),
  eccSelect: document.getElementById('ecc-select'),

  colorDotsPicker: document.getElementById('color-dots-picker'),
  colorDotsHex: document.getElementById('color-dots-hex'),
  colorBgPicker: document.getElementById('color-bg-picker'),
  colorBgHex: document.getElementById('color-bg-hex'),
  contrastStatus: document.getElementById('contrast-status'),
  presetSwatches: document.querySelectorAll('.preset-swatch'),

  geometryOptionCards: document.querySelectorAll('.geometry-option-card'),
  cornerSquareButtons: document.querySelectorAll('[data-corner-square]'),
  cornerDotButtons: document.querySelectorAll('[data-corner-dot]'),

  brandNameInput: document.getElementById('brand-name-input'),
  btnClearBrand: document.getElementById('btn-clear-brand'),
  brandPlacementStatus: document.getElementById('brand-placement-status'),
  placementButtons: document.querySelectorAll('.placement-button'),
  brandFontSelect: document.getElementById('brand-font-select'),
  brandColorPicker: document.getElementById('brand-color-picker'),
  brandColorHex: document.getElementById('brand-color-hex'),
  btnSyncBrandColor: document.getElementById('btn-sync-brand-color'),
  brandSizeSlider: document.getElementById('brand-size-slider'),
  brandSizeVal: document.getElementById('brand-size-val'),
  brandSpacingSlider: document.getElementById('brand-spacing-slider'),
  brandSpacingVal: document.getElementById('brand-spacing-val'),

  logoDropzone: document.getElementById('logo-dropzone'),
  logoFileInput: document.getElementById('logo-file-input'),
  logoActivePreview: document.getElementById('logo-active-preview'),
  logoThumbnailImg: document.getElementById('logo-thumbnail-img'),
  logoFileName: document.getElementById('logo-file-name'),
  logoFileSize: document.getElementById('logo-file-size'),
  btnRemoveLogo: document.getElementById('btn-remove-logo'),
  logoTuningRow: document.getElementById('logo-tuning-row'),
  logoSizeSlider: document.getElementById('logo-size-slider'),
  logoSizeVal: document.getElementById('logo-size-val'),
  logoMarginSlider: document.getElementById('logo-margin-slider'),
  logoMarginVal: document.getElementById('logo-margin-val'),
  btnUseCustomLogo: document.getElementById('btn-use-custom-logo'),

  btnDownloadPng: document.getElementById('btn-download-png'),
  btnDownloadSvg: document.getElementById('btn-download-svg'),
  btnCopyClipboard: document.getElementById('btn-copy-clipboard'),
  protocolChips: document.querySelectorAll('.protocol-chip'),
  qrCanvasWrapper: document.getElementById('qr-canvas-wrapper'),

  // --- Profile Builder Elements ---
  profFullName: document.getElementById('prof-fullname'),
  btnClearFullName: document.getElementById('btn-clear-fullname'),
  profJobTitle: document.getElementById('prof-jobtitle'),
  profCompany: document.getElementById('prof-company'),
  profLocation: document.getElementById('prof-location'),
  profBio: document.getElementById('prof-bio'),
  profEmail: document.getElementById('prof-email'),
  profPhone: document.getElementById('prof-phone'),

  profAvatarDropzone: document.getElementById('prof-avatar-dropzone'),
  profAvatarInput: document.getElementById('prof-avatar-input'),
  profAvatarActive: document.getElementById('prof-avatar-active'),
  profAvatarThumbnail: document.getElementById('prof-avatar-thumbnail'),
  profAvatarFilename: document.getElementById('prof-avatar-filename'),
  profAvatarFilesize: document.getElementById('prof-avatar-filesize'),
  btnRemoveAvatar: document.getElementById('btn-remove-avatar'),

  profBgColor: document.getElementById('prof-bg-color'),
  profBgHex: document.getElementById('prof-bg-hex'),
  profAccentColor: document.getElementById('prof-accent-color'),
  profAccentHex: document.getElementById('prof-accent-hex'),
  themePresetChips: document.querySelectorAll('.theme-preset-chip'),

  btnAddLinkBox: document.getElementById('btn-add-link-box'),
  profileLinksList: document.getElementById('profile-links-list'),
  linksEmptyNotice: document.getElementById('links-empty-notice'),
  linksCountBadge: document.getElementById('links-count-badge'),

  profPdfDropzone: document.getElementById('prof-pdf-dropzone'),
  profPdfInput: document.getElementById('prof-pdf-input'),
  profPdfActive: document.getElementById('prof-pdf-active'),
  profPdfFilename: document.getElementById('prof-pdf-filename'),
  profPdfFilesize: document.getElementById('prof-pdf-filesize'),
  btnRemovePdf: document.getElementById('btn-remove-pdf'),

  btnExportProfileHtml: document.getElementById('btn-export-profile-html'),
  btnExportVcard: document.getElementById('btn-export-vcard'),
  btnProfileToQr: document.getElementById('btn-profile-to-qr'),

  // --- Mobile Preview Mockup Elements ---
  mobileScreenViewport: document.getElementById('mobile-screen-viewport'),
  previewAmbientGlow: document.getElementById('preview-ambient-glow'),
  previewAvatarFrame: document.getElementById('preview-avatar-frame'),
  previewAvatarImg: document.getElementById('preview-avatar-img'),
  previewAvatarPlaceholder: document.getElementById('preview-avatar-placeholder'),
  previewName: document.getElementById('preview-name'),
  previewHeadline: document.getElementById('preview-headline'),
  previewLocationRow: document.getElementById('preview-location-row'),
  previewLocationText: document.getElementById('preview-location-text'),
  previewBioText: document.getElementById('preview-bio-text'),
  previewBtnContact: document.getElementById('preview-btn-contact'),
  previewBtnVcf: document.getElementById('preview-btn-vcf'),
  previewLinksStack: document.getElementById('preview-links-stack'),
  previewSkeletonCard: document.getElementById('preview-skeleton-card'),
  previewDocCard: document.getElementById('preview-doc-card'),
  previewDocTitle: document.getElementById('preview-doc-title'),
  previewDocMeta: document.getElementById('preview-doc-meta'),
  previewDocDownload: document.getElementById('preview-doc-download'),

  // Feedback Toast
  toastNotification: document.getElementById('toast-notification'),
  toastMessage: document.getElementById('toast-message')
};

// ============================================================================
// Notification Toast
// ============================================================================
let toastTimeout = null;
function showToast(message, isError = false) {
  if (!elements.toastNotification) return;

  if (toastTimeout) clearTimeout(toastTimeout);
  elements.toastMessage.textContent = message;
  elements.toastNotification.style.borderColor = isError ? '#ef4444' : 'var(--accent-teal)';
  elements.toastNotification.classList.add('show');

  toastTimeout = setTimeout(() => {
    elements.toastNotification.classList.remove('show');
  }, 3200);
}

// ============================================================================
// Global Navigation Splitter (QR Engine vs Profile Builder)
// ============================================================================
function setAppMode(mode) {
  if (mode === 'qr') {
    elements.tabNavQr.classList.add('active');
    elements.tabNavQr.setAttribute('aria-selected', 'true');
    elements.tabNavProfile.classList.remove('active');
    elements.tabNavProfile.setAttribute('aria-selected', 'false');

    elements.panelQrEngine.style.display = 'flex';
    elements.panelProfileBuilder.style.display = 'none';

    elements.stageQrView.style.display = 'flex';
    elements.stageProfileView.style.display = 'none';
  } else {
    elements.tabNavProfile.classList.add('active');
    elements.tabNavProfile.setAttribute('aria-selected', 'true');
    elements.tabNavQr.classList.remove('active');
    elements.tabNavQr.setAttribute('aria-selected', 'false');

    elements.panelProfileBuilder.style.display = 'flex';
    elements.panelQrEngine.style.display = 'none';

    elements.stageProfileView.style.display = 'flex';
    elements.stageQrView.style.display = 'none';

    renderProfilePreview();
  }
}

// ============================================================================
// QR CODE ENGINE: Configuration & Rendering (Preserved 100%)
// ============================================================================
function normalizeHex(hex) {
  let clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  return clean.length === 6 ? '#' + clean.toUpperCase() : null;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function updateContrastIndicator() {
  if (!elements.contrastStatus) return;
  const ratio = getContrastRatio(qrState.dotsColor, qrState.bgColor);
  const label = elements.contrastStatus.querySelector('.contrast-label');

  if (ratio >= 4.5) {
    elements.contrastStatus.className = 'contrast-badge pass';
    label.textContent = `Contrast: ${ratio.toFixed(1)}:1 (Pass)`;
  } else if (ratio >= 3.0) {
    elements.contrastStatus.className = 'contrast-badge warn';
    label.textContent = `Contrast: ${ratio.toFixed(1)}:1 (Fair)`;
  } else {
    elements.contrastStatus.className = 'contrast-badge fail';
    label.textContent = `Contrast: ${ratio.toFixed(1)}:1 (Low Scan)`;
  }
}

function getEngineConfig() {
  const dataPayload = qrState.data.trim().length > 0 ? qrState.data : " ";
  return {
    width: 400,
    height: 400,
    type: 'svg',
    data: dataPayload,
    image: qrState.logoSrc || undefined,
    dotsOptions: {
      color: qrState.dotsColor,
      type: qrState.dotStyle
    },
    backgroundOptions: {
      color: qrState.bgColor
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: qrState.logoMargin,
      imageSize: qrState.logoSize,
      hideBackgroundDots: true
    },
    cornersSquareOptions: {
      color: qrState.dotsColor,
      type: qrState.cornerSquareStyle
    },
    cornersDotOptions: {
      color: qrState.dotsColor,
      type: qrState.cornerDotStyle
    },
    qrOptions: {
      errorCorrectionLevel: qrState.ecc
    }
  };
}

function renderQR() {
  if (!qrCodeInstance) return;
  const config = getEngineConfig();
  qrCodeInstance.update(config);

  if (elements.qrCanvasWrapper) {
    elements.qrCanvasWrapper.style.backgroundColor = qrState.bgColor;
  }
  updateContrastIndicator();
}

function initQRCodeEngine() {
  const QRConstructor = (typeof QRCodeStyling !== 'undefined')
    ? QRCodeStyling
    : (typeof window !== 'undefined' ? window.QRCodeStyling : null);

  if (!QRConstructor) {
    setTimeout(initQRCodeEngine, 50);
    return;
  }

  const initialConfig = getEngineConfig();
  qrCodeInstance = new QRConstructor(initialConfig);

  elements.qrCanvasWrapper.innerHTML = '';
  qrCodeInstance.append(elements.qrCanvasWrapper);
  elements.qrCanvasWrapper.style.backgroundColor = qrState.bgColor;
  updateContrastIndicator();
}

function processLogoFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (SVG, PNG, JPG, WebP)', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    qrState.logoSrc = e.target.result;
    qrState.logoName = file.name;

    elements.logoThumbnailImg.src = qrState.logoSrc;
    elements.logoFileName.textContent = file.name;
    elements.logoFileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';

    elements.logoDropzone.style.display = 'none';
    elements.logoActivePreview.classList.add('active');
    elements.logoTuningRow.classList.add('active');

    renderQR();
    showToast('Center Logo Integrated!');
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  qrState.logoSrc = '';
  qrState.logoName = '';

  elements.logoFileInput.value = '';
  elements.logoThumbnailImg.src = '';
  elements.logoActivePreview.classList.remove('active');
  elements.logoTuningRow.classList.remove('active');
  elements.logoDropzone.style.display = 'flex';

  renderQR();
  showToast('Logo removed');
}

function createCompositeCanvas() {
  return new Promise((resolve, reject) => {
    const svgEl = elements.qrCanvasWrapper.querySelector('svg');
    if (!svgEl) return reject(new Error('No SVG element rendered in DOM'));

    const xml = new XMLSerializer().serializeToString(svgEl);
    const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const qrDim = 1000;
      const scale = qrDim / 400;
      const hasLabel = qrState.brandPosition !== 'none' && qrState.brandText.trim().length > 0;

      const bannerHeight = hasLabel ? Math.round(qrState.brandSize * scale * 1.8 + 48) : 0;
      const totalWidth = qrDim;
      const totalHeight = qrDim + bannerHeight;

      const canvas = document.createElement('canvas');
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = qrState.bgColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      const qrY = (hasLabel && qrState.brandPosition === 'top') ? bannerHeight : 0;
      ctx.drawImage(img, 0, qrY, qrDim, qrDim);

      if (hasLabel) {
        const textY = (qrState.brandPosition === 'top') ? (bannerHeight / 2) : (qrDim + bannerHeight / 2);
        const fontSize = Math.round(qrState.brandSize * scale);

        ctx.font = `700 ${fontSize}px ${qrState.brandFont}`;
        ctx.fillStyle = qrState.brandColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if ('letterSpacing' in ctx) {
          ctx.letterSpacing = `${qrState.brandSpacing * scale}px`;
        }

        ctx.fillText(qrState.brandText, totalWidth / 2, textY);
      }

      resolve(canvas);
    };

    img.onerror = (err) => reject(err);
    img.src = svgDataUrl;
  });
}

function downloadCompositePng() {
  if (!qrCodeInstance) return;
  showToast('Rendering high-density PNG...');

  const hasLabel = qrState.brandPosition !== 'none' && qrState.brandText.trim().length > 0;
  if (!hasLabel) {
    qrCodeInstance.download({ name: 'anyones-qr-gen', extension: 'png' });
    showToast('Downloaded High-Res PNG');
    return;
  }

  createCompositeCanvas()
    .then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Blob conversion failed');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anyones-qr-gen.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded High-Res PNG with Brand Label!');
      }, 'image/png');
    })
    .catch(() => {
      qrCodeInstance.download({ name: 'anyones-qr-gen', extension: 'png' });
    });
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function downloadCompositeSvg() {
  if (!qrCodeInstance) return;

  const hasLabel = qrState.brandPosition !== 'none' && qrState.brandText.trim().length > 0;
  if (!hasLabel) {
    qrCodeInstance.download({ name: 'anyones-qr-gen', extension: 'svg' });
    showToast('Downloaded Vector SVG');
    return;
  }

  try {
    const svgEl = elements.qrCanvasWrapper.querySelector('svg');
    if (!svgEl) throw new Error('No SVG element rendered');

    const qrWidth = 400;
    const qrHeight = 400;
    const bannerHeight = Math.round(qrState.brandSize * 1.8 + 24);
    const totalHeight = qrHeight + bannerHeight;

    const qrOffsetY = qrState.brandPosition === 'top' ? bannerHeight : 0;
    const textY = qrState.brandPosition === 'top' ? (bannerHeight / 2 + 5) : (qrHeight + bannerHeight / 2 + 5);

    const innerContent = svgEl.innerHTML;

    const compositeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrWidth}" height="${totalHeight}" viewBox="0 0 ${qrWidth} ${totalHeight}">
      <rect width="100%" height="100%" fill="${qrState.bgColor}" />
      <text x="50%" y="${textY}" text-anchor="middle" fill="${qrState.brandColor}" font-family="${qrState.brandFont.replace(/"/g, '&quot;')}" font-size="${qrState.brandSize}px" font-weight="700" letter-spacing="${qrState.brandSpacing}px">${escapeXml(qrState.brandText)}</text>
      <g transform="translate(0, ${qrOffsetY})">
        ${innerContent}
      </g>
    </svg>`;

    const blob = new Blob([compositeSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anyones-qr-gen.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded Vector SVG with Brand Label!');
  } catch (err) {
    qrCodeInstance.download({ name: 'anyones-qr-gen', extension: 'svg' });
  }
}

async function copyCompositeImage() {
  if (!qrCodeInstance) return;
  showToast('Preparing image for clipboard...');

  try {
    const canvas = await createCompositeCanvas();
    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error('Blob creation failed');
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Copied High-Res QR to clipboard!');
      } catch (clipErr) {
        downloadCompositePng();
      }
    }, 'image/png');
  } catch (err) {
    downloadCompositePng();
  }
}

// ============================================================================
// PROFILE BUILDER: Reactive Mechanics, Link Management & Live Preview
// ============================================================================

// 1. Dynamic Flex-Box List Builder
function addLinkBox(initialTitle = '', initialUrl = '', initialIcon = 'website') {
  const newLink = {
    id: Date.now() + Math.random(),
    title: initialTitle,
    url: initialUrl,
    icon: initialIcon
  };
  profileState.links.push(newLink);
  renderLinkInputs();
  renderProfilePreview();
}

function removeLinkBox(id) {
  profileState.links = profileState.links.filter(link => link.id !== id);
  renderLinkInputs();
  renderProfilePreview();
}

function updateLinkBox(id, field, value) {
  const link = profileState.links.find(l => l.id === id);
  if (link) {
    link[field] = value;
    renderProfilePreview();
  }
}

function renderLinkInputs() {
  elements.profileLinksList.innerHTML = '';
  const count = profileState.links.length;
  elements.linksCountBadge.textContent = `${count} Link${count === 1 ? '' : 's'} Active`;

  if (count === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'links-empty-notice';
    emptyNotice.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/></svg>
      <p>No custom links added yet.<br />Click <strong>"+ Add Custom Link Box"</strong> above to add unlimited social, portfolio, or schedule links.</p>
    `;
    elements.profileLinksList.appendChild(emptyNotice);
    return;
  }

  profileState.links.forEach((link, idx) => {
    const itemCard = document.createElement('div');
    itemCard.className = 'profile-link-item';
    itemCard.dataset.id = link.id;

    itemCard.innerHTML = `
      <div class="link-item-header">
        <span class="link-item-index">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          Link #${idx + 1}
        </span>
        <button type="button" class="btn-delete-link" title="Delete this link card" aria-label="Delete link">✕</button>
      </div>

      <div class="link-item-fields">
        <select class="link-icon-dropdown" aria-label="Link Icon Type">
          <option value="website" ${link.icon === 'website' ? 'selected' : ''}>🌐 Website</option>
          <option value="linkedin" ${link.icon === 'linkedin' ? 'selected' : ''}>💼 LinkedIn</option>
          <option value="github" ${link.icon === 'github' ? 'selected' : ''}>💻 GitHub</option>
          <option value="twitter" ${link.icon === 'twitter' ? 'selected' : ''}>✖️ X (Twitter)</option>
          <option value="instagram" ${link.icon === 'instagram' ? 'selected' : ''}>📸 Instagram</option>
          <option value="youtube" ${link.icon === 'youtube' ? 'selected' : ''}>🎬 YouTube</option>
          <option value="tiktok" ${link.icon === 'tiktok' ? 'selected' : ''}>🎵 TikTok</option>
          <option value="email" ${link.icon === 'email' ? 'selected' : ''}>✉️ Email</option>
          <option value="phone" ${link.icon === 'phone' ? 'selected' : ''}>📞 Phone</option>
          <option value="whatsapp" ${link.icon === 'whatsapp' ? 'selected' : ''}>💬 WhatsApp</option>
          <option value="discord" ${link.icon === 'discord' ? 'selected' : ''}>🎮 Discord</option>
          <option value="telegram" ${link.icon === 'telegram' ? 'selected' : ''}>✈️ Telegram</option>
          <option value="portfolio" ${link.icon === 'portfolio' ? 'selected' : ''}>🎨 Portfolio</option>
          <option value="custom" ${link.icon === 'custom' ? 'selected' : ''}>🔗 Custom</option>
        </select>
        <input type="text" class="text-input-field single-line link-title-input" placeholder="Link Box Title (e.g. Portfolio)" value="${escapeXml(link.title)}" />
      </div>

      <input type="url" class="text-input-field single-line link-url-input" placeholder="Destination URL (https://...)" value="${escapeXml(link.url)}" spellcheck="false" />
    `;

    // Bind item events
    const deleteBtn = itemCard.querySelector('.btn-delete-link');
    const iconSelect = itemCard.querySelector('.link-icon-dropdown');
    const titleInput = itemCard.querySelector('.link-title-input');
    const urlInput = itemCard.querySelector('.link-url-input');

    deleteBtn.addEventListener('click', () => removeLinkBox(link.id));
    iconSelect.addEventListener('change', (e) => updateLinkBox(link.id, 'icon', e.target.value));
    titleInput.addEventListener('input', (e) => updateLinkBox(link.id, 'title', e.target.value));
    urlInput.addEventListener('input', (e) => updateLinkBox(link.id, 'url', e.target.value));

    elements.profileLinksList.appendChild(itemCard);
  });
}

// 2. Real-Time Mobile Preview Painter
function renderProfilePreview() {
  if (!elements.mobileScreenViewport) return;

  // Sync Dynamic Theme Atmosphere
  elements.mobileScreenViewport.style.backgroundColor = profileState.bgColor;
  elements.mobileScreenViewport.style.setProperty('--accent-teal', profileState.accentColor);
  elements.mobileScreenViewport.style.setProperty('--accent-teal-glow', `${profileState.accentColor}33`);

  if (elements.previewAmbientGlow) {
    elements.previewAmbientGlow.style.background = `radial-gradient(circle, ${profileState.accentColor}26 0%, transparent 70%)`;
  }

  // 1. Avatar Frame
  if (profileState.avatarDataUrl) {
    elements.previewAvatarImg.src = profileState.avatarDataUrl;
    elements.previewAvatarImg.style.display = 'block';
    elements.previewAvatarPlaceholder.style.display = 'none';
    elements.previewAvatarFrame.style.borderColor = profileState.accentColor;
    elements.previewAvatarFrame.style.boxShadow = `0 0 20px ${profileState.accentColor}44, inset 0 0 10px rgba(0,0,0,0.6)`;
  } else {
    elements.previewAvatarImg.src = '';
    elements.previewAvatarImg.style.display = 'none';
    elements.previewAvatarPlaceholder.style.display = 'flex';
    elements.previewAvatarFrame.style.borderColor = profileState.accentColor;
    elements.previewAvatarFrame.style.boxShadow = `0 0 16px ${profileState.accentColor}22`;
  }

  // 2. Name & Title Typography
  if (profileState.fullName.trim().length > 0) {
    elements.previewName.textContent = profileState.fullName;
    elements.previewName.classList.remove('is-placeholder');
  } else {
    elements.previewName.textContent = 'Your Full Name';
    elements.previewName.classList.add('is-placeholder');
  }

  const hasJob = profileState.jobTitle.trim().length > 0;
  const hasComp = profileState.company.trim().length > 0;
  if (hasJob || hasComp) {
    const parts = [];
    if (hasJob) parts.push(profileState.jobTitle);
    if (hasComp) parts.push(profileState.company);
    elements.previewHeadline.textContent = parts.join(' • ');
    elements.previewHeadline.classList.remove('is-placeholder');
  } else {
    elements.previewHeadline.textContent = 'Company / Job Title';
    elements.previewHeadline.classList.add('is-placeholder');
  }

  if (profileState.location.trim().length > 0) {
    elements.previewLocationText.textContent = profileState.location;
    elements.previewLocationRow.classList.remove('is-placeholder');
  } else {
    elements.previewLocationText.textContent = 'Location Baseline';
    elements.previewLocationRow.classList.add('is-placeholder');
  }

  if (profileState.bio.trim().length > 0) {
    elements.previewBioText.textContent = profileState.bio;
    elements.previewBioText.classList.remove('is-placeholder');
  } else {
    elements.previewBioText.textContent = 'Your brief bio or tagline will be dynamically showcased here...';
    elements.previewBioText.classList.add('is-placeholder');
  }

  // 3. Action Buttons Accent Styling
  elements.previewBtnContact.style.background = profileState.accentColor;
  elements.previewBtnContact.style.boxShadow = `0 4px 14px ${profileState.accentColor}44`;

  // 4. Custom Link Box Stack
  elements.previewLinksStack.innerHTML = '';
  if (profileState.links.length === 0) {
    const skeleton = document.createElement('div');
    skeleton.className = 'preview-link-skeleton';
    skeleton.innerHTML = `
      <div class="skeleton-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
      </div>
      <div class="skeleton-content">
        <span class="skeleton-title">Sample Interactive Link</span>
        <span class="skeleton-url">Add your custom links in the left console</span>
      </div>
      <svg class="skeleton-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    `;
    elements.previewLinksStack.appendChild(skeleton);
  } else {
    profileState.links.forEach(link => {
      const linkCard = document.createElement('a');
      linkCard.className = 'preview-link-card';
      linkCard.href = link.url ? link.url : '#';
      linkCard.target = '_blank';
      linkCard.rel = 'noopener noreferrer';
      linkCard.title = link.title || 'Interactive Link';

      const iconSvg = LINK_ICONS[link.icon] || LINK_ICONS.website;
      const displayTitle = link.title.trim().length > 0 ? link.title : 'Untitled Link Box';
      const displayUrl = link.url.trim().length > 0 ? link.url.replace(/^https?:\/\//i, '') : 'Configure destination URL';

      linkCard.innerHTML = `
        <div class="preview-link-icon-box" style="color: ${profileState.accentColor};">
          ${iconSvg}
        </div>
        <div class="preview-link-text">
          <span class="preview-link-title">${escapeXml(displayTitle)}</span>
          <span class="preview-link-url">${escapeXml(displayUrl)}</span>
        </div>
        <svg class="preview-link-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      `;

      elements.previewLinksStack.appendChild(linkCard);
    });
  }

  // 5. Document Display Card
  if (profileState.pdfDataUrl) {
    elements.previewDocCard.style.display = 'flex';
    elements.previewDocTitle.textContent = profileState.pdfFileName || 'Presentation_Resume.pdf';
    elements.previewDocMeta.textContent = profileState.pdfFileSize || 'Ready for Download';
    elements.previewDocDownload.href = profileState.pdfDataUrl;
    elements.previewDocDownload.download = profileState.pdfFileName || 'Document.pdf';
  } else {
    elements.previewDocCard.style.display = 'none';
  }
}

// 3. Avatar Upload Handler
function processAvatarFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (PNG, JPG, WebP, SVG)', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    profileState.avatarDataUrl = e.target.result;
    profileState.avatarFileName = file.name;

    elements.profAvatarThumbnail.src = profileState.avatarDataUrl;
    elements.profAvatarFilename.textContent = file.name;
    elements.profAvatarFilesize.textContent = (file.size / 1024).toFixed(1) + ' KB (Memory Base64)';

    elements.profAvatarDropzone.style.display = 'none';
    elements.profAvatarActive.classList.add('active');

    renderProfilePreview();
    showToast('Profile Avatar Synchronized!');
  };
  reader.readAsDataURL(file);
}

function removeAvatar() {
  profileState.avatarDataUrl = '';
  profileState.avatarFileName = '';

  elements.profAvatarInput.value = '';
  elements.profAvatarThumbnail.src = '';
  elements.profAvatarActive.classList.remove('active');
  elements.profAvatarDropzone.style.display = 'flex';

  renderProfilePreview();
  showToast('Avatar removed');
}

// 4. PDF Upload Handler
function processPdfFile(file) {
  if (!file) return;
  if (file.type !== 'application/pdf') {
    showToast('Please select a valid .pdf file', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    profileState.pdfDataUrl = e.target.result;
    profileState.pdfFileName = file.name;
    profileState.pdfFileSize = (file.size / 1024).toFixed(1) + ' KB';

    elements.profPdfFilename.textContent = file.name;
    elements.profPdfFilesize.textContent = profileState.pdfFileSize + ' (Offline Embed)';

    elements.profPdfDropzone.style.display = 'none';
    elements.profPdfActive.classList.add('active');

    renderProfilePreview();
    showToast('PDF Document Integrated!');
  };
  reader.readAsDataURL(file);
}

function removePdf() {
  profileState.pdfDataUrl = '';
  profileState.pdfFileName = '';
  profileState.pdfFileSize = '';

  elements.profPdfInput.value = '';
  elements.profPdfActive.classList.remove('active');
  elements.profPdfDropzone.style.display = 'flex';

  renderProfilePreview();
  showToast('PDF Document removed');
}

// 5. Standard vCard (.vcf) Generator
function generateVCardString() {
  const name = profileState.fullName.trim() || 'Professional Contact';
  const title = profileState.jobTitle.trim();
  const org = profileState.company.trim();
  const email = profileState.email.trim();
  const phone = profileState.phone.trim();
  const loc = profileState.location.trim();
  const note = profileState.bio.trim();

  let vcard = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
  vcard += `FN:${name}\r\n`;
  if (title) vcard += `TITLE:${title}\r\n`;
  if (org) vcard += `ORG:${org}\r\n`;
  if (email) vcard += `EMAIL;TYPE=INTERNET:${email}\r\n`;
  if (phone) vcard += `TEL;TYPE=CELL:${phone}\r\n`;
  if (loc) vcard += `ADR;TYPE=WORK:;;${loc};;;;\r\n`;
  if (note) vcard += `NOTE:${note}\r\n`;
  vcard += 'URL:https://anyone\'s-QR_gen.me\r\n';
  vcard += 'END:VCARD\r\n';

  return vcard;
}

function downloadVCard() {
  const vcardStr = generateVCardString();
  const blob = new Blob([vcardStr], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (profileState.fullName.trim() || 'contact').toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.href = url;
  a.download = `${safeName}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded .vcf Contact File!');
}

// 6. Zero-Cost Serverless Export Blueprint: Standalone Single-File HTML
function downloadHostableHtml() {
  showToast('Compiling standalone hostable card...');

  const safeTitle = profileState.fullName.trim()
    ? `${profileState.fullName} — Digital Business Card`
    : "Digital Business Card Profile";

  const vcardBase64 = btoa(unescape(encodeURIComponent(generateVCardString())));

  // Generate Links HTML
  let linksHtml = '';
  if (profileState.links.length > 0) {
    profileState.links.forEach(l => {
      const icon = LINK_ICONS[l.icon] || LINK_ICONS.website;
      const title = l.title.trim() || 'Interactive Link';
      const cleanUrl = l.url.trim() || '#';
      const displayUrl = l.url.replace(/^https?:\/\//i, '');

      linksHtml += `
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="link-card">
        <div class="link-icon-box">${icon}</div>
        <div class="link-content">
          <span class="link-title">${escapeXml(title)}</span>
          <span class="link-url">${escapeXml(displayUrl)}</span>
        </div>
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </a>`;
    });
  } else {
    linksHtml = `
      <div class="empty-state">
        <p>No external links configured.</p>
      </div>`;
  }

  // Generate PDF Section HTML
  let pdfSectionHtml = '';
  if (profileState.pdfDataUrl) {
    pdfSectionHtml = `
    <div class="pdf-card">
      <div class="pdf-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="pdf-info">
        <span class="pdf-name">${escapeXml(profileState.pdfFileName || 'Document.pdf')}</span>
        <span class="pdf-size">Embedded Document (${escapeXml(profileState.pdfFileSize)})</span>
      </div>
      <a href="${profileState.pdfDataUrl}" download="${escapeXml(profileState.pdfFileName || 'Document.pdf')}" class="pdf-btn">Download</a>
    </div>`;
  }

  // Avatar HTML
  const avatarHtml = profileState.avatarDataUrl
    ? `<img src="${profileState.avatarDataUrl}" alt="${escapeXml(profileState.fullName)}" class="avatar-img" />`
    : `<div class="avatar-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;

  // Headline
  const headlineParts = [];
  if (profileState.jobTitle.trim()) headlineParts.push(profileState.jobTitle);
  if (profileState.company.trim()) headlineParts.push(profileState.company);
  const headlineStr = headlineParts.join(' • ');

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(safeTitle)}</title>
  <meta name="description" content="Digital business card for ${escapeXml(profileState.fullName || 'Professional Profile')}.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: ${profileState.bgColor};
      --accent: ${profileState.accentColor};
      --accent-glow: ${profileState.accentColor}33;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-base);
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem 1rem;
      background-image: radial-gradient(circle at 50% 15%, var(--accent-glow) 0%, transparent 60%);
      background-attachment: fixed;
    }
    .card-container {
      width: 100%;
      max-width: 440px;
      background: rgba(14, 18, 28, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      padding: 2.25rem 1.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px var(--accent-glow);
    }
    .avatar-wrapper {
      width: 104px;
      height: 104px;
      border-radius: 50%;
      background: #111522;
      border: 3px solid var(--accent);
      box-shadow: 0 0 24px var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-placeholder { color: #94a3b8; }
    .bio-section { text-align: center; width: 100%; display: flex; flex-direction: column; gap: 0.35rem; }
    .name { font-family: 'Space Grotesk', sans-serif; font-size: 1.65rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
    .headline { font-size: 0.92rem; font-weight: 600; color: var(--accent); }
    .location { display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: #94a3b8; margin-top: 0.2rem; }
    .bio { font-size: 0.84rem; color: #cbd5e1; line-height: 1.5; margin-top: 0.5rem; }
    .action-row { display: flex; width: 100%; gap: 0.6rem; }
    .btn-contact { flex: 1; padding: 0.75rem 1rem; border-radius: 12px; background: var(--accent); color: #06080e; font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; box-shadow: 0 4px 16px var(--accent-glow); transition: transform 0.2s, box-shadow 0.2s; }
    .btn-contact:hover { transform: translateY(-2px); box-shadow: 0 6px 22px var(--accent-glow); }
    .btn-vcf { flex: 0 0 54px; padding: 0.75rem; border-radius: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 0.84rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .links-stack { width: 100%; display: flex; flex-direction: column; gap: 0.75rem; }
    .link-card { display: flex; align-items: center; gap: 0.9rem; padding: 0.85rem 1.15rem; border-radius: 16px; background: rgba(22, 28, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); color: #ffffff; text-decoration: none; transition: transform 0.2s, border-color 0.2s, background 0.2s; }
    .link-card:hover { transform: translateY(-2px); border-color: var(--accent); background: rgba(30, 38, 58, 0.9); box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 16px var(--accent-glow); }
    .link-icon-box { width: 38px; height: 38px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
    .link-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
    .link-title { font-size: 0.88rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .link-url { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chevron { color: #64748b; flex-shrink: 0; }
    .link-card:hover .chevron { color: var(--accent); transform: translateX(2px); }
    .pdf-card { width: 100%; display: flex; align-items: center; gap: 0.85rem; padding: 0.75rem 1rem; border-radius: 14px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); }
    .pdf-icon { color: #ef4444; }
    .pdf-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .pdf-name { font-size: 0.82rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pdf-size { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #ef4444; }
    .pdf-btn { background: #ef4444; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 6px; text-decoration: none; }
    .empty-state { padding: 1.5rem; text-align: center; color: #64748b; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
    .footer { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #64748b; margin-top: 0.5rem; text-align: center; }
  </style>
</head>
<body>
  <main class="card-container">
    <div class="avatar-wrapper">
      ${avatarHtml}
    </div>

    <div class="bio-section">
      <h1 class="name">${escapeXml(profileState.fullName || 'Digital Business Card')}</h1>
      ${headlineStr ? `<div class="headline">${escapeXml(headlineStr)}</div>` : ''}
      ${profileState.location.trim() ? `
      <div class="location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${escapeXml(profileState.location)}</span>
      </div>` : ''}
      ${profileState.bio.trim() ? `<p class="bio">${escapeXml(profileState.bio)}</p>` : ''}
    </div>

    <div class="action-row">
      <button type="button" class="btn-contact" onclick="saveVCard()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
        <span>Save Contact</span>
      </button>
      <button type="button" class="btn-vcf" onclick="saveVCard()" title="Download .vcf">.vcf</button>
    </div>

    <div class="links-stack">
      ${linksHtml}
    </div>

    ${pdfSectionHtml}

    <div class="footer">
      Generated with anyone's-QR_gen.me • Serverless
    </div>
  </main>

  <script>
    function saveVCard() {
      var vcardB64 = "${vcardBase64}";
      var decoded = decodeURIComponent(escape(atob(vcardB64)));
      var blob = new Blob([decoded], { type: 'text/vcard;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = "${(profileState.fullName.trim() || 'contact').toLowerCase().replace(/[^a-z0-9]/g, '_')}.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Downloaded Hostable Single-File index.html!');
}

// ============================================================================
// Event Listeners & Interactive Bindings (QR Engine & Profile Builder)
// ============================================================================
function attachEventListeners() {
  // 1. Global Navigation Splitter
  elements.tabNavQr.addEventListener('click', () => setAppMode('qr'));
  elements.tabNavProfile.addEventListener('click', () => setAppMode('profile'));

  // --- QR Code Engine Event Listeners ---
  let payloadAutoCleared = false;
  function autoClearPayload() {
    if (!payloadAutoCleared || elements.qrDataInput.value === DEFAULT_PAYLOAD) {
      if (elements.qrDataInput.value === DEFAULT_PAYLOAD) {
        elements.qrDataInput.value = '';
        qrState.data = '';
        renderQR();
      }
      payloadAutoCleared = true;
    }
  }

  elements.qrDataInput.addEventListener('focus', autoClearPayload);
  elements.qrDataInput.addEventListener('click', autoClearPayload);

  if (elements.btnClearPayload) {
    elements.btnClearPayload.addEventListener('click', () => {
      elements.qrDataInput.value = '';
      qrState.data = '';
      payloadAutoCleared = true;
      elements.qrDataInput.focus();
      renderQR();
    });
  }

  elements.qrDataInput.addEventListener('input', (e) => {
    qrState.data = e.target.value;
    payloadAutoCleared = true;
    renderQR();
  });

  elements.eccSelect.addEventListener('change', (e) => {
    qrState.ecc = e.target.value;
    renderQR();
  });

  elements.protocolChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prefix = chip.getAttribute('data-prefix');
      elements.qrDataInput.value = prefix;
      qrState.data = prefix;
      payloadAutoCleared = true;
      elements.qrDataInput.focus();
      renderQR();
    });
  });

  elements.colorDotsPicker.addEventListener('input', (e) => {
    qrState.dotsColor = e.target.value;
    elements.colorDotsHex.value = e.target.value.toUpperCase();
    renderQR();
  });

  elements.colorDotsHex.addEventListener('input', (e) => {
    const validHex = normalizeHex(e.target.value);
    if (validHex) {
      qrState.dotsColor = validHex;
      elements.colorDotsPicker.value = validHex;
      renderQR();
    }
  });

  elements.colorBgPicker.addEventListener('input', (e) => {
    qrState.bgColor = e.target.value;
    elements.colorBgHex.value = e.target.value.toUpperCase();
    renderQR();
  });

  elements.colorBgHex.addEventListener('input', (e) => {
    const validHex = normalizeHex(e.target.value);
    if (validHex) {
      qrState.bgColor = validHex;
      elements.colorBgPicker.value = validHex;
      renderQR();
    }
  });

  elements.presetSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      elements.presetSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const fg = swatch.getAttribute('data-fg');
      const bg = swatch.getAttribute('data-bg');

      qrState.dotsColor = fg;
      qrState.bgColor = bg;
      elements.colorDotsPicker.value = fg;
      elements.colorDotsHex.value = fg;
      elements.colorBgPicker.value = bg;
      elements.colorBgHex.value = bg;

      renderQR();
    });
  });

  elements.geometryOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      elements.geometryOptionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      qrState.dotStyle = card.getAttribute('data-style');
      renderQR();
    });
  });

  elements.cornerSquareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.cornerSquareButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qrState.cornerSquareStyle = btn.getAttribute('data-corner-square');
      renderQR();
    });
  });

  elements.cornerDotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.cornerDotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qrState.cornerDotStyle = btn.getAttribute('data-corner-dot');
      renderQR();
    });
  });

  let brandAutoCleared = false;
  function autoClearBrand() {
    if (!brandAutoCleared || elements.brandNameInput.value === DEFAULT_BRAND) {
      if (elements.brandNameInput.value === DEFAULT_BRAND) {
        elements.brandNameInput.value = '';
        qrState.brandText = '';
        renderQR();
      }
      brandAutoCleared = true;
    }
  }

  elements.brandNameInput.addEventListener('focus', autoClearBrand);
  elements.brandNameInput.addEventListener('click', autoClearBrand);

  if (elements.btnClearBrand) {
    elements.btnClearBrand.addEventListener('click', () => {
      elements.brandNameInput.value = '';
      qrState.brandText = '';
      brandAutoCleared = true;
      elements.brandNameInput.focus();
      renderQR();
    });
  }

  elements.brandNameInput.addEventListener('input', (e) => {
    qrState.brandText = e.target.value;
    brandAutoCleared = true;
    renderQR();
  });

  elements.placementButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.placementButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qrState.brandPosition = btn.getAttribute('data-position');
      elements.brandPlacementStatus.textContent = `Position: ${qrState.brandPosition.charAt(0).toUpperCase() + qrState.brandPosition.slice(1)}`;
      renderQR();
    });
  });

  elements.brandFontSelect.addEventListener('change', (e) => {
    qrState.brandFont = e.target.value;
    renderQR();
  });

  elements.brandColorPicker.addEventListener('input', (e) => {
    qrState.brandColor = e.target.value;
    elements.brandColorHex.value = e.target.value.toUpperCase();
    renderQR();
  });

  elements.brandColorHex.addEventListener('input', (e) => {
    const validHex = normalizeHex(e.target.value);
    if (validHex) {
      qrState.brandColor = validHex;
      elements.brandColorPicker.value = validHex;
      renderQR();
    }
  });

  elements.btnSyncBrandColor.addEventListener('click', () => {
    qrState.brandColor = qrState.dotsColor;
    elements.brandColorPicker.value = qrState.dotsColor;
    elements.brandColorHex.value = qrState.dotsColor;
    renderQR();
    showToast('Brand label color synced with QR dots');
  });

  elements.brandSizeSlider.addEventListener('input', (e) => {
    qrState.brandSize = parseInt(e.target.value, 10);
    elements.brandSizeVal.textContent = qrState.brandSize + 'px';
    renderQR();
  });

  elements.brandSpacingSlider.addEventListener('input', (e) => {
    qrState.brandSpacing = parseFloat(e.target.value);
    elements.brandSpacingVal.textContent = qrState.brandSpacing + 'px';
    renderQR();
  });

  if (elements.btnUseCustomLogo) {
    elements.btnUseCustomLogo.addEventListener('click', () => {
      qrState.logoSrc = '/custom-logo-icon.svg';
      qrState.logoName = 'anyones-qr-gen-icon.svg';
      elements.logoActivePreview.classList.add('active');
      elements.logoDropzone.style.display = 'none';
      elements.logoThumbnailImg.src = qrState.logoSrc;
      elements.logoFileName.textContent = qrState.logoName;
      elements.logoFileSize.textContent = 'Official Brand Badge';
      elements.logoTuningRow.classList.add('active');

      renderQR();
      showToast('Embedded official logo into QR code center!');
    });
  }

  elements.logoDropzone.addEventListener('click', () => elements.logoFileInput.click());
  elements.logoFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) processLogoFile(e.target.files[0]);
  });
  elements.btnRemoveLogo.addEventListener('click', removeLogo);

  elements.logoSizeSlider.addEventListener('input', (e) => {
    qrState.logoSize = parseFloat(e.target.value);
    elements.logoSizeVal.textContent = Math.round(qrState.logoSize * 100) + '%';
    renderQR();
  });

  elements.logoMarginSlider.addEventListener('input', (e) => {
    qrState.logoMargin = parseInt(e.target.value, 10);
    elements.logoMarginVal.textContent = qrState.logoMargin + 'px';
    renderQR();
  });

  elements.btnDownloadPng.addEventListener('click', downloadCompositePng);
  elements.btnDownloadSvg.addEventListener('click', downloadCompositeSvg);
  elements.btnCopyClipboard.addEventListener('click', copyCompositeImage);

  // --- Profile Builder Event Listeners ---
  elements.profFullName.addEventListener('input', (e) => {
    profileState.fullName = e.target.value;
    renderProfilePreview();
  });

  if (elements.btnClearFullName) {
    elements.btnClearFullName.addEventListener('click', () => {
      elements.profFullName.value = '';
      profileState.fullName = '';
      elements.profFullName.focus();
      renderProfilePreview();
    });
  }

  elements.profJobTitle.addEventListener('input', (e) => {
    profileState.jobTitle = e.target.value;
    renderProfilePreview();
  });

  elements.profCompany.addEventListener('input', (e) => {
    profileState.company = e.target.value;
    renderProfilePreview();
  });

  elements.profLocation.addEventListener('input', (e) => {
    profileState.location = e.target.value;
    renderProfilePreview();
  });

  elements.profBio.addEventListener('input', (e) => {
    profileState.bio = e.target.value;
    renderProfilePreview();
  });

  elements.profEmail.addEventListener('input', (e) => {
    profileState.email = e.target.value;
  });

  elements.profPhone.addEventListener('input', (e) => {
    profileState.phone = e.target.value;
  });

  // Avatar Upload Listeners
  elements.profAvatarDropzone.addEventListener('click', () => elements.profAvatarInput.click());
  elements.profAvatarInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) processAvatarFile(e.target.files[0]);
  });
  elements.btnRemoveAvatar.addEventListener('click', removeAvatar);

  elements.profAvatarDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.profAvatarDropzone.classList.add('drag-over');
  });
  elements.profAvatarDropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    elements.profAvatarDropzone.classList.remove('drag-over');
  });
  elements.profAvatarDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.profAvatarDropzone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  });

  // Theme Controls
  elements.profBgColor.addEventListener('input', (e) => {
    profileState.bgColor = e.target.value;
    elements.profBgHex.value = e.target.value.toUpperCase();
    renderProfilePreview();
  });

  elements.profBgHex.addEventListener('input', (e) => {
    const validHex = normalizeHex(e.target.value);
    if (validHex) {
      profileState.bgColor = validHex;
      elements.profBgColor.value = validHex;
      renderProfilePreview();
    }
  });

  elements.profAccentColor.addEventListener('input', (e) => {
    profileState.accentColor = e.target.value;
    elements.profAccentHex.value = e.target.value.toUpperCase();
    renderProfilePreview();
  });

  elements.profAccentHex.addEventListener('input', (e) => {
    const validHex = normalizeHex(e.target.value);
    if (validHex) {
      profileState.accentColor = validHex;
      elements.profAccentColor.value = validHex;
      renderProfilePreview();
    }
  });

  elements.themePresetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.themePresetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const bg = chip.getAttribute('data-bg');
      const accent = chip.getAttribute('data-accent');

      profileState.bgColor = bg;
      profileState.accentColor = accent;

      elements.profBgColor.value = bg;
      elements.profBgHex.value = bg;
      elements.profAccentColor.value = accent;
      elements.profAccentHex.value = accent;

      renderProfilePreview();
    });
  });

  // Dynamic Link Builder Add Button
  elements.btnAddLinkBox.addEventListener('click', () => {
    addLinkBox('', '', 'website');
    showToast('Added new custom link box!');
  });

  // PDF Dropzone Listeners
  elements.profPdfDropzone.addEventListener('click', () => elements.profPdfInput.click());
  elements.profPdfInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) processPdfFile(e.target.files[0]);
  });
  elements.btnRemovePdf.addEventListener('click', removePdf);

  elements.profPdfDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.profPdfDropzone.classList.add('drag-over');
  });
  elements.profPdfDropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    elements.profPdfDropzone.classList.remove('drag-over');
  });
  elements.profPdfDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.profPdfDropzone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  });

  // Action Triggers for Profile Builder
  elements.btnExportProfileHtml.addEventListener('click', downloadHostableHtml);
  elements.btnExportVcard.addEventListener('click', downloadVCard);
  elements.previewBtnContact.addEventListener('click', downloadVCard);
  elements.previewBtnVcf.addEventListener('click', downloadVCard);

  elements.btnProfileToQr.addEventListener('click', () => {
    const suggestedUrl = profileState.fullName.trim()
      ? `https://anyone's-QR_gen.me/${profileState.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : 'https://anyone\'s-QR_gen.me/my-card';

    elements.qrDataInput.value = suggestedUrl;
    qrState.data = suggestedUrl;

    if (profileState.fullName.trim()) {
      elements.brandNameInput.value = profileState.fullName.toUpperCase();
      qrState.brandText = profileState.fullName.toUpperCase();
    }

    setAppMode('qr');
    renderQR();
    showToast('Loaded profile card destination into QR engine!');
  });
}

// ============================================================================
// Application Boot
// ============================================================================
function startApp() {
  attachEventListeners();
  initQRCodeEngine();
  renderLinkInputs();
  renderProfilePreview();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
