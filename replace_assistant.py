import os
import re

file_path = "app/assistant/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    r"bg-emerald-950": "bg-primary",
    r"emerald-400": "primary",
    r"emerald-500": "primary",
    r"emerald-600": "primary",
    r"emerald-700": "primary",
    r"emerald-800": "primary",
    r"emerald-900": "primary",
    r"emerald-950": "primary",
    r"emerald-100": "primary-fixed-dim",
    r"emerald-50": "primary-fixed",
    r"slate-50": "surface-container",
    r"slate-100": "surface-container-high",
    r"slate-200": "surface-container-highest",
    r"slate-300": "outline-variant",
    r"slate-400": "outline",
    r"slate-500": "outline",
    r"slate-600": "outline",
    r"slate-800": "outline",
    r"slate-900": "surface-dim",
    r"slate-950": "surface-dim",
    r"rounded-\[2\.5rem\]": "rounded-[16px]",
    r"rounded-\[3rem\]": "rounded-[16px]",
    r"rounded-3xl": "rounded-[16px]",
    r"rounded-2xl": "rounded-[8px]",
    r"shadow-2xl": "shadow-[0_12px_32px_rgba(120,118,129,0.08)]",
    r"shadow-xl": "shadow-[0_4px_20px_rgba(120,118,129,0.05)]",
    r"font-headline-xl": "font-display",
    r"text-secondary": "text-outline",
    r"bg-slate-50/80": "bg-white/70",
    r"border-slate-100": "border-outline-variant/30",
    r"border-white/30": "border-white/30",
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")
