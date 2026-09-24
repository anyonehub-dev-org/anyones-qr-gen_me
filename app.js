/**
 * anyone's QR gen — 100% Client-Side Custom QR Code Generator
 * Domain: anyone's-QR_gen.me
 * High-performance, zero-latency reactive rendering engine.
 */

'use strict';

// ============================================================================
// State Management
// ============================================================================
const state = {
  data: "https://anyone's-QR_gen.me",
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  dotsColor: '#00F2FE',
  bgColor: '#08090E',
  ecc: 'H',
  logoSrc: '',
  logoName: '',
  logoSize: 0.28,
  logoMargin: 4
};

let qrCodeInstance = null;

// ============================================================================
// Cached DOM Elements
// ============================================================================
const elements = {
  // Inputs
  qrDataInput: document.getElementById('qr-data-input'),
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

  // Preview Stage & Metadata
  qrCanvasWrapper: document.getElementById('qr-canvas-wrapper'),
  metaChars: document.getElementById('meta-chars'),
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
// QR Code Engine Lifecycle & Instant Reactive Painting
// ============================================================================
function getEngineConfig() {
  return {
    width: 400,
    height: 400,
    type: 'svg',
    data: state.data.trim() || "https://anyone's-QR_gen.me",
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
  elements.metaChars.textContent = `${len} character${len === 1 ? '' : 's'}`;

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
}

function initQRCodeEngine() {
  if (typeof window.QRCodeStyling === 'undefined') {
    // Retry shortly if script tag from unpkg is still completing
    setTimeout(initQRCodeEngine, 50);
    return;
  }

  const initialConfig = getEngineConfig();
  qrCodeInstance = new window.QRCodeStyling(initialConfig);

  elements.qrCanvasWrapper.innerHTML = '';
  qrCodeInstance.append(elements.qrCanvasWrapper);

  elements.qrCanvasWrapper.style.backgroundColor = state.bgColor;
  updateContrastIndicator();
  updateMetadata();
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
// Event Listeners & Interactive Bindings
// ============================================================================
function attachEventListeners() {
  // 1. Content Payload Input
  elements.qrDataInput.addEventListener('input', (e) => {
    state.data = e.target.value;
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
        // Strip common prefixes and prepend selected
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

  // 10. Logo File Upload & Drag-and-Drop
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

  // 11. Logo Tuning Sliders
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

  // 12. Primary Action: Download PNG
  elements.btnDownloadPng.addEventListener('click', () => {
    if (!qrCodeInstance) return;
    try {
      qrCodeInstance.download({
        name: 'anyones-qr-gen',
        extension: 'png'
      });
      showToast('Downloading high-density PNG...');
    } catch (err) {
      showToast('PNG download trigger failed', true);
    }
  });

  // 13. Secondary Action: Download SVG
  elements.btnDownloadSvg.addEventListener('click', () => {
    if (!qrCodeInstance) return;
    try {
      qrCodeInstance.download({
        name: 'anyones-qr-gen',
        extension: 'svg'
      });
      showToast('Downloading vector SVG...');
    } catch (err) {
      showToast('SVG download trigger failed', true);
    }
  });

  // 14. Action: Copy PNG Image to Clipboard
  elements.btnCopyClipboard.addEventListener('click', async () => {
    if (!qrCodeInstance) return;
    try {
      const blob = await qrCodeInstance.getRawData('png');
      if (!blob) throw new Error('Blob generation returned null');

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('Copied High-Res QR PNG to clipboard!');
    } catch (err) {
      // In environments where clipboard.write(Image) is restricted, offer direct PNG download fallback
      showToast('Clipboard direct image copy restricted. Downloading PNG file...');
      qrCodeInstance.download({
        name: 'anyones-qr-gen',
        extension: 'png'
      });
    }
  });
}

// ============================================================================
// Application Boot
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  attachEventListeners();
  initQRCodeEngine();
});
