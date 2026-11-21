# @touraine-tech/brand

Touraine Tech's colours, fonts, sizes and logos. `tokens.json` is the only source: the website, the admin, scan-participant and the mobile app read them from this package.

```sh
pnpm add @touraine-tech/brand
```

```css
@import '@touraine-tech/brand/tokens.css'; /* --tnt-accent, --tnt-category-front, --tnt-radius-md… */
```

```ts
import { colors, categoryColors, radius } from '@touraine-tech/brand' // sizes in pixels
```

The logo and the icon (which follows the dark mode) are `@touraine-tech/brand/logo.svg` and `@touraine-tech/brand/icon.svg`.

`--tnt-accent` (#4A9A8A) is the brand colour; text and buttons on white use `--tnt-accent-dark` (#357A6B), which reaches a 4.5:1 contrast.

## Change a token

1. Edit `tokens.json`, then run `npm run build`: it writes `tokens.css`, `index.js` and `index.d.ts`. `npm test` fails until they match.
2. Raise `version` in `package.json` and merge.
3. Tag `v<version>` on `main`: the Publish workflow puts it on npm.
4. Bump the package in the projects that use it.

## License

The code and the tokens are under the MIT License. The Touraine Tech logo and icon are not: you may use them as they are, but not modify them. See [LICENSE](./LICENSE).
