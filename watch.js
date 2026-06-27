// ── Watcher — Profesionales Tandil ──
// Uso: node watch.js
// Reconstruye automáticamente al guardar profesionales.json

const { execSync } = require('child_process');
const fs = require('fs');

console.log('👀 Mirando profesionales.json... Ctrl+C para detener.\n');

let debounce;
fs.watch('profesionales.json', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    try {
      execSync('node build.js', { stdio: 'inherit' });
    } catch (e) {}
  }, 300);
});
