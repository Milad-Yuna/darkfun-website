/* ==========================================================
   DARKFUN — films and settings
   This is the only file you need to edit to add a film,
   change a link, or switch a setting. See README.md.
   ========================================================== */

window.DARKFUN = {

  /* Where submitted films are sent (the form on the site). */
  submitTo: 'studios.darkfun@gmail.com',

  /* Optional: a short silent video for the opening frame.
     Put the file in the "clips" folder and write its path here,
     for example: 'clips/opening.mp4'. Leave '' to use the stills. */
  heroClip: '',

  /* ---------- Films ----------
     One block per film. Copy a block to add a film.

     no        catalog number, e.g. '001'  (leave '' if not set yet)
     title     film title
     label     'original', 'series' or 'presents'
     runtime   e.g. '06:15'
     views     e.g. '10M'
     line      one short line in our voice
     youtube   the video link from YouTube's Share button
               (or a playlist link for a series). '' = not added yet
     still     a wide frame from the film (images/films/...)
     thumb     the YouTube thumbnail (images/films/...)
     clip      optional silent clip, e.g. 'clips/the-elevator.mp4'
     focus     which part of the still to keep when cropping
     quiet / loud   the film's two colours (Brand Bible, page 09)
     featured  true = shown big at the top of Films
  */
  films: [
    {
      no: '001',
      title: 'The Elevator',
      label: 'original',
      runtime: '06:15',
      views: '10M',
      line: 'Floor five. Nobody pressed it.',
      youtube: '',
      still: 'images/films/the-elevator.jpg',
      thumb: 'images/films/the-elevator-thumb.jpg',
      clip: '',
      focus: '62% 40%',
      quiet: ['Lift Night', '#171729'],
      loud: ['Bruise', '#3F3562'],
      featured: true
    },
    {
      no: '',
      title: "Don't Run",
      label: 'original',
      runtime: '06:40',
      views: '5.5M',
      line: 'She told you.',
      youtube: '',
      still: 'images/films/dont-run.jpg',
      thumb: 'images/films/dont-run-thumb.jpg',
      clip: '',
      focus: '45% 60%',
      quiet: ['Dust', '#A19393'],
      loud: ['Salt Sky', '#99ACCF'],
      featured: true
    },
    {
      no: '',
      title: 'The Painting',
      label: 'original',
      runtime: '06:24',
      views: '3.1M',
      line: 'It was straight when you left.',
      youtube: '',
      still: 'images/films/the-painting.jpg',
      thumb: 'images/films/the-painting-thumb.jpg',
      clip: '',
      focus: '50% 35%',
      quiet: ['Plaster', '#CFC6AE'],
      loud: ['Scarf', '#5D734B'],
      featured: true
    },
    {
      no: '',
      title: 'Bloody Mary',
      label: 'original',
      runtime: '04:13',
      views: '2M',
      line: 'Say it three times. Then wait.',
      youtube: '',
      still: 'images/films/bloody-mary-thumb.jpg',
      thumb: 'images/films/bloody-mary-thumb.jpg',
      clip: '',
      focus: '50% 45%',
      quiet: ['Séance', '#171D27'],
      loud: ['Candle', '#C98A45'],
      featured: true
    },
    {
      no: '',
      title: "Don't Run 2",
      label: 'original',
      runtime: '07:01',
      views: '1.3M',
      line: 'She told you twice.',
      youtube: '',
      still: 'images/films/dont-run-2-thumb.jpg',
      thumb: 'images/films/dont-run-2-thumb.jpg',
      clip: '',
      focus: '50% 45%',
      quiet: ['Dashboard', '#272721'],
      loud: ['Glass', '#A9C8B8'],
      featured: true
    },
    {
      no: '',
      title: 'Funny Woman',
      label: 'series',
      runtime: '04:31',
      views: '753K',
      line: "Laughter, the killer's symphony.",
      youtube: '',
      still: 'images/films/funny-woman.jpg',
      thumb: 'images/films/funny-woman-thumb.jpg',
      clip: '',
      focus: '55% 35%',
      quiet: ['Black Light', '#162651'],
      loud: ['Clown Orange', '#B04D37'],
      featured: true
    },
    {
      no: '',
      title: 'The Mirror',
      label: 'series',
      runtime: '',
      views: '',
      line: 'It looks back.',
      youtube: '',
      still: '',
      thumb: '',
      clip: '',
      focus: '50% 50%',
      quiet: ['Grave', '#151A15'],
      loud: ['Moss', '#5E7149'],
      featured: false
    }
  ]
};
