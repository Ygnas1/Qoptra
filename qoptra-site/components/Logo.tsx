/* eslint-disable @next/next/no-img-element */

// The Qoptra logo is the original artwork (public/qoptra-logo.png and public/qoptra-mark.png),
// cut out from the supplied image with a transparent background. It is designed for dark backgrounds.

const MARK_RATIO = 305 / 270; // width / height of qoptra-mark.png
const LOGO_RATIO = 1098 / 270; // width / height of qoptra-logo.png

/** The Q symbol on its own. `size` is the height in px. */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/qoptra-mark.png"
      alt=""
      aria-hidden="true"
      width={Math.round(size * MARK_RATIO)}
      height={size}
      style={{ display: "block", width: "100%", height: "auto", maxWidth: Math.round(size * MARK_RATIO) }}
    />
  );
}

/** The full logo: symbol plus "Qoptra" wordmark. `size` is the height in px. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <img
      src="/qoptra-logo.png"
      alt="Qoptra"
      width={Math.round(size * LOGO_RATIO)}
      height={size}
      style={{ display: "block", width: "auto", height: size }}
    />
  );
}
