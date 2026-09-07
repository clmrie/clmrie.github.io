# Clement Marie — Personal research website

**[Visit the website](https://clmrie.github.io/)** · [CV](https://clmrie.github.io/assets/clement-marie-resume.pdf)

I work on deep learning for perception, with research interests in 3D scene
representations, multimodal learning, and world models for autonomous driving.
I am an MVA master's student at ENS Paris-Saclay and a Research Engineer Intern
at CEA List, seeking PhD opportunities.

The website includes my [research interests](https://clmrie.github.io/#research),
[research experience](https://clmrie.github.io/#experience),
[selected projects](https://clmrie.github.io/#projects), and
[education](https://clmrie.github.io/#education).

## Development

A lightweight static website using HTML, CSS, and native JavaScript, hosted on
GitHub Pages. No runtime framework or external font downloads are required.

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

After changing `styles.css`, rebuild the served stylesheet:

```bash
npx --yes esbuild styles.css --minify --outfile=styles.min.css
```

Keep the Google ownership-verification file and meta tag in place when editing.
