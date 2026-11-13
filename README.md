# ✨ Winx Club: Fairies of Alfea

An unofficial fan tribute website for the six Winx Club fairies (Seasons 1 to 3): **Bloom, Stella, Musa, Tecna, Flora and Layla**. Built with plain HTML, CSS and JavaScript, using GSAP ScrollTrigger for the scroll animations.

**Live site:** yaya

## Features

- **Edgy homepage:** glitch-effect logo, a slanted comic-panel collage that slides in, mouse parallax, and a shutter-style exit on scroll.
- **Black to rainbow transition:** the background gradient rises from black into a pastel rainbow while the "Fairies of Alfea" title and a short intro to the series appear.
- **Clickable fairies:** all six fairies rise in a row, and clicking one scrolls smoothly to her page.
- **A page per fairy:** backgrounds blend into each other as you scroll, and each fairy wings in with an animated name and hand-drawn arrows.
- **About Me and My Powers:** frosted-glass panels slide in with each fairy's story, home world, partner and powers.
- **Magic sound with mute:** an original ambient soundtrack generated live in the browser with the Web Audio API (no audio files, so no copyright or royalty issues). The speaker icon toggles it on and off.
- **Extras:** cursor glitter, side navigation dots, mobile layout, reduced-motion support, and legal pages (Copyright, Disclaimer, Privacy, Terms).

## Tech stack

- HTML5, CSS3, vanilla JavaScript
- [GSAP](https://gsap.com) + ScrollTrigger + ScrollToPlugin (included locally in `js/vendor`)
- Web Audio API for the generated sound
- Google Fonts (Great Vibes, Delius Swash Caps, Quicksand)

## Run it locally

No install or build step is needed.

1. Download or clone this repository.
2. Open the folder in VS Code.
3. Install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.
4. Click anywhere once so the browser allows sound, then scroll.

You can also open `index.html` directly in a browser.

## Project structure

```
index.html          page skeleton
css/style.css       all styles
js/data.js          your name, email, fairy text, colours, legal text
js/app.js           animations, navigation, panels, glitter
js/sound.js         generated background music
js/vendor/          GSAP files
assets/             cleaned artwork (transparent backgrounds) and backgrounds
```

## Legal

This is an unofficial, non-commercial fan project. It is not affiliated with, endorsed by or sponsored by Rainbow S.r.l., Nickelodeon, Paramount or Netflix.

Winx Club™ and all related characters, names, logos and artwork belong to **Rainbow S.r.l.** and its licensors. No ownership of them is claimed. If you are a rights holder and want something changed or removed, please contact the address listed on the site's Disclaimer page.

The website's own design, layout, animations, code and generated music are © 2026 DimplePawa.
