// Clips for the home page strip («قاب‌ها») and the Work page.
// To add a film: put the .mp4 (H.264, ideally under 15 MB) and a poster .jpg in site/media/clips/,
// then fill `src` and `poster` below, e.g. src: 'media/clips/nowruz.mp4'. A poster without a film shows as a still
// marked «به‌زودی» until the film exists.
// rw/rh = the clip's real shape: 16/9 wide, 9/16 vertical, 21/9 cinemascope, 4/5 social.
// The first clip is the showreel: the medallion's play button opens it.
export const CLIPS = [
  { id: 'reel', src: '', poster: 'media/hero/still.jpg', rw: 16, rh: 9, title: ['شوریل جستجو', 'Jostoju showreel'], kind: ['شوریل', 'Showreel'], scene: 'curtain' },
  { id: 'desert', src: '', poster: 'media/art/desert-mirror.jpg', rw: 21, rh: 9, title: ['آینهٔ صحرا', 'The Desert Mirror'], kind: ['فیلم کوتاه · پرده', 'Short film · Pardeh'], scene: 'sky' },
  { id: 'nowruz', src: '', poster: 'media/art/nowruz.jpg', rw: 16, rh: 9, title: ['نوروز', 'Nowruz'], kind: ['فیلم برند · کارگاه', 'Brand film · Kargah'], scene: 'curtain' },
  { id: 'tar', src: '', poster: 'media/art/tar.jpg', rw: 9, rh: 16, title: ['تار', 'The Tar Player'], kind: ['موزیک‌ویدیو · کارگاه', 'Music video · Kargah'], scene: 'portrait' },
];

// Where to centre the hero still (0 = left edge, 1 = right edge): the wide still on wide screens, the wide still
// on phones (no vertical version), and the vertical still on phones.
export const HERO_FOCUS = { wide: 0.5, tall: 0.18, vertical: 0.45 };

// Artworks from site/art/PROMPTS.md: the file, and where its hidden lost dot (the red jewel) sits, in % of the image.
export const ART = {
  seeker: { file: 'media/art/seeker.jpg', dot: [26.3, 90.7], w: 906, h: 1125 },
  camera: { file: 'media/art/camera.jpg', dot: [53.8, 45.8], w: 1500, h: 837 },
  simorgh: { file: 'media/art/simorgh.jpg', dot: [33.2, 66.5], w: 1500, h: 636 },
  pardeh: { file: 'media/art/pardeh.jpg', dot: [56.9, 14.2], w: 2000, h: 848 },
};
