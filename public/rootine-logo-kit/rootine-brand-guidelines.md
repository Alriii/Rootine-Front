# Rootine logo guidelines

## The idea
Rootine = **root + routine**. The symbol is a cross-section of the ground: a sprout above the line, roots below it.
Growth you can see, built on habits you can't. Green is also nearly unused among productivity apps, so it is ownable.

## Three pieces, three jobs
| Piece | Direction | Where it goes |
|---|---|---|
| **Logo symbol** | B · Rooted Sprout (circle) | App icon, avatar, social profile, headers, anywhere the symbol stands alone |
| **Text design (wordmark)** | A · r-sprout: a lowercase "r" whose arm is a leaf, then "ootine" | Next to the symbol in lockups, and alone when the symbol is already nearby |
| **Website tab icon** | C · Task Roots: a sprout over tapering bars | Browser tab / favicon (`web/favicon.svg`, `favicon.ico`) |

The name is always written in lowercase: **rootine**. The leaf-r is part of the wordmark; never replace it with a typed "r".

## Lockups
- **Horizontal** (symbol + wordmark): default for websites, headers, documents, email signatures.
- **Stacked**: square or narrow spaces, posters, splash screens.
- **Wordmark only**: when the symbol already appears nearby.
- **Small-size symbol**: below 40 px. Heavier sprout, same idea.

## Colors
| Name | HEX | RGB | CMYK* | Role |
|---|---|---|---|---|
| Rootine Green | `#1B7F4E` | 27 127 78 | 79 0 39 50 | Brand color, buttons, links |
| Forest | `#0F2E22` | 15 46 34 | 67 0 26 82 | Wordmark, text, dark surfaces |
| Sprout | `#4CBF7A` | 76 191 122 | 60 0 36 25 | Leaf, highlights, top half on dark backgrounds |
| Mint | `#CFEFD9` | 207 239 217 | 13 0 9 6 | Selected states, soft backgrounds |
| Soil | `#8A6A4F` | 138 106 79 | 0 23 43 46 | Warm accent, illustration |
| Cream | `#F6F8F2` | 246 248 242 | 1 0 2 3 | App background, text on dark |

\*CMYK is a plain screen-to-print conversion, not a Pantone or press-profile match. Ask your printer for a proof.

Contrast (WCAG): white on Rootine Green 5.0:1 · Forest on Cream 13.7:1 · Cream on Forest 13.7:1 · Rootine Green on Cream 4.7:1.

## Type
Wordmark: **Nunito ExtraBold** with a custom leaf-r, tracking −1.5 %, converted to outlines. Do not retype it; use the files.
Nunito is licensed under the SIL Open Font License, which allows logo use.
Interface: Nunito (headings) and Inter (text), as in the Rootine screens.

## Which file on which background
| Background | File |
|---|---|
| White, cream, light grey | `*-color` |
| Forest, black, dark photo | `*-on-dark` (the sprout is a real cut-out, so it shows the background) |
| Rootine Green | `*-white` |
| One-colour print, stamps, embroidery | `*-black` or `*-white` |

## Clear space and minimum size
- Clear space: **¼ of the symbol's diameter** on every side. Nothing enters it.
- Minimum widths: symbol 24 px (use the small-size symbol below 40 px) · horizontal logo 140 px · stacked logo 80 px · wordmark 80 px.
- In print: symbol 8 mm, horizontal logo 35 mm.
- Tab icon: made for 16–48 px. At 16 px it reads as a leaf over stripes; if you need a sharper tab icon, `rootine-symbol-small-color.svg` (the B symbol) holds up better.

## Don't
- Don't recolor the symbol, swap its halves, or put the color version on green or forest.
- Don't stretch, rotate, outline, shadow or add effects.
- Don't change the roots or the sprout, or redraw the wordmark in another font.
- Don't use the tab icon (C) as the main logo.

## Files
- `svg/` masters: symbol, small-size symbol, horizontal, stacked, wordmark, app icon, tab icon. Each in color, on-dark, black and white (symbol also mono-green).
- `png/` ready-to-use rasters. Symbol 1024, horizontal 2400 px wide, stacked 1200 px wide, wordmark 2000 px wide, app icons.
- `web/` favicon.svg and favicon.ico (tab icon), apple-touch icon and PWA icons (symbol), `site.webmanifest`, `head-snippet.html`.
- `concepts/` the three explored directions and the overview sheet.

## Handover notes
- Masters contain only filled paths: no live text, strokes, masks, filters or embedded images.
- Letters "ootine" are stock Nunito ExtraBold; the leaf-r and the symbol carry the identity. Customizing more letters would make the wordmark more ownable.
- The symbol and wordmark both use a leaf. That is a deliberate echo, but it is the first thing to revisit if the two start to feel repetitive.
- No trademark search has been done. Run one for "rootine" in your markets before launch.
- Tested: 16 px, 32 px, one-colour, reversed, light and dark backgrounds.
