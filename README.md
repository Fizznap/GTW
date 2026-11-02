# Only You — standalone romantic story route

This folder adds a new page at **`/only-you`** to your existing Next.js project.

## Upload these files

Copy the `src/app/only-you/` folder into your repository's existing `src/app/` folder. Do not replace your existing home page, `globals.css`, or `/secret` route.

Files:
- `page.tsx` — route entry and metadata
- `layout.tsx` — imports route-scoped styles
- `OnlyYouExperience.tsx` — interactive five-chapter experience
- `only-you.css` — responsive beige/rose styling

## Dependencies

This implementation uses packages already present in the repository:
- `framer-motion`
- `lucide-react`

If either is missing, install it with `npm install framer-motion lucide-react`.

## Preview

Run `npm run dev` and visit `http://localhost:3000/only-you`.

## Personalize before publishing

1. Open `OnlyYouExperience.tsx`.
2. Edit the `chapters` array to replace the sample story with your actual five-part confession.
3. Replace the Spotify playlist ID in the iframe `src` with your own playlist or track embed ID.
4. The Spotify player requires the visitor to press Play; browsers generally block autoplay.

The page is isolated under `/only-you` and does not alter the current root page or `/secret` flow.
