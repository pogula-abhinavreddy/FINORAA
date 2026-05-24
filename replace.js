const fs = require('fs');

const filePath = 'app/assistant/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    "bg-emerald-950": "bg-primary",
    "emerald-400": "primary",
    "emerald-500": "primary",
    "emerald-600": "primary",
    "emerald-700": "primary",
    "emerald-800": "primary",
    "emerald-900": "primary",
    "emerald-950": "primary",
    "emerald-100": "primary-fixed-dim",
    "emerald-50": "primary-fixed",
    "slate-50": "surface-container",
    "slate-100": "surface-container-high",
    "slate-200": "surface-container-highest",
    "slate-300": "outline-variant",
    "slate-400": "outline",
    "slate-500": "outline",
    "slate-600": "outline",
    "slate-800": "outline",
    "slate-900": "surface-dim",
    "slate-950": "surface-dim",
    "rounded-\\[2\\.5rem\\]": "rounded-[16px]",
    "rounded-\\[3rem\\]": "rounded-[16px]",
    "rounded-3xl": "rounded-[16px]",
    "rounded-2xl": "rounded-[8px]",
    "shadow-2xl": "shadow-[0_12px_32px_rgba(120,118,129,0.08)]",
    "shadow-xl": "shadow-[0_4px_20px_rgba(120,118,129,0.05)]",
    "font-headline-xl": "font-display",
    "text-secondary": "text-outline",
    "bg-slate-50/80": "bg-white/70",
    "border-slate-100": "border-outline-variant/30",
    "border-white/30": "border-white/30"
};

for (const [pattern, repl] of Object.entries(replacements)) {
    content = content.replace(new RegExp(pattern, 'g'), repl);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('done');
