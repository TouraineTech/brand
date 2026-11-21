import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { css, dts, js } from '../build.mjs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('the package holds the files tokens.json generates', () => {
  assert.equal(read('tokens.css'), css(), 'run npm run build');
  assert.equal(read('index.js'), js(), 'run npm run build');
  assert.equal(read('index.d.ts'), dts(), 'run npm run build');
});
