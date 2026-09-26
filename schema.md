# Animation choices

This document records the animation patterns currently used by the Blog frontend.

## Theme change

- Uses the browser View Transitions API to reveal the new theme with a circle expanding from the footer toggle.
- Duration is 450 ms with `ease-in-out` easing.
- Falls back to an immediate theme change when View Transitions are unavailable or reduced motion is enabled.
- The active transition styles are scoped to the theme change.

## Scroll expanding cover

- A post cover expands from a rounded, centered frame to full viewport size as the page scrolls.
- Initial frame size is 56% wide by 80% tall; corners move from 24 px to square.
- The media zoom eases from 1.35 to 1. Scroll progress spans 1.2 viewport heights, followed by a 0.35 viewport-height hold.
- The post title and scroll hint fade or move as the image expands. Reduced-motion users receive direct scroll progress without smoothing.
- Posts without a cover image do not render this animation.

## Smooth cursor

- A custom cursor follows mouse and trackpad movement with a damped spring (damping 45, stiffness 400, mass 1).
- It rotates with movement direction and briefly scales down while moving.
- It is disabled for touch-only pointers and when reduced motion is enabled. Text fields retain their text cursor.

## Click sparks

- Pointer clicks create eight radial strokes in the current theme accent color.
- Each spark starts at 10 px, travels 15 px, and animates for 400 ms with ease-out timing.
- The viewport canvas is high-DPI aware and only runs animation frames while sparks are active.
- Keyboard-generated clicks and reduced-motion preferences do not trigger the effect.

## Shared motion behavior

- The effects use browser APIs, CSS, and requestAnimationFrame; no animation package was added.
- Reduced-motion preferences disable or remove easing from decorative movement while preserving the underlying navigation and theme controls.
