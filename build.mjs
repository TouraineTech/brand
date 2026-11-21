#!/usr/bin/env node
/**
 * Writes tokens.css, index.js and index.d.ts from tokens.json, the brand's only source.
 * Usage: npm run build
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (file) => fileURLToPath(new URL(file, import.meta.url));
const tokens = JSON.parse(readFileSync(here('./tokens.json'), 'utf8'));
const header = '/* Generated from tokens.json by build.mjs: edit tokens.json, then run it. */\n';
const camel = (name) => name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());

/** `--tnt-<group>-<name>`, colours without their group: `--tnt-accent`, `--tnt-category-front`. */
export function css() {
  const lines = [];
  for (const [name, value] of Object.entries(tokens.color)) lines.push(`--tnt-${name}: ${value};`);
  for (const [name, value] of Object.entries(tokens.category)) lines.push(`--tnt-category-${name}: ${value};`);
  for (const [name, value] of Object.entries(tokens.font)) lines.push(`--tnt-font-${name}: '${value}', sans-serif;`);
  for (const [name, value] of Object.entries(tokens.radius)) lines.push(`--tnt-radius-${name}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.space)) lines.push(`--tnt-space-${name}: ${value}px;`);
  for (const [name, value] of Object.entries(tokens.shadow)) lines.push(`--tnt-shadow-${name}: ${value};`);
  return `${header}:root {\n${lines.map((line) => `  ${line}`).join('\n')}\n}\n`;
}

/** The same values for JavaScript, numbers in pixels: React Native and emails read no CSS. */
export function js() {
  const group = (values) =>
    Object.fromEntries(Object.entries(values).map(([name, value]) => [camel(name), value]));
  const exports = Object.entries({
    colors: group(tokens.color),
    categoryColors: group(tokens.category),
    fonts: group(tokens.font),
    radius: group(tokens.radius),
    space: group(tokens.space),
    shadows: group(tokens.shadow),
  }).map(([name, value]) => `export const ${name} = ${JSON.stringify(value, null, 2)};\n`);
  return header + exports.join('\n');
}

/** Types with each value, so a consumer's editor shows the colour it picks. */
export function dts() {
  const groups = {
    colors: tokens.color,
    categoryColors: tokens.category,
    fonts: tokens.font,
    radius: tokens.radius,
    space: tokens.space,
    shadows: tokens.shadow,
  };
  const declarations = Object.entries(groups).map(([name, values]) => {
    const fields = Object.entries(values)
      .map(([key, value]) => `  readonly ${JSON.stringify(camel(key))}: ${JSON.stringify(value)};`)
      .join('\n');
    return `export declare const ${name}: {\n${fields}\n};\n`;
  });
  return header + declarations.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(here('./tokens.css'), css());
  writeFileSync(here('./index.js'), js());
  writeFileSync(here('./index.d.ts'), dts());
}
