# DarkFun website

The website for **DarkFun**, an independent horror studio. *Smile at the dark.*

It's a few plain files. There is nothing to install and nothing to build.

| File / folder | What it is |
| --- | --- |
| `data.js` | **Your films and settings.** This is the file you'll edit most. |
| `index.html` | All the other text on the page |
| `style.css` | Colours, fonts and layout (all from the Brand Bible) |
| `script.js` | The moving parts: the opening card, the lift, the sound, the films, the form |
| `images/brand/` | Logo, Grin, Drop, icon, grain, share picture |
| `images/films/` | Frames and thumbnails from the films |

---

## 1. Put the site online (one time only)

1. On GitHub, open this repository and click **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose the branch **main** and the folder **/ (root)**. Click **Save**.
4. Wait a minute or two. The site is at **https://milad-yuna.github.io/darkfun-website/**

After that, every change you save on `main` goes live by itself within a minute or two.

---

## 2. Turn on the film submission form (one time only)

When a filmmaker fills in the form, it's emailed to **studios.darkfun@gmail.com** by a free service called FormSubmit.

1. Once the site is online, open it and send yourself a test submission.
2. FormSubmit sends studios.darkfun@gmail.com an email asking you to activate the form. If you can't find it, check Spam.
3. Click the activate button in that email. That's it. Every submission now arrives in that inbox as an email.

To send submissions to a different address, open `data.js` and change `submitTo`.
You'll need to activate once more for the new address.

---

## 3. Add a new film

Open `data.js` on GitHub and click the **pencil icon** to edit.

Every film is one line in the **catalog** list, oldest first:

```js
['047', "Funny Woman 4",  'series',   '04:37', '759',  'https://youtu.be/KYzAdklWzS0'],
```

The columns are: **number, title, label, runtime, views, YouTube link.**

1. Copy the last line and paste it underneath.
2. Change the number to the next one (`'048'`), then the title, label (`'original'`, `'series'` or `'presents'`), runtime and views.
3. For the link: on YouTube, open the film, click **Share**, then **Copy**, and paste it between the quote marks.
4. Click **Commit changes**.

That's all. The thumbnail comes from YouTube by itself, the film appears at the top of the catalog, and it shows as "New film" in the opening frame.

Keep the quote marks and commas exactly as in the other lines. If the films disappear from the page, a comma or quote mark is probably missing.

Views don't update by themselves. Change the numbers whenever you like.

**Featured films** (the six big ones at the top of Films) are in the `featured` list further down `data.js`. Each one names a film from the catalog and adds its frame, its line and its two colours (Brand Bible, page 09).

---

## 4. Swap pictures

Pictures live in `images/films/`. To replace one, upload a new picture **with exactly the same file name**:

1. Open the `images/films` folder on GitHub.
2. Click **Add file**, then **Upload files**, and drag your picture in.
3. Click **Commit changes**.

- The wide frames (`the-elevator.jpg` and so on) are best at **1600 px wide**, JPG, under about 300 KB. [squoosh.app](https://squoosh.app) can shrink them for free.
- The thumbnails in `images/films/yt/` are copies of your YouTube thumbnails. You don't need to touch them; new films load their thumbnail from YouTube automatically.
- The four frames that open the site are listed in `index.html`. Search for `hero__slide`.

---

**Team portraits** are in `images/team/` (`mohsen.jpg`, `mostafa.jpg`, `shahab.jpg`). Best size: 960 × 1200 (portrait, 4:5). Upload a new one with the same name to replace it.

---

## 5. Add video clips (the biggest "wow")

Short silent clips make the site come alive.

1. Make an MP4 clip with no sound: 10–20 seconds for the opening, 5–8 seconds for each film. Under about 5 MB each.
2. On GitHub, click **Add file → Upload files** and drag the clips in. To put them in a folder, type `clips/` before the file name, or drag a folder named `clips`.
3. In `data.js`:
   - for the opening: `heroClip: 'clips/opening.mp4',`
   - for a featured film, in the `featured` list: `clip: 'clips/the-elevator.mp4'`

---

## 6. Change other text

Open `index.html` with the pencil icon, find the sentence with **Ctrl + F** (**Cmd + F** on a Mac), and type over it.
Only change the words. Leave everything inside the `< >` signs as it is.

---

## 7. Logo files

The logo pieces in `images/brand/` were taken straight from the Brand Bible:
`wordmark.svg`, `grin.svg`, `stack.svg`, `drop.svg` and the wet Grin `wet-grin.webp`.
If your designer sends official files, upload them with the same names.
The SVGs need to be one plain shape, because the site colours them itself.

---

## What visitors will notice

- **The opening card** plays once per visit. Any click, key or scroll skips it.
- **The lift display** (bottom right) shows which floor you're on. Click it to jump to any floor.
- **Floor five:** stay still for about 25 seconds and the lift goes to floor five by itself. Nobody pressed it.
- **Sound on:** off until the visitor turns it on. A low room tone and a lift chime.
- Visitors who have reduced motion turned on in their settings get a calm version with no animation.
