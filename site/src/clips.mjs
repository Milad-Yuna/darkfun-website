// Clips for the home page strip («قاب‌ها») and the Work page.
// To add a film: put the .mp4 (H.264, ideally under 15 MB) and a poster .jpg in site/media/clips/,
// then fill `src` and `poster` below, e.g. src: 'media/clips/nowruz.mp4'.
// rw/rh = the clip's real shape: 16/9 wide, 9/16 vertical, 21/9 cinemascope, 4/5 social.
// The first clip is the showreel: the medallion's play button opens it.
export const CLIPS = [
  { id: 'reel', src: '', poster: '', rw: 16, rh: 9, title: ['شوریل جستجو', 'Jostoju showreel'], kind: ['شوریل', 'Showreel'], scene: 'curtain' },
  { id: 'music', src: '', poster: '', rw: 9, rh: 16, title: ['موزیک‌ویدیو', 'Music video'], kind: ['کارگاه', 'Kargah'], scene: 'portrait' },
  { id: 'short', src: '', poster: '', rw: 21, rh: 9, title: ['فیلم کوتاه', 'Short film'], kind: ['پرده', 'Pardeh'], scene: 'sky' },
  { id: 'brand', src: '', poster: '', rw: 4, rh: 5, title: ['فیلم برند', 'Brand film'], kind: ['کارگاه', 'Kargah'], scene: 'curtain' },
  { id: 'ad', src: '', poster: '', rw: 16, rh: 9, title: ['فیلم تبلیغاتی', 'Commercial'], kind: ['کارگاه', 'Kargah'], scene: 'sky' },
  { id: 'social', src: '', poster: '', rw: 9, rh: 16, title: ['پست کوتاه', 'Social short'], kind: ['کارگاه', 'Kargah'], scene: 'portrait' },
];

// Where the subject sits in the hero still (0 = left edge, 1 = right edge): wide screens, then phones.
export const HERO_FOCUS = { wide: 0.5, tall: 0.18 };

// Artworks from site/art/PROMPTS.md: the file, and where its hidden lost dot (the red jewel) sits, in % of the image.
export const ART = {
  seeker: { file: 'media/art/seeker.jpg', dot: [26.3, 90.7], w: 906, h: 1125 },
};
