/* ==========================================================
   DARKFUN — films and settings
   This is the only file you need to edit to add a film,
   change a link, or switch a setting. See README.md.
   ========================================================== */

window.DARKFUN = {

  /* Where submitted films are sent (the form on the site). */
  submitTo: 'studios.darkfun@gmail.com',

  /* The silent video in the opening frame (the showreel).
     heroClipSmall is a lighter copy for phones.
     Leave heroClip as '' to show the rotating stills instead. */
  heroClip: 'clips/opening.mp4',
  heroClipSmall: 'clips/opening-small.mp4',
  heroPoster: 'images/films/opening-poster.jpg',

  /* ---------- The catalog: every film, one line each ----------
     Columns:  number,  title,  label,  runtime,  views,  YouTube link
     label is 'original', 'series' or 'presents'.
     Numbers follow release order (oldest = 001).
     To add a film, copy the last line, paste it below and change it.
     The thumbnail is fetched from YouTube by the link. */
  catalog: [
    ['001', "Don't Run",                      'series',   '06:40', '5.5M',  'https://youtu.be/9EyYEC31TZM'],
    ['002', "Hungry Me",                      'original', '05:06', '49K',   'https://youtu.be/q_j4kB_1NuY'],
    ['003', "Do Not Look",                    'series',   '03:49', '78K',   'https://youtu.be/z8DJb6smmS8'],
    ['004', "Bloody Mary",                    'original', '04:13', '2M',    'https://youtu.be/54SpAPRfuBA'],
    ['005', "Do Not Look 2",                  'series',   '04:16', '145K',  'https://youtu.be/Zz4GyOgKObQ'],
    ['006', "Falling Illusion",               'original', '04:45', '78K',   'https://youtu.be/JtDyKWidozo'],
    ['007', "The Painting",                   'original', '06:24', '3.1M',  'https://youtu.be/jAfmmgZLqbk'],
    ['008', "PopCorn",                        'original', '10:54', '263K',  'https://youtu.be/OM9i7qJpXSY'],
    ['009', "Home",                           'original', '08:29', '63K',   'https://youtu.be/QKtx0izPPqk'],
    ['010', "The Inevitable",                 'original', '24:49', '649K',  'https://youtu.be/WtW3OxNXge0'],
    ['011', "The Elevator",                   'original', '06:15', '10M',   'https://youtu.be/BYysLg8Hzlo'],
    ['012', "The Backstabber",                'original', '05:31', '63K',   'https://youtu.be/GocfQxeQa7U'],
    ['013', "Funny Woman",                    'series',   '04:31', '753K',  'https://youtu.be/cqw_Z2RSVqQ'],
    ['014', "Funny Woman 2",                  'series',   '06:26', '693K',  'https://youtu.be/Y0QGgP4UprA'],
    ['015', "The Gift",                       'series',   '06:32', '304K',  'https://youtu.be/qDdjZIc6Gxc'],
    ['016', "Sleep Now",                      'original', '07:06', '66K',   'https://youtu.be/e2-ZzBnMRfc'],
    ['017', "The Suitcase",                   'original', '06:59', '598K',  'https://youtu.be/GfnmC8yktX0'],
    ['018', "Don't Run 2",                    'series',   '07:01', '1.3M',  'https://youtu.be/OZBtKmwIDZw'],
    ['019', "On the Inside",                  'original', '06:18', '33K',   'https://youtu.be/XmhAQT4tQwo'],
    ['020', "Ritual",                         'original', '02:15', '50K',   'https://youtu.be/9T0NbOAPob0'],
    ['021', "The Mirror",                     'series',   '03:27', '180K',  'https://youtu.be/x9Srzt6kZuI'],
    ['022', "Late Uber Ride",                 'series',   '04:18', '88K',   'https://youtu.be/bD8BOfvpCMU'],
    ['023', "Happy Birthday",                 'original', '04:38', '43K',   'https://youtu.be/ddrSTxUUPzc'],
    ['024', "The Evil Car",                   'original', '04:48', '289K',  'https://youtu.be/fd9-YL0KNYI'],
    ['025', "Mirror Midnight",                'series',   '05:30', '14K',   'https://youtu.be/uo8DOEBJNmQ'],
    ['026', "Vampiri",                        'original', '05:10', '23K',   'https://youtu.be/2ibDUqC4dz0'],
    ['027', "The Strange Case of Emily Grey", 'original', '09:32', '120K',  'https://youtu.be/RUWAbmctQco'],
    ['028', "The Walk",                       'original', '04:23', '32K',   'https://youtu.be/w6iqJeVthQM'],
    ['029', "Bugaboo",                        'original', '05:12', '548K',  'https://youtu.be/6Azpe11UdRI'],
    ['030', "Watch You",                      'series',   '08:22', '158K',  'https://youtu.be/C8oNo3RZtNM'],
    ['031', "OnlyFans",                       'series',   '03:48', '21K',   'https://youtu.be/1xHOuvuAquY'],
    ['032', "Open House",                     'original', '09:15', '11K',   'https://youtu.be/oQhRAKUZq4I'],
    ['033', "The Mirror 2",                   'series',   '05:44', '81K',   'https://youtu.be/0MUY-UFz7F8'],
    ['034', "Watch You 2",                    'series',   '06:00', '37K',   'https://youtu.be/vIPo72UVLiY'],
    ['035', "The Mirror 3",                   'series',   '04:47', '164K',  'https://youtu.be/xLdrFETUGHo'],
    ['036', "The Gift 2",                     'series',   '05:06', '101K',  'https://youtu.be/zFF2VwiEauI'],
    ['037', "Next",                           'original', '04:34', '26K',   'https://youtu.be/TYGNWZc9SKQ'],
    ['038', "Funny Woman 3",                  'series',   '04:28', '38K',   'https://youtu.be/TwhVgx9IdbA'],
    ['039', "The Chair Man",                  'original', '04:50', '51K',   'https://youtu.be/Zi3mYMC3Gyo'],
    ['040', "Watch You 3",                    'series',   '05:42', '22K',   'https://youtu.be/QR9Jlk8iW0E'],
    ['041', "The Mirror 4",                   'series',   '04:47', '33K',   'https://youtu.be/UHh29CK94gI'],
    ['042', "Don't Look in the Closet",       'original', '03:49', '8K',    'https://youtu.be/LKb_ebUSs6s'],
    ['043', "The Red Phone",                  'original', '05:36', '44K',   'https://youtu.be/Iy8WzQcDvi8'],
    ['044', "The Sister",                     'original', '04:05', '19K',   'https://youtu.be/OL6HRAozOmw'],
    ['045', "Mantis",                         'original', '11:48', '6.6K',  'https://youtu.be/YvFQGNyhEUQ'],
    ['046', "The Mirror 5",                   'series',   '03:51', '38K',   'https://youtu.be/UUwsQSqtSJw'],
    ['047', "Funny Woman 4",                  'series',   '04:37', '759',   'https://youtu.be/KYzAdklWzS0'],
  ],

  /* ---------- Featured films (shown big at the top of Films) ----------
     "film" must match a title in the catalog above.
     line      one short line in our voice
     still     a wide frame from the film (images/films/...)
     focus     which part of the frame to keep when it's cropped
     quiet / loud   the film's two colours (Brand Bible, page 09)
     clip      optional silent clip, e.g. 'clips/the-elevator.mp4'
     bug       false if the picture already has our logo on it */
  featured: [
    { film: 'The Elevator', line: 'Floor five. Nobody pressed it.', still: 'images/films/the-elevator.jpg', focus: '62% 40%', quiet: ['Lift Night', '#171729'], loud: ['Bruise', '#3F3562'], clip: '' },
    { film: "Don't Run", line: 'She told you.', still: 'images/films/dont-run.jpg', focus: '45% 60%', quiet: ['Dust', '#A19393'], loud: ['Salt Sky', '#99ACCF'], clip: '' },
    { film: 'The Painting', line: 'It was straight when you left.', still: 'images/films/the-painting.jpg', focus: '62% 40%', quiet: ['Plaster', '#CFC6AE'], loud: ['Scarf', '#5D734B'], clip: '' },
    { film: 'Bloody Mary', line: 'Say it three times. Then wait.', still: 'images/films/bloody-mary.jpg', focus: '50% 45%', quiet: ['Séance', '#171D27'], loud: ['Candle', '#C98A45'], clip: '', bug: false },
    { film: "Don't Run 2", line: 'She told you twice.', still: 'images/films/dont-run-2.jpg', focus: '50% 45%', quiet: ['Dashboard', '#272721'], loud: ['Glass', '#A9C8B8'], clip: '', bug: false },
    { film: 'Funny Woman', line: "Laughter, the killer's symphony.", still: 'images/films/funny-woman.jpg', focus: '62% 40%', quiet: ['Black Light', '#162651'], loud: ['Clown Orange', '#B04D37'], clip: '' }
  ]
};
