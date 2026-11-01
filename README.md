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

## 3. Add a film, or change one

Open `data.js` on GitHub and click the **pencil icon** to edit.

Each film is one block, like this:

```js
{
  no: '001',
  title: 'The Elevator',
  label: 'original',          // 'original', 'series' or 'presents'
  runtime: '06:15',
  views: '10M',
  line: 'Floor five. Nobody pressed it.',
  youtube: '',                // paste the link from YouTube's Share button
  still: 'images/films/the-elevator.jpg',
  thumb: 'images/films/the-elevator-thumb.jpg',
  clip: '',
  focus: '62% 40%',
  quiet: ['Lift Night', '#171729'],
  loud: ['Bruise', '#3F3562'],
  featured: true
},
```

- **To add a film:** copy a whole block (from `{` to `},`), paste it below, and change the words.
- **YouTube link:** on YouTube, open the film, click **Share**, then **Copy**, and paste it between the quote marks after `youtube:`. For a series, paste the playlist link. With a link in place, the film plays right on the site.
- **featured: true** shows the film big at the top of the Films section. Keep it to about six.
- **quiet / loud:** each film's two colours, as the Brand Bible describes on page 09.
- Keep the quote marks and the commas. If the films disappear from the page, a comma or quote mark is probably missing.

Click **Commit changes** when you're done.

---

## 4. Swap pictures

Pictures live in `images/films/`. To replace one, upload a new picture **with exactly the same file name**:

1. Open the `images/films` folder on GitHub.
2. Click **Add file**, then **Upload files**, and drag your picture in.
3. Click **Commit changes**.

| Kind | Best size | Example name |
| --- | --- | --- |
| A wide frame from the film | 1600 px wide, JPG | `the-elevator.jpg` |
| The YouTube thumbnail | 1280 × 720, JPG | `the-elevator-thumb.jpg` |

For a new film, upload its pictures with new names, then write those names in `data.js`.
Keep pictures under about 300 KB. [squoosh.app](https://squoosh.app) can shrink them for free.

The four frames that open the site are listed in `index.html`. Search for `hero__slide`.

---

## 5. Add video clips (the biggest "wow")

Short silent clips make the site come alive.

1. Make an MP4 clip with no sound: 10–20 seconds for the opening, 5–8 seconds for each film. Under about 5 MB each.
2. On GitHub, click **Add file → Upload files** and drag the clips in. To put them in a folder, type `clips/` before the file name, or drag a folder named `clips`.
3. In `data.js`:
   - for the opening: `heroClip: 'clips/opening.mp4',`
   - for a film: `clip: 'clips/the-elevator.mp4',`

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
