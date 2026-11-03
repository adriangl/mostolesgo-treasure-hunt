---
version: alpha
name: Night Trail
description: Original dark, lively visual system for a Móstoles treasure-hunt experience.
colors:
  primary: "#FBD95B"
  primary-hover: "#FFA319"
  navy: "#0F1B39"
  background: "#101820"
  surface: "#141414"
  text: "#FFFFFF"
  muted: "#949494"
  button-ink: "#57300D"
  link-on-light: "#0000EE"
typography:
  display:
    fontFamily: Lato
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.02em
  heading:
    fontFamily: Lato
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
  lead:
    fontFamily: Lato
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: Lato
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: Lato
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.08em
rounded:
  input: 6px
  card: 24px
  button: 50px
  chip: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 40px
  xxxl: 48px
  section: 52px
  hero: 60px
  gutter: 10px
  max-width: 1799px
components:
  site-nav:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.button}"
    padding: 14.5px
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.button}"
  button-secondary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "{spacing.xl}"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.input}"
    padding: "{spacing.xs}"
  chip:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.text}"
    rounded: "{rounded.chip}"
  metadata:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body}"
  link-on-light:
    backgroundColor: "{colors.text}"
    textColor: "{colors.link-on-light}"
  link-on-dark:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
---

# Night Trail Design System

## Overview

Night Trail is an original visual direction for an urban treasure hunt in Móstoles. It should feel like an invitation to explore after dark: energetic, welcoming, easy to scan, and clear about what to do next. The event information is practical; the atmosphere comes from color, scale, and restrained abstract artwork.

The [supplied reference screenshot](docs/reference/inspiration-page.png) guides **hierarchy and density** on the home page: a narrow navigation band, spacious centered hero, oversized event title, compact date and time, short explanatory copy, and one prominent action. The home page then links to separate mission, rules, and tools pages. Treat the screenshot as a composition reference only. Create original names, symbols, illustrations, photography, copy, and interaction patterns. Do not use the source's logos, characters, decorative emblems, or other identity assets in the product.

## Colors

Deep slate `#101820` is the shared page foundation. Use navy for broad atmospheric areas such as the hero or navigation, and near-black `surface` for cards. White carries the main reading hierarchy; yellow is reserved for the key action and a few important facts. Muted gray is for secondary metadata, never for critical instructions.

- **Primary `#FBD95B`:** action, selected state, and small high-value highlights.
- **Navy `#0F1B39`:** atmospheric background blocks, secondary controls, and visual depth.
- **Background `#101820` / surface `#141414`:** shared page base and raised content groupings.
- **Text `#FFFFFF` / muted `#949494`:** readable copy and quiet supporting detail.
- **Button ink `#57300D`:** text on yellow controls.
- **Link blue `#0000EE`:** only on white or similarly light inset surfaces. On dark surfaces, use underlined primary yellow.

Use gradients sparingly as an original accent: `linear-gradient(90deg, #FD6040, #FDC340, #8BC7E1)` for a narrow decorative line or abstract illustration; `linear-gradient(90deg, #FBD95B, #FFA319)` for a featured action or highlight. Keep body text and form surfaces solid for reliable contrast. A navy-to-black tonal fade may give the hero atmosphere without reproducing the reference artwork.

## Typography

Use Lato throughout, with a sans-serif fallback. The display scale is 64px, the main section heading is 32px, and readable lead copy is 16px. The supplied 12px body style is for compact navigation, labels, dates, and supporting metadata; use 16px with 1.75 line-height for paragraphs people must read. On narrow screens, reduce display text to 40px and headings to 28px while keeping reading copy at 16px.

Keep titles bold and brief. Prefer sentence case for content, with uppercase used only for short navigation labels and small category tags. Limit centered hero paragraphs to about 68 characters per line; align longer content to the left inside cards. Make the event date and time a distinct line between title and description.

## Layout

Use a 4px base rhythm and the spacing tokens above. The outer grid may grow to 1799px with a 10px gutter, but constrain hero copy to roughly 720px and major information cards to roughly 1120px. On desktop, the first view should present the navigation, title, event metadata, short introduction, primary action, and the start of the next information card. Give the hero 60px or more of vertical breathing room and use 40–60px between major groups.

Build the hero as a centered, single-column composition with restrained abstract shapes or texture; the card below may use two columns for a graphic and practical details. At 1023px and below, stack groups of CTA buttons vertically with a 14px gap and make each button full width. At 885px and below, collapse the information card to one column. At 768px and below, simplify navigation and use 24px side padding. At 500px and below, use 16px side padding, full-width primary actions, and edge-to-edge toggle groups with square shared edges where needed. Treat the nearby 485/499px and 680/685px reference breakpoints as implementation artifacts; use content-driven adjustments around 500px and 680px if a specific component needs them.

## Elevation & Depth

Use flat layers: color, borders, and spacing establish hierarchy. Cards have no resting shadow. A 1px subtle border such as `#333333` can separate a dark input or card from its surroundings. A hoverable action may use the supplied transient `0 4px 8px rgba(0, 0, 0, 0.2)` shadow without scaling beyond `1`; do not put shadows on every element. Keep the navigation above page content at `z-index: 9999`, local overlays at `10000`, and modals at `10001`.

## Shapes

Buttons have a 50px radius and chips are pills. Inputs use a compact 6px radius. Cards use a generous 24px radius, with enough inner padding that text does not crowd the curve. Use rounded geometry for original icons and abstract map or trail motifs, while keeping their silhouette distinct from the reference's game and brand symbols.

## Components

- **Primary button:** yellow fill, button-ink text, medium or semibold weight, 14.5px vertical and 50px horizontal padding, 50px radius. Keep one dominant action per screen. Hover changes toward `#FFA319` over 0.2s; pressed state darkens slightly and may move down 1px. Disabled state uses a muted fill and must still make its status clear in text.
- **Secondary button:** navy fill, white text, pill shape, and a visible light border on dark navy backgrounds. Give it the same height as the primary button.
- **Card:** solid `#141414`, 24px radius, 24–40px padding, and a clear heading. A featured card can use a thin yellow or gradient edge accent, but should not resemble the source's ticket or branding.
- **Input:** black surface, 1px `#333333` border, 6px radius, and 8px vertical / 12px horizontal padding. Put visible labels above fields; reserve muted text for hints and placeholders. Show errors with text and an icon or border change, not color alone.
- **Chip / toggle:** pill shape for standalone filters. Selected state uses yellow fill and dark text. Connected toggles may use square shared edges at 500px and below.
- **Links:** underline in body copy. Use yellow on dark and blue only on light surfaces. Never rely on color alone to identify a link.
- **Focus:** on light or yellow surfaces, use `2px solid rgb(24, 36, 46)` with `-2px` offset as supplied. On black or navy surfaces, use a visible 2px yellow outer ring with 2px offset. Preserve keyboard focus even when hover styles are active.
- **Motion:** use 0.2s for hover and press feedback, 0.3s for panel or navigation transitions. Animate color, border, opacity, and small positional changes; honor `prefers-reduced-motion` by removing nonessential movement.

## Do's and Don'ts

- Do keep the same broad visual rhythm as the reference: quiet nav, dramatic title, clear details, one strong CTA, then a practical card.
- Do write original treasure-hunt copy and use original city, route, and discovery imagery.
- Do maintain WCAG AA text contrast and a visible keyboard focus indicator on every interactive element.
- Do use Pokémon names and game terminology when they are needed to explain the missions and rules. Keep illustrations and visual identity original; do not copy logos, characters, event badges, or decorative artwork from the reference page.
- Don't make the page busy with decorative gradients, constant animation, or repeated yellow buttons.
- Don't reduce essential instructions to 12px simply to match compact metadata styling.
