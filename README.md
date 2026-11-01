# DARK FUN website

This is the website for **DARK FUN**, an independent horror film studio.

It is just a few plain files. There is nothing to install and nothing to build.

| File / folder | What it is |
| --- | --- |
| `index.html` | All the text and links on the page |
| `style.css` | Colours, fonts and layout |
| `script.js` | The phone menu and the small scroll effects |
| `images/` | Every picture on the site |

---

## 1. Put the site online (one time only)

1. On GitHub, open this repository.
2. Click **Settings**, then **Pages** (in the left menu).
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set the branch to **main** and the folder to **/ (root)**. Click **Save**.
5. Wait one or two minutes. Your site will be at:
   **https://milad-yuna.github.io/darkfun-website/**

Every time you change a file on the `main` branch, the site updates by itself within a minute or two.

---

## 2. Swap in the real pictures

Right now every picture is a dark placeholder box with its file name written on it.
To replace one, you upload your picture **with exactly the same file name**. That's all.
You do not need to touch any code.

| Picture | File name to use | Best size |
| --- | --- | --- |
| Poster: The Elevator | `the-elevator.jpg` | 800 × 1200 (tall) |
| Poster: Don't Run | `dont-run.jpg` | 800 × 1200 (tall) |
| Poster: The Mirror | `the-mirror.jpg` | 800 × 1200 (tall) |
| Poster: Funny Woman | `funny-woman.jpg` | 800 × 1200 (tall) |
| Photo: Mohsen | `team-mohsen.jpg` | 800 × 1000 (tall) |
| Photo: Mostafa | `team-mostafa.jpg` | 800 × 1000 (tall) |
| Photo: Shahab | `team-shahab.jpg` | 800 × 1000 (tall) |
| Preview picture for when someone shares the link | `share.jpg` | 1200 × 630 (wide) |

**How to upload on GitHub:**

1. Rename your picture on your computer to the exact name above (all small letters, with `.jpg` at the end).
2. On GitHub, open the `images` folder.
3. Click **Add file**, then **Upload files**.
4. Drag your picture in. Because the name is the same, it replaces the old one.
5. Click **Commit changes**.

**Tips**

- Pictures must be **.jpg**. If yours is a .png, open it at [squoosh.app](https://squoosh.app), choose **MozJPEG**, and download it. That also makes it smaller.
- Try to keep each picture under **300 KB** so the site stays fast. Squoosh can do this too.
- If your picture is a different shape, that's fine. It will be trimmed at the edges to fit the box.
- Team photos are shown in **black and white** on purpose. If you want colour, open `style.css`, find the line that says `filter: grayscale(1) contrast(1.05);` and delete it.
- `share.jpg` is already a finished DARK FUN title card, so you can leave it as it is.

---

## 3. Put in the real links

The four film cards currently open a search for that title on your YouTube channel.
It works, but it's better to link straight to each film.

1. On YouTube, open the film (or the playlist, for a series). Click **Share**, then **Copy**.
2. On GitHub, open `index.html` and click the **pencil icon** (Edit this file).
3. Press **Ctrl + F** (or **Cmd + F** on a Mac) and search for the word **REPLACE**.
4. Right under each REPLACE note there is a line with `href="..."`.
   Delete the old address between the two quote marks and paste your link in its place.
   Keep the quote marks.
5. Click **Commit changes**.

Example, before:

```html
<a class="film__link" href="https://www.youtube.com/@darkfunhorror/search?query=The%20Elevator" ...>
```

After:

```html
<a class="film__link" href="https://youtu.be/YOUR-VIDEO-CODE" ...>
```

The REPLACE notes are:

- The Elevator (YouTube video link)
- Don't Run (YouTube video link)
- The Mirror (YouTube playlist link)
- Funny Woman (YouTube playlist link)
- Chilling (optional: only if you have a direct link to your page on Chilling)
- Web address near the top of the file (only if you later move to your own domain name)

---

## 4. Change any text

Open `index.html` with the pencil icon, find the sentence with **Ctrl + F**, and type over it.
Only change the words. Leave everything inside the `< >` signs as it is.

The email address `studios.darkfun@gmail.com` appears in a few places. Search for it to find them all.

---

## 5. Change the colours (optional)

Open `style.css`. The colours are listed at the very top, for example:

```css
--red: #8f1219;   /* the one deep red accent */
```

Change the colour code, commit, and the whole site follows.
