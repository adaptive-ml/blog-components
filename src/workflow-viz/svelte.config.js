export default {
  compilerOptions: {
    customElement: true
  },
  onwarn: (warning, handler) => {
    if (warning.code === 'css-unused-selector') return;
    if (warning.code === 'a11y-click-events-have-key-events') return;
    if (warning.code === 'a11y-no-static-element-interactions') return;
    handler(warning);
  }
};
