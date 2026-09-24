/**
 * anyone's QR gen — 100% Client-Side Custom QR Code Generator
 * Domain: anyone's-QR_gen.me
 * High-performance, zero-latency reactive rendering engine.
 */

import QRCodeStyling from 'qr-code-styling';

// ============================================================================
// State Management
// ============================================================================
const DEFAULT_PAYLOAD = "https://your-website-url.com";
const DEFAULT_BRAND = "YOUR COMPANY NAME";

const state = {
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

  // Brand / Chosen Name Customization
  brandText: DEFAULT_BRAND,
  brandPosition: 'top', // 'top' | 'bottom' | 'none'
  brandFont: "'JetBrains Mono', monospace",
  brandColor: '#00F2FE',
  brandSize: 15,
  brandSpacing: 2.5
};

let qrCodeInstance = null;

// ============================================================================
// Cached DOM Elements
// ============================================================================
const elements = {
  // Inputs
  qrDataInput: document.getElementById('qr-data-input'),
  btnClearPayload: document.getElementById('btn-clear-payload'),
  charCount: document.getElementById('char-count'),
  eccSelect: document.getElementById('ecc-select'),

  // Color Matrix
  colorDotsPicker: document.getElementById('color-dots-picker'),
  colorDotsHex: document.getElementById('color-dots-hex'),
  colorBgPicker: document.getElementById('color-bg-picker'),
  colorBgHex: document.getElementById('color-bg-hex'),
  contrastStatus: document.getElementById('contrast-status'),
  presetSwatches: document.querySelectorAll('.preset-swatch'),

  // Geometry Options
  geometryOptionCards: document.querySelectorAll('.geometry-option-card'),
  cornerSquareButtons: document.querySelectorAll('[data-corner-square]'),
  cornerDotButtons: document.querySelectorAll('[data-corner-dot]'),

  // Brand / Company Identifier
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

  // Logo Upload
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

  // Primary Actions
  btnDownloadPng: document.getElementById('btn-download-png'),
  btnDownloadSvg: document.getElementById('btn-download-svg'),
  btnCopyClipboard: document.getElementById('btn-copy-clipboard'),
  protocolChips: document.querySelectorAll('.protocol-chip'),

  // Preview Stage & Composite Card
  qrCompositeCard: document.getElementById('qr-composite-card'),
  qrBrandLabelTop: document.getElementById('qr-brand-label-top'),
  qrBrandLabelBottom: document.getElementById('qr-brand-label-bottom'),
  qrCanvasWrapper: document.getElementById('qr-canvas-wrapper'),
  metaChars: document.getElementById('meta-chars'),
  metaRes: document.getElementById('meta-res'),
  metaBrandTag: document.getElementById('meta-brand-tag'),
  metaRedundancyBadge: document.getElementById('meta-redundancy-badge'),

  // Feedback Toast
  toastNotification: document.getElementById('toast-notification'),
  toastMessage: document.getElementById('toast-message')
};

// ============================================================================
// Color Utilities & Contrast Ratio Computation
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

function getRelativeLuminance(rgb) {
  const parts = [rgb.r, rgb.g, rgb.b].map(channel => {
    const val = channel / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * parts[0] + 0.7152 * parts[1] + 0.0722 * parts[2];
}

function computeContrastRatio(hex1, hex2) {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getRelativeLuminance(rgb1);
    const lum2 = getRelativeLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch (err) {
    return 1;
  }
}

function updateContrastIndicator() {
  const ratio = computeContrastRatio(state.dotsColor, state.bgColor);
  const formatted = ratio.toFixed(1) + ':1';

  if (ratio >= 4.5) {
    elements.contrastStatus.className = 'contrast-pill';
    elements.contrastStatus.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
      <span>Scan Safe (${formatted})</span>
    `;
  } else if (ratio >= 3.0) {
    elements.contrastStatus.className = 'contrast-pill warning';
    elements.contrastStatus.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>Moderate Contrast (${formatted})</span>
    `;
  } else {
    elements.contrastStatus.className = 'contrast-pill warning';
    elements.contrastStatus.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      <span>Low Contrast (${formatted})</span>
    `;
  }
}

// ============================================================================
// Toast Notification
// ============================================================================
let toastTimeoutId = null;

function showToast(message, isError = false) {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  elements.toastMessage.textContent = message;
  elements.toastNotification.style.borderColor = isError ? 'var(--danger)' : 'var(--electric-blue)';
  elements.toastNotification.classList.add('show');

  toastTimeoutId = setTimeout(() => {
    elements.toastNotification.classList.remove('show');
    toastTimeoutId = null;
  }, 2800);
}

// ============================================================================
// Brand Labels Reactive Painting
// ============================================================================
function renderBrandLabels() {
  const isEnabled = state.brandPosition !== 'none';
  const hasText = state.brandText.trim().length > 0;

  // Background sync for the whole composite card
  if (elements.qrCompositeCard) {
    elements.qrCompositeCard.style.backgroundColor = state.bgColor;
  }

  // Hide both initially
  if (elements.qrBrandLabelTop) elements.qrBrandLabelTop.style.display = 'none';
  if (elements.qrBrandLabelBottom) elements.qrBrandLabelBottom.style.display = 'none';

  if (!isEnabled) {
    if (elements.metaBrandTag) elements.metaBrandTag.textContent = 'None (Disabled)';
    if (elements.metaRes) elements.metaRes.textContent = '400 × 400 px (SVG / Hi-Res)';
    return;
  }

  const activeLabel = state.brandPosition === 'top' ? elements.qrBrandLabelTop : elements.qrBrandLabelBottom;
  if (activeLabel) {
    activeLabel.style.display = 'block';
    activeLabel.style.fontFamily = state.brandFont;
    activeLabel.style.color = state.brandColor;
    activeLabel.style.fontSize = `${state.brandSize}px`;
    activeLabel.style.letterSpacing = `${state.brandSpacing}px`;

    if (hasText) {
      activeLabel.textContent = state.brandText;
      activeLabel.style.opacity = '1';
      activeLabel.style.fontStyle = 'normal';
    } else {
      activeLabel.textContent = '[ YOUR COMPANY NAME ]';
      activeLabel.style.opacity = '0.35';
      activeLabel.style.fontStyle = 'italic';
    }
  }

  // Update Metadata items
  const posName = state.brandPosition === 'top' ? 'Top Header' : 'Bottom Footer';
  if (elements.metaBrandTag) {
    elements.metaBrandTag.textContent = hasText ? `${posName}: "${state.brandText}"` : `${posName}: (Waiting for input)`;
  }
  if (elements.metaRes) {
    const estimatedHeight = 400 + Math.round(state.brandSize * 1.8 + 24);
    elements.metaRes.textContent = `400 × ${estimatedHeight} px (Composite)`;
  }
}

// ============================================================================
// QR Code Engine Lifecycle & Instant Reactive Painting
// ============================================================================
function getEngineConfig() {
  return {
    width: 400,
    height: 400,
    type: 'svg',
    data: state.data.trim() || DEFAULT_PAYLOAD,
    image: state.logoSrc || '',
    dotsOptions: {
      color: state.dotsColor,
      type: state.dotStyle
    },
    backgroundOptions: {
      color: state.bgColor
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: Number(state.logoMargin),
      imageSize: Number(state.logoSize),
      hideBackgroundDots: true // Locked to true for clean logo contrast
    },
    cornersSquareOptions: {
      color: state.dotsColor,
      type: state.cornerSquareStyle
    },
    cornersDotOptions: {
      color: state.dotsColor,
      type: state.cornerDotStyle
    },
    qrOptions: {
      errorCorrectionLevel: state.ecc
    }
  };
}

function updateMetadata() {
  const len = state.data.length;
  elements.charCount.textContent = len;
  elements.metaChars.textContent = len > 0 ? `${len} character${len === 1 ? '' : 's'}` : '0 characters (Empty)';

  const eccLabels = {
    L: 'ECC: Level L (7%)',
    M: 'ECC: Level M (15%)',
    Q: 'ECC: Level Q (25%)',
    H: 'ECC: Level H (30%)'
  };
  elements.metaRedundancyBadge.textContent = eccLabels[state.ecc] || 'ECC: Level H (30%)';
}

function renderQR() {
  if (!qrCodeInstance) return;

  const config = getEngineConfig();

  // Instant non-blocking update
  qrCodeInstance.update(config);

  // Sync canvas wrapper surface background
  if (elements.qrCanvasWrapper) {
    elements.qrCanvasWrapper.style.backgroundColor = state.bgColor;
  }

  updateContrastIndicator();
  updateMetadata();
  renderBrandLabels();
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

  elements.qrCanvasWrapper.style.backgroundColor = state.bgColor;
  updateContrastIndicator();
  updateMetadata();
  renderBrandLabels();
}

// ============================================================================
// Logo Upload & Local FileReader Mechanics
// ============================================================================
function processLogoFile(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file (SVG, PNG, JPG, WebP)', true);
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const rawDataUrl = event.target.result;

    // For raster images, optimize size using an offscreen canvas to keep base64 memory tight
    if (file.type !== 'image/svg+xml') {
      const img = new Image();
      img.onload = () => {
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/png', 0.95);
        applyLogoState(optimizedDataUrl, file.name);
      };
      img.src = rawDataUrl;
    } else {
      applyLogoState(rawDataUrl, file.name);
    }
  };

  reader.onerror = () => {
    showToast('Failed to read image locally. Try another file.', true);
  };

  reader.readAsDataURL(file);
}

function applyLogoState(dataUrl, fileName) {
  state.logoSrc = dataUrl;
  state.logoName = fileName;

  // With a logo, ECC should strictly be High (H) to prevent scan degradation
  state.ecc = 'H';
  elements.eccSelect.value = 'H';

  // Update UI components
  elements.logoThumbnailImg.src = dataUrl;
  elements.logoFileName.textContent = fileName;
  elements.logoFileSize.textContent = 'FileReader Compressed Base64';

  elements.logoDropzone.style.display = 'none';
  elements.logoActivePreview.style.display = 'flex';
  elements.logoTuningRow.style.display = 'grid';

  showToast('Logo injected with automatic 30% ECC protection');
  renderQR();
}

function removeLogo() {
  state.logoSrc = '';
  state.logoName = '';
  elements.logoFileInput.value = '';

  elements.logoThumbnailImg.src = '';
  elements.logoActivePreview.style.display = 'none';
  elements.logoTuningRow.style.display = 'none';
  elements.logoDropzone.style.display = 'flex';

  renderQR();
  showToast('Logo removed');
}

// ============================================================================
// High-Resolution Composite Canvas Rendering (PNG & Clipboard)
// ============================================================================
function getSvgDataUrl() {
  const svgEl = elements.qrCanvasWrapper.querySelector('svg');
  if (!svgEl) return null;
  const serializer = new XMLSerializer();
  let svgStr = serializer.serializeToString(svgEl);
  if (!svgStr.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgStr = svgStr.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
}

function createCompositeCanvas() {
  return new Promise((resolve, reject) => {
    const svgDataUrl = getSvgDataUrl();
    if (!svgDataUrl) {
      return reject(new Error('No SVG element rendered in DOM'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const qrDim = 1000; // Ultra high density 1000x1000 base
      const scale = qrDim / 400; // 2.5x scaling factor
      const hasLabel = state.brandPosition !== 'none' && state.brandText.trim().length > 0;

      const bannerHeight = hasLabel ? Math.round(state.brandSize * scale * 1.8 + 48) : 0;
      const totalWidth = qrDim;
      const totalHeight = qrDim + bannerHeight;

      const canvas = document.createElement('canvas');
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      // 1. Draw Canvas Backdrop
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // 2. Draw QR Canvas
      const qrY = (hasLabel && state.brandPosition === 'top') ? bannerHeight : 0;
      ctx.drawImage(img, 0, qrY, qrDim, qrDim);

      // 3. Draw Brand Label Text
      if (hasLabel) {
        const textY = (state.brandPosition === 'top') ? (bannerHeight / 2) : (qrDim + bannerHeight / 2);
        const fontSize = Math.round(state.brandSize * scale);

        ctx.font = `700 ${fontSize}px ${state.brandFont}`;
        ctx.fillStyle = state.brandColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if ('letterSpacing' in ctx) {
          ctx.letterSpacing = `${state.brandSpacing * scale}px`;
        }

        ctx.fillText(state.brandText, totalWidth / 2, textY);
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

  const hasLabel = state.brandPosition !== 'none' && state.brandText.trim().length > 0;
  if (!hasLabel) {
    // Basic download from engine
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
    .catch((err) => {
      qrCodeInstance.download({ name: 'anyones-qr-gen', extension: 'png' });
      showToast('Downloaded PNG file');
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

  const hasLabel = state.brandPosition !== 'none' && state.brandText.trim().length > 0;
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
    const bannerHeight = Math.round(state.brandSize * 1.8 + 24);
    const totalHeight = qrHeight + bannerHeight;

    const qrOffsetY = state.brandPosition === 'top' ? bannerHeight : 0;
    const textY = state.brandPosition === 'top' ? (bannerHeight / 2 + 5) : (qrHeight + bannerHeight / 2 + 5);

    const innerContent = svgEl.innerHTML;

    const compositeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrWidth}" height="${totalHeight}" viewBox="0 0 ${qrWidth} ${totalHeight}">
      <rect width="100%" height="100%" fill="${state.bgColor}" />
      <text x="50%" y="${textY}" text-anchor="middle" fill="${state.brandColor}" font-family="${state.brandFont.replace(/"/g, '&quot;')}" font-size="${state.brandSize}px" font-weight="700" letter-spacing="${state.brandSpacing}px">${escapeXml(state.brandText)}</text>
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
        showToast('Copied High-Res QR with Brand Label to clipboard!');
      } catch (clipErr) {
        // Fallback to downloading PNG if direct clipboard write of image is restricted
        downloadCompositePng();
      }
    }, 'image/png');
  } catch (err) {
    downloadCompositePng();
  }
}

// ============================================================================
// Event Listeners & Interactive Bindings
// ============================================================================
function attachEventListeners() {
  // 1. Content Payload Input (Auto-clear on tap / focus)
  let payloadAutoCleared = false;

  function autoClearPayload() {
    if (!payloadAutoCleared || elements.qrDataInput.value === DEFAULT_PAYLOAD) {
      if (elements.qrDataInput.value === DEFAULT_PAYLOAD) {
        elements.qrDataInput.value = '';
        state.data = '';
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
      state.data = '';
      payloadAutoCleared = true;
      elements.qrDataInput.focus();
      renderQR();
    });
  }

  elements.qrDataInput.addEventListener('input', (e) => {
    state.data = e.target.value;
    payloadAutoCleared = true;
    renderQR();
  });

  // 2. Error Correction Level
  elements.eccSelect.addEventListener('change', (e) => {
    state.ecc = e.target.value;
    renderQR();
  });

  // 3. Quick Protocol Chips
  elements.protocolChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prefix = chip.getAttribute('data-prefix');
      const current = elements.qrDataInput.value.trim();

      if (prefix === 'WIFI:T:WPA;S:MyNetwork;P:password;;') {
        elements.qrDataInput.value = prefix;
      } else if (!current.startsWith(prefix)) {
        const cleaned = current.replace(/^(https?:\/\/|mailto:|tel:|sms:|WIFI:.*)/i, '');
        elements.qrDataInput.value = prefix + cleaned;
      }

      state.data = elements.qrDataInput.value;
      elements.qrDataInput.focus();
      renderQR();
    });
  });

  // 4. Color Matrix: Foreground (Dots)
  elements.colorDotsPicker.addEventListener('input', (e) => {
    const hex = e.target.value.toUpperCase();
    state.dotsColor = hex;
    elements.colorDotsHex.value = hex;
    clearActivePresets();
    renderQR();
  });

  elements.colorDotsHex.addEventListener('input', (e) => {
    const valid = normalizeHex(e.target.value);
    if (valid) {
      state.dotsColor = valid;
      elements.colorDotsPicker.value = valid;
      clearActivePresets();
      renderQR();
    }
  });

  // 5. Color Matrix: Backdrop (Canvas)
  elements.colorBgPicker.addEventListener('input', (e) => {
    const hex = e.target.value.toUpperCase();
    state.bgColor = hex;
    elements.colorBgHex.value = hex;
    clearActivePresets();
    renderQR();
  });

  elements.colorBgHex.addEventListener('input', (e) => {
    const valid = normalizeHex(e.target.value);
    if (valid) {
      state.bgColor = valid;
      elements.colorBgPicker.value = valid;
      clearActivePresets();
      renderQR();
    }
  });

  // 6. Color Presets
  elements.presetSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const fg = swatch.getAttribute('data-fg');
      const bg = swatch.getAttribute('data-bg');

      state.dotsColor = fg;
      state.bgColor = bg;

      elements.colorDotsPicker.value = fg;
      elements.colorDotsHex.value = fg;
      elements.colorBgPicker.value = bg;
      elements.colorBgHex.value = bg;

      clearActivePresets();
      swatch.classList.add('active');

      renderQR();
    });
  });

  function clearActivePresets() {
    elements.presetSwatches.forEach((s) => s.classList.remove('active'));
  }

  // 7. Structural Layout Templates: Dot Styles
  elements.geometryOptionCards.forEach((card) => {
    card.addEventListener('click', () => {
      elements.geometryOptionCards.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');

      state.dotStyle = card.getAttribute('data-dot-style');
      renderQR();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // 8. Corner Outer Styles
  elements.cornerSquareButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.cornerSquareButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.cornerSquareStyle = btn.getAttribute('data-corner-square');
      renderQR();
    });
  });

  // 9. Corner Inner Styles
  elements.cornerDotButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.cornerDotButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.cornerDotStyle = btn.getAttribute('data-corner-dot');
      renderQR();
    });
  });

  // 10. Brand / Company Identifier Customizations (Auto-clear on tap / focus)
  let brandAutoCleared = false;

  function autoClearBrand() {
    if (!brandAutoCleared || elements.brandNameInput.value === DEFAULT_BRAND) {
      if (elements.brandNameInput.value === DEFAULT_BRAND) {
        elements.brandNameInput.value = '';
        state.brandText = '';
        renderBrandLabels();
      }
      brandAutoCleared = true;
    }
  }

  if (elements.brandNameInput) {
    elements.brandNameInput.addEventListener('focus', autoClearBrand);
    elements.brandNameInput.addEventListener('click', autoClearBrand);

    elements.brandNameInput.addEventListener('input', (e) => {
      state.brandText = e.target.value;
      brandAutoCleared = true;
      renderBrandLabels();
    });
  }

  if (elements.btnClearBrand) {
    elements.btnClearBrand.addEventListener('click', () => {
      state.brandText = '';
      brandAutoCleared = true;
      if (elements.brandNameInput) {
        elements.brandNameInput.value = '';
        elements.brandNameInput.focus();
      }
      renderBrandLabels();
    });
  }

  // Brand Placement Buttons (Top, Bottom, None)
  elements.placementButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.placementButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      const pos = btn.getAttribute('data-brand-pos');
      state.brandPosition = pos;

      const labels = {
        top: 'Top Header',
        bottom: 'Bottom Footer',
        none: 'Disabled / None'
      };
      if (elements.brandPlacementStatus) {
        elements.brandPlacementStatus.textContent = labels[pos] || 'Top Header';
      }

      renderBrandLabels();
    });
  });

  // Brand Font Selector
  if (elements.brandFontSelect) {
    elements.brandFontSelect.addEventListener('change', (e) => {
      state.brandFont = e.target.value;
      renderBrandLabels();
    });
  }

  // Brand Color Picker & Hex
  if (elements.brandColorPicker) {
    elements.brandColorPicker.addEventListener('input', (e) => {
      const hex = e.target.value.toUpperCase();
      state.brandColor = hex;
      if (elements.brandColorHex) elements.brandColorHex.value = hex;
      renderBrandLabels();
    });
  }

  if (elements.brandColorHex) {
    elements.brandColorHex.addEventListener('input', (e) => {
      const valid = normalizeHex(e.target.value);
      if (valid) {
        state.brandColor = valid;
        if (elements.brandColorPicker) elements.brandColorPicker.value = valid;
        renderBrandLabels();
      }
    });
  }

  // Sync Brand Color with Pattern Color
  if (elements.btnSyncBrandColor) {
    elements.btnSyncBrandColor.addEventListener('click', () => {
      state.brandColor = state.dotsColor;
      if (elements.brandColorPicker) elements.brandColorPicker.value = state.brandColor;
      if (elements.brandColorHex) elements.brandColorHex.value = state.brandColor;
      renderBrandLabels();
      showToast('Brand color matched to pattern');
    });
  }

  // Brand Size Slider
  if (elements.brandSizeSlider) {
    elements.brandSizeSlider.addEventListener('input', (e) => {
      state.brandSize = parseInt(e.target.value, 10);
      if (elements.brandSizeVal) elements.brandSizeVal.textContent = state.brandSize + 'px';
      renderBrandLabels();
    });
  }

  // Brand Spacing Slider
  if (elements.brandSpacingSlider) {
    elements.brandSpacingSlider.addEventListener('input', (e) => {
      state.brandSpacing = parseFloat(e.target.value);
      if (elements.brandSpacingVal) elements.brandSpacingVal.textContent = state.brandSpacing + 'px';
      renderBrandLabels();
    });
  }

  // 11. Logo File Upload & Drag-and-Drop
  elements.logoDropzone.addEventListener('click', () => {
    elements.logoFileInput.click();
  });

  elements.logoDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      elements.logoFileInput.click();
    }
  });

  elements.logoFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processLogoFile(e.target.files[0]);
    }
  });

  elements.logoDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.logoDropzone.classList.add('drag-over');
  });

  elements.logoDropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.logoDropzone.classList.remove('drag-over');
  });

  elements.logoDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.logoDropzone.classList.remove('drag-over');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processLogoFile(e.dataTransfer.files[0]);
    }
  });

  elements.btnRemoveLogo.addEventListener('click', removeLogo);

  // 12. Logo Tuning Sliders
  elements.logoSizeSlider.addEventListener('input', (e) => {
    state.logoSize = parseFloat(e.target.value);
    elements.logoSizeVal.textContent = Math.round(state.logoSize * 100) + '%';
    renderQR();
  });

  elements.logoMarginSlider.addEventListener('input', (e) => {
    state.logoMargin = parseInt(e.target.value, 10);
    elements.logoMarginVal.textContent = state.logoMargin + 'px';
    renderQR();
  });

  // 13. Primary Action: Download PNG
  elements.btnDownloadPng.addEventListener('click', downloadCompositePng);

  // 14. Secondary Action: Download SVG
  elements.btnDownloadSvg.addEventListener('click', downloadCompositeSvg);

  // 15. Action: Copy PNG Image to Clipboard
  elements.btnCopyClipboard.addEventListener('click', copyCompositeImage);
}

// ============================================================================
// Application Boot
// ============================================================================
function startApp() {
  attachEventListeners();
  initQRCodeEngine();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
