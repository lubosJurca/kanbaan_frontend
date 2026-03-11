---
name: kanbaan-design
description: >
  Apply the Kanbaan design system when styling Angular components in the Kanbaan project.
  Use this skill whenever the user asks to style, redesign, or add CSS/Tailwind to any
  Angular component in the Kanbaan app — including login, register, dashboard, sidebar,
  board view, task cards, modals, forms, and buttons. Also use when the user asks to make
  something "look like the design", "match the Figma", or "apply the design system".
  Always read this skill before writing any Tailwind classes or styles for this project.
---

# Kanbaan Design System

## ⚡ Before writing any styles

This project uses **Tailwind v4**. Custom colors and the font are configured via
`@theme` in `styles.css` — there is no `tailwind.config.js`. Everything is already
set up. You can immediately use classes like `bg-primary`, `text-medium`,
`dark:bg-dark-card` etc. without any setup step.

---

This skill defines the visual language for the Kanbaan Angular application. The app
supports both a **light theme** and a **dark theme**, switchable via a toggle in the
sidebar. Always implement both themes unless the user explicitly says otherwise.

The stack is: **Angular + Tailwind CSS + PrimeNG**. Use Tailwind utility classes for
all custom components and layouts. PrimeNG components are styled via PrimeNG theming
tokens, not Tailwind (except for wrapper/layout divs around them).

---

## 01 — Color Palette

These are the exact hex values from the design system. They are defined as CSS custom
properties via `@theme` in `styles.css` (Tailwind v4 approach). Always use the named
semantic Tailwind classes over raw hex values in templates.

```
/* Brand / Primary */
--color-primary:        #635FC7   /* main purple, buttons, active states */
--color-primary-light:  #A8A4FF   /* hover states, secondary accents */

/* Dark theme backgrounds (darkest → lightest) */
--color-dark-bg:        #000112   /* main board content area */
--color-dark-surface:   #20212C   /* header, sidebar */
--color-dark-card:      #2B2C37   /* task cards, modals */
--color-dark-line:      #3E3F4E   /* dividers, borders */

/* Light theme backgrounds */
--color-light-bg:       #F4F7FD   /* main board content area */
--color-light-surface:  #FFFFFF   /* header, sidebar, cards, modals */
--color-light-line:     #E4EBFA   /* dividers, borders */

/* Neutral / Text */
--color-medium:         #828FA3   /* subtask count, placeholder text, muted labels */

/* Semantic */
--color-destructive:    #EA5555   /* delete buttons, error states */
--color-destructive-light: #FF9898 /* destructive hover */
```

These map to Tailwind classes: `bg-primary`, `text-medium`, `border-dark-line` etc.

---

## 02 — Typography

The entire app uses a single font family: **Plus Jakarta Sans**.
Already imported via `@import` in `styles.css` and set as default via `@theme`:

```css
--font-sans: 'Plus Jakarta Sans', sans-serif;
```

### Type Scale

Use these classes consistently across the app:

| Role          | Size  | Weight | Line-height | Usage                              |
|---------------|-------|--------|-------------|------------------------------------|
| Heading XL    | 24px  | Bold   | 30px        | Page titles (rarely used)          |
| Heading L     | 18px  | Bold   | 23px        | Modal titles, board name in header |
| Heading M     | 15px  | Bold   | 19px        | Column headers, section labels     |
| Heading S     | 12px  | Bold   | 15px        | Subtask labels, small caps labels  |
| Body L        | 13px  | Medium | 23px        | Body text, descriptions            |
| Body M        | 12px  | Bold   | 15px        | Bold body, task card titles        |

Column header labels (TODO, DOING, DONE) are rendered in **small caps / uppercase**,
size 12px, letter-spacing wide (`tracking-widest`), color `--color-medium`.

---

## 03 — Layout & Structure

### App Shell

The app uses a classic sidebar + content layout:

```
┌──────────────┬────────────────────────────────────┐
│              │  Header (fixed, full width)         │
│   Sidebar    ├────────────────────────────────────┤
│   (fixed,    │                                     │
│   260px)     │   Board Content Area (scrollable)  │
│              │                                     │
└──────────────┴────────────────────────────────────┘
```

The sidebar is **260px wide** on desktop and has a "Hide Sidebar" toggle at the
bottom. When hidden, a small floating button appears on the left edge to bring it back.

### Header

The header is a fixed bar at the top spanning the content area (not the sidebar).
It contains:
- Board title (Heading L, white in dark / near-black in light)
- `+ Add New Task` button (primary, disabled/muted when board has no columns)
- Three-dot menu (`⋮`) for board actions

Dark header background: `--color-dark-surface` (`#20212C`)
Light header background: `#FFFFFF`
Header height: ~64px (use `h-16`)
Bottom border in light theme: 1px `--color-light-line`

### Sidebar

Dark sidebar background: `--color-dark-surface` (`#20212C`)
Light sidebar background: `#FFFFFF`
Bottom of sidebar contains the dark/light toggle and "Hide Sidebar" link.

Active board item: rounded pill, `bg-primary`, white text, board icon.
Inactive board items: `text-medium`, icon same color, no background.
"+ Create New Board" item: `text-primary`, no background.
"ALL BOARDS (n)" label: `text-medium`, Heading S size, uppercase, `tracking-widest`.

### Board Content Area

Dark: `bg-dark-bg` (`#000112`)
Light: `bg-light-bg` (`#F4F7FD`)

Columns are laid out horizontally with `flex flex-row gap-6` and horizontal scroll.
Each column is approximately **280px wide** and does not shrink.
The "+ New Column" area at the end of the columns row is a ghost column with muted
text, no background, just centered text.

---

## 04 — Components

### Task Cards

Dark: `bg-dark-card` (`#2B2C37`), subtle shadow
Light: `bg-white`, subtle shadow (`shadow-sm`)
Border radius: `rounded-lg` (8px)
Padding: `p-4` (16px)
Gap between cards: `gap-4` (16px)

Card content:
- Task title: Heading M weight (Bold 15px), white in dark / near-black in light
- Subtask count: Body L (13px), `text-medium` color — format: "X of Y subtasks"

No border on cards. Use shadow only. On hover, the card title changes to
`text-primary`.

### Column Headers

Format: `● COLUMN NAME (count)` — uppercase label with a colored dot on the left.
Dot colors: cyan/teal for TODO, purple for DOING, green for DONE (use actual colored
dot divs, not emoji).
Label: 12px, bold, `text-medium`, `tracking-widest`, uppercase.
Column headers have NO background — they sit directly on the board content area.

### Buttons

**Primary (Large):** `bg-primary text-white rounded-full px-6 py-3 font-bold text-sm`
Hover: `bg-primary-light`

**Primary (Small):** Same but `px-4 py-2 text-xs`

**Secondary:** White background in both themes with `text-primary`.
Dark: `bg-white text-primary`. Light: `bg-light-bg text-primary`.
Hover: slight opacity reduction.

**Destructive:** `bg-destructive text-white rounded-full`
Hover: `bg-destructive-light`

**+ Add New Subtask (inside modals):** Full-width, `bg-light-bg text-primary` in light /
`bg-dark-bg text-primary-light` in dark. Rounded-full. This is the "Secondary" button
variant used in modal context.

All buttons use `rounded-full` (fully rounded / pill shape). This is a key visual
signature of this design.

### Text Fields / Inputs

Light idle: white background, `border border-light-line`, `rounded`
Light active/focus: white background, `border border-primary`, `rounded`
Light error: white background, `border border-destructive`, error message text in
`text-destructive` aligned right inside the input

Dark idle: `bg-dark-card border border-dark-line`, `rounded`
Dark active/focus: `bg-dark-card border border-primary`, `rounded`

Placeholder text: `text-medium`
Input text: white in dark / near-black in light
Label above input: Heading S (12px bold), `text-medium`

Padding: `px-4 py-2`

### Dropdowns

Same styling as text inputs (same background, border, border-radius).
Chevron icon on the right. When open, shows options in a card with `bg-white` (light)
or `bg-dark-card` (dark) with a subtle shadow.

### Checkboxes (Subtask items)

Custom styled checkboxes — do NOT use browser default.
Idle: white/dark square with `border border-medium`, `rounded-sm`
Hover: background changes to `bg-primary` at low opacity (~10%)
Checked: `bg-primary` fill with white checkmark icon

### Modals / Dialogs

Modals appear centered over a dark semi-transparent overlay (`bg-black/50`).
Modal card: `bg-white` (light) or `bg-dark-card` (dark), `rounded-lg`, `p-6 md:p-8`
Max width: ~480px, full width on mobile.
Modal title: Heading L (18px Bold)
Section labels inside modal: Heading S (12px Bold, `text-medium`)
Bottom button: full-width primary button, `rounded-full`.

### Theme Toggle

A pill-shaped toggle with sun icon on the left and moon icon on the right.
Toggle thumb moves between the two. Use the standard toggle pattern.
Background when dark mode active: `bg-primary`. Light mode: `bg-light-line`.

---

## 05 — Theming Strategy in Angular

Since the app supports two themes, use Angular's `[class]` binding on the root
`<html>` or `<body>` element to toggle between dark and light mode.

In Tailwind v4, dark mode via class is enabled by default. In templates write:
```html
<div class="bg-white dark:bg-dark-card text-gray-900 dark:text-white">
```

The theme toggle in the sidebar updates a signal or store value that applies the
`dark` class to the document root like this:

```ts
document.documentElement.classList.toggle('dark', isDark);
```

---

## 06 — Mobile & Tablet

On **tablet** (portrait, ~768px), the sidebar is hidden by default and the layout
becomes single-column. The header shows the board title with a dropdown chevron.
The `+ Add Task` button becomes a rounded `+` icon button (no label text).

On **mobile**, the same pattern applies with smaller padding. Cards remain the same
visual style but with `p-3` instead of `p-4`.

Responsive breakpoints follow Tailwind defaults: `sm` (640px), `md` (768px), `lg`
(1024px).

---

## 07 — What uses PrimeNG vs Custom

Use **PrimeNG** for: complex interactive components like drag-and-drop (for reordering
columns and tasks), date pickers if needed, and toast notifications.

Use **custom Tailwind** for: all buttons, inputs, cards, sidebar, header, modals,
checkboxes, dropdowns, the theme toggle, and the overall layout shell. These are simple
enough that PrimeNG would add unnecessary complexity and make it harder to match the
design exactly.

When wrapping PrimeNG components, apply layout/spacing via Tailwind on the wrapper div,
not on the PrimeNG component directly.

---

## 08 — Key Visual Signatures (don't miss these)

These details make the design feel right. Always include them:

1. **Pill-shaped buttons** — all buttons use `rounded-full`, never `rounded` or `rounded-md`
2. **Plus Jakarta Sans** — must be loaded and applied globally
3. **Column color dots** — the small colored circles before column names are a key detail
4. **No borders on cards** — task cards use shadow only, never a border
5. **Muted subtask count** — always `text-medium` color, format "X of Y subtasks"
6. **Active sidebar item** — full pill highlight in `bg-primary`, not just a left border
7. **Uppercase column labels** — `tracking-widest uppercase` on column header text