# Logo

Creating the logo and exporting it alone. The drawing itself is in
`logo/logo.js` at the repository root, shared with `<oe-logo>`.

- `Logo.tsx`: the logo as a React component, also used by the posters and covers.
- `LogoExport.tsx`: the logo filling the output, for the compositions below.

## Creating

```sh
npm run studio
```

In the **Logo** folder of the Studio, edit the brand colour, initials, exponent,
label and the matrix options. All are saved back to `src/Root.tsx`.

| Id | Output |
|---|---|
| `LogoMark` | 1208×1208, frame and initials |
| `LogoFull` | 1208×1208, with the wordmark |
| `LogoAnimated` | 1208×1208, 14 s loop of the frame glow |

The background is transparent unless `background` says otherwise.

## Exporting

```sh
npm run still -- LogoFull out/logo/logo.png                  # transparent PNG
npm run still -- LogoFull out/logo/logo@2x.png --scale=2     # larger PNG
npm run render -- LogoAnimated out/logo/logo.webm            # transparent VP9
npm run logo:svg -- my-logo.json                             # SVG, static and animated
```

The JSON file of `logo:svg` holds the props of the composition (`brand`,
`logo`). With initials or a wordmark, the SVG keeps live text: Inter must be
available where it is shown. The PNG and WebM exports have no such constraint.
