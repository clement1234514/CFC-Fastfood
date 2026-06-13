export default function App() {
  // 5-pointed star centered at (140, 107), outer R=46, inner r=19
  const starPoints = [
    [140, 61],         // top outer
    [151.1, 92.6],     // inner
    [184.5, 92.9],     // right outer
    [157.9, 113.2],    // inner
    [168.1, 146.2],    // lower-right outer
    [140, 127],        // inner
    [111.9, 146.2],    // lower-left outer
    [122.1, 113.2],    // inner
    [95.5, 92.9],      // left outer
    [128.9, 92.6],     // inner
  ].map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#f5f5f5" }}
    >
      <svg
        viewBox="0 0 280 300"
        width="420"
        height="450"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="badge">
            <rect x="18" y="18" width="244" height="264" rx="24" ry="24" />
          </clipPath>
        </defs>

        {/* White base */}
        <rect x="18" y="18" width="244" height="264" rx="24" ry="24" fill="white" />

        {/* Cameroon flag stripes — top 62% */}
        <rect x="18"  y="18" width="82"  height="170" fill="#2E7D2E" clipPath="url(#badge)" />
        <rect x="100" y="18" width="80"  height="170" fill="#CE1126" clipPath="url(#badge)" />
        <rect x="180" y="18" width="82"  height="170" fill="#FCDD09" clipPath="url(#badge)" />

        {/* Star */}
        <polygon points={starPoints} fill="#FCDD09" stroke="#C8A800" strokeWidth="1.5" />

        {/* Divider line */}
        <line x1="18" y1="188" x2="262" y2="188" stroke="#d0d0d0" strokeWidth="1" />

        {/* CFC lettering */}
        <text
          x="140"
          y="255"
          textAnchor="middle"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontWeight="900"
          fontSize="60"
          letterSpacing="-1"
          fill="#111111"
        >
          CFC
        </text>

        {/* Green border */}
        <rect
          x="18"
          y="18"
          width="244"
          height="264"
          rx="24"
          ry="24"
          fill="none"
          stroke="#2E7D2E"
          strokeWidth="7"
        />
      </svg>
    </div>
  );
}
