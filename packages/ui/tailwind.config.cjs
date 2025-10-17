const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Tailwind configuration that mirrors the GoldShore brand system.
 * Downstream apps can extend from this file to ensure consistency.
 */
module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        obsidian: 'var(--gs-color-base-obsidian)',
        surface: 'var(--gs-color-surface)',
        panel: 'var(--gs-color-panel)',
        primary: {
          DEFAULT: 'var(--gs-color-primary)',
          hover: 'var(--gs-color-primary-hover)',
          active: 'var(--gs-color-primary-active)'
        },
        gold: 'var(--gs-color-gold)',
        teal: 'var(--gs-color-teal)',
        success: 'var(--gs-color-success)',
        warning: 'var(--gs-color-warning)',
        critical: 'var(--gs-color-critical)',
        border: {
          outer: 'var(--gs-color-border-outer)',
          inner: 'var(--gs-color-border-inner)'
        }
      },
      fontFamily: {
        display: ['var(--gs-font-display)', ...defaultTheme.fontFamily.sans],
        body: ['var(--gs-font-body)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--gs-font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(38, 52, 67, 0.5), 0 10px 40px rgba(10, 15, 22, 0.45)',
        layer0: 'var(--gs-shadow-0)',
        layer1: 'var(--gs-shadow-1)',
        layer2: 'var(--gs-shadow-2)',
        layer3: 'var(--gs-shadow-3)'
      },
      borderRadius: {
        sm: 'var(--gs-radius-sm)',
        md: 'var(--gs-radius-md)',
        lg: 'var(--gs-radius-lg)'
      },
      spacing: {
        1: 'var(--gs-space-1)',
        2: 'var(--gs-space-2)',
        3: 'var(--gs-space-3)',
        4: 'var(--gs-space-4)',
        6: 'var(--gs-space-6)',
        8: 'var(--gs-space-8)',
        12: 'var(--gs-space-12)'
      },
      transitionDuration: {
        fast: 'var(--gs-transition-fast)',
        medium: 'var(--gs-transition-medium)'
      }
    }
  }
};
