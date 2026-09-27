// Purely decorative, original SVG background: soft lotus motifs in the
// corners plus a faint temple-arch row, all in the site's own palette.
// Fixed behind the page content, low opacity, so text always stays readable.
export default function BackgroundArt() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* top-right lotus */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-10 -right-10 w-64 h-64 text-maroon-600 opacity-[0.06]"
        fill="currentColor"
      >
        <g>
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(0 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(30 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(90 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(120 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(150 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(180 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(210 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(240 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(270 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(300 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(330 100 100)" />
          <circle cx="100" cy="100" r="14" />
        </g>
      </svg>

      {/* bottom-left lotus, larger and fainter */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -bottom-16 -left-16 w-80 h-80 text-marigold-600 opacity-[0.05]"
        fill="currentColor"
      >
        <g>
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(0 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(30 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(60 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(90 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(120 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(150 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(180 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(210 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(240 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(270 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(300 100 100)" />
          <ellipse cx="100" cy="48" rx="13" ry="46" transform="rotate(330 100 100)" />
          <circle cx="100" cy="100" r="14" />
        </g>
      </svg>

      {/* faint temple-arch row along the very bottom of the page */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-16 text-maroon-700 opacity-[0.045]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 100},80 L${i * 100},40 A50,50 0 0 1 ${i * 100 + 100},40 L${i * 100 + 100},80`}
          />
        ))}
      </svg>
    </div>
  );
}