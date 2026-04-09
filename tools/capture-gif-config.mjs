export const FAMILY_PRESETS = {
  standard: {
    viewport: { width: 1400, height: 1200 },
    outputWidth: 488,
    settleMs: 400,
    fps: 10,
    measureDurationMs: 720,
    sampleIntervalMs: 80,
  },
  tall: {
    viewport: { width: 1400, height: 1600 },
    outputWidth: 488,
    settleMs: 450,
    fps: 10,
    measureDurationMs: 1120,
    sampleIntervalMs: 80,
  },
};

export const EFFECTS = {
  envelope: {
    family: 'tall',
    hoverSelector: '[data-panel="desktop-closed"] .trifold-letter--hover',
    toggleSelector: '[data-panel="desktop-closed"] .trifold-letter--hover',
    openClass: 'trifold-letter--preview-open',
    durationMs: 4000,
  },
  'chat-messages': {
    family: 'standard',
    hoverSelector: '[data-panel="desktop-closed"] .chat-conversation--hover',
    toggleSelector: '[data-panel="desktop-closed"] .chat-conversation--hover',
    openClass: 'chat-conversation--preview-open',
    durationMs: 4000,
  },
  polaroid: {
    family: 'standard',
    hoverSelector: '[data-panel="desktop-closed"] .polaroid-inner',
    toggleSelector: '[data-panel="desktop-closed"] .polaroid-inner',
    openClass: 'polaroid--preview-open',
    durationMs: 4000,
  },
  'secret-divider': {
    family: 'standard',
    hoverSelector: '[data-panel="desktop-closed"] .secret-divider--hover',
    toggleSelector: '[data-panel="desktop-closed"] .secret-divider--hover',
    openClass: 'secret-divider--preview-open',
    durationMs: 4000,
  },
  typewriter: {
    family: 'tall',
    hoverSelector: '[data-panel="desktop-closed"] .typewriter--hover',
    toggleSelector: '[data-panel="desktop-closed"] .typewriter--hover',
    openClass: 'typewriter--preview-open',
    durationMs: 4500,
  },
};
