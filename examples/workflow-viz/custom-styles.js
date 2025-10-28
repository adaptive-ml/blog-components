/**
 * Custom inline styles for tier3 syntax highlighting
 *
 * These styles are injected into the component via the `custom-styles` attribute
 * and can be used to customize the appearance of tier3 content.
 *
 * Usage:
 *   workflow.setAttribute('custom-styles', customStyles);
 */

export const customStyles = `
/* Syntax highlighting for tier3 code view */
.tier3__content .role-user {
  color: var(--color-user, #10b981);
}

.tier3__content .role-thinking {
  color: var(--color-thinking, #f59e0b);
}

.tier3__content .role-tool {
  color: var(--color-tool, #8b5cf6);
}

.tier3__content .role-response {
  color: var(--color-response, #06b6d4);
}

.tier3__content .syntax {
  color: var(--color-syntax, #94a3b8);
}
`;

/**
 * Alternative color scheme - high contrast
 */
export const highContrastStyles = `
.tier3__content .role-user {
  color: #059669;
  font-weight: 600;
}

.tier3__content .role-thinking {
  color: #d97706;
  font-weight: 600;
}

.tier3__content .role-tool {
  color: #7c3aed;
  font-weight: 600;
}

.tier3__content .role-response {
  color: #0891b2;
  font-weight: 600;
}

.tier3__content .syntax {
  color: #64748b;
  font-style: italic;
}
`;
