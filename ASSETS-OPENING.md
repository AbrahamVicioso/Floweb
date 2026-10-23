# Opening garden asset

`public/images/opening-floral-shrub.png`: original AI-generated photographic cutout of a naturally growing flowering shrub, with blush garden roses, ivory roses, cream and dusty lilac hydrangeas, tiny pink flowers and muted olive foliage. Transparent background; no wrapping, ribbon, vase, pot, ground or tied stems.

The same asset frames both sides of the original three-card opening. The right image is mirrored inside its independently animated wrapper. This keeps one network request and preserves the real organic alpha silhouette. CSS scales the entire shrub with `object-fit: contain`; mobile moves the framing below the cards. Animation uses the Web Animations API with bounded transforms and opacity, with static reduced-motion rendering and no perpetual animation.

`public/images/opening-floral-hedge.png`: original transparent horizontal flowering hedge. User reference (shape only): https://i.pinimg.com/originals/8b/64/f2/8b64f253c0d97739edf032b3299e1406.png . Existing `opening-floral-shrub.png` supplies the photographic palette. No runtime hotlink. Low background layer uses 18% opacity and a CSS fade into ivory behind the foreground shrubs.

The existing horizontal hedge is also reused by `FloralPassage` between hero and catalog. It uses the same cached source at full opacity, with native sticky positioning and bounded scroll-driven scaling. No separate runtime image request is introduced.
