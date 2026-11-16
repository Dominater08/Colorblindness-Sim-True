# CVD Camera

Live colour vision deficiency simulation on your phone camera. Each camera frame goes through a WebGL shader that converts sRGB to linear RGB, multiplies by a Machado et al. (2009) matrix, and converts back to sRGB.

- Types: protanomaly, deuteranomaly, tritanomaly. Severity runs from 0.1 to 1.0, and 1.0 means dichromacy.
- Default: deuteranomaly at 0.6.
- The side-by-side toggle shows the original next to the simulation. It stacks top and bottom in portrait and sits left and right in landscape.
- Tap the camera view to hide or show the controls.
- Works offline after the first visit and can be added to the home screen.
- No dependencies and no build step.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: UI, WebGL shader and the Machado matrix tables |
| `sw.js` | Service worker that caches the app for offline use |
| `manifest.webmanifest` | Web app manifest for home-screen install |
| `` | App icons, including the iOS `apple-touch-icon.png` |

## Host it on GitHub Pages

1. Create a new **public** repository on github.com, for example `cvd-camera`.
2. Upload all the files to the repository root and keep the `` folder. On the website, use **Add file › Upload files**, drag everything in, then click **Commit changes**.
3. Go to **Settings › Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: `main`** and **Folder: `/ (root)`**, then click **Save**.
4. Wait about a minute. The site will be at `https://<your-username>.github.io/cvd-camera/`.

All paths are relative, so the app works under a repository sub-path. GitHub Pages serves over HTTPS, which the camera requires.

## Install on iPhone

1. Open the Pages URL in **Safari**.
2. Tap **Start camera** and allow camera access.
3. Tap **Share › Add to Home Screen**.
4. Open it from the home screen. It runs full-screen and works offline once it has loaded online one time.

iOS may ask for camera permission again each time you launch the home-screen version. That is normal Safari PWA behaviour. If access was denied, go to **Settings › Safari › Camera** and choose *Ask* or *Allow*.

## Updating

After you change any file, increase `VERSION` in `sw.js` (for example to `'cvdcam-v2'`) and commit. Phones download the new version the next time they open the app online, and it shows on the following launch.

## Testing locally

The camera needs a secure context. `localhost` counts as one:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

To test on a phone, use the GitHub Pages URL, because a LAN IP over plain HTTP won't get camera access.

## Reference

Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F. (2009). *A Physiologically-based Model for Simulation of Color Vision Deficiency.* IEEE TVCG 15(6), 1291–1298. The matrices are Table 1 from the authors' page:
https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
