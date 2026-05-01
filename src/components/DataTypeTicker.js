import { useEffect, useRef, useState } from "react";
import "./DataTypeTicker.css";

const ORDERED_TYPES = ["DATA SHARE", "GIFTING", "DATA AWOOF", "SME"];

const NETWORK_CLASS_MAP = {
  MTN: "mtn",
  GLO: "glo",
  AIRTEL: "airtel",
  "9MOBILE": "9mobile",
};

function sortTypes(types) {
  return [...types].sort((a, b) => {
    const ia = ORDERED_TYPES.indexOf(a);
    const ib = ORDERED_TYPES.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  });
}

/**
 * DataTypeTicker
 *
 * Props:
 *  - networks: Array<{ label: string, types: string[] }>
 *    Each item represents a network and its available data types.
 *    Types are sorted by ORDERED_TYPES; extras are appended after.
 *
 * Example:
 *  <DataTypeTicker
 *    networks={[
 *      { label: "MTN",     types: ["DATA SHARE", "GIFTING", "DATA AWOOF", "SME"] },
 *      { label: "GLO",     types: ["DATA SHARE", "DATA AWOOF"] },
 *      { label: "AIRTEL",  types: ["GIFTING", "SME", "DATA SHARE"] },
 *      { label: "9MOBILE", types: ["DATA SHARE", "GIFTING"] },
 *    ]}
 *  />
 */
export default function DataTypeTicker({ networks = [] }) {
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(30);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (trackRef.current) {
      const totalWidth = trackRef.current.scrollWidth / 2;
      setDuration(Math.max(20, totalWidth / 80));
    }
  }, [networks]);

  return (
    <div className="ticker-wrap">
      {/* Header */}
      <div className="ticker-header">
        <span className="ticker-dot" />
        <span className="ticker-header-label">Top Available Data Packages</span>
      </div>

      {/* Scrolling Track */}
      <div className="ticker-overflow">
        <div
          ref={trackRef}
          className={`ticker-track${paused ? " paused" : ""}`}
          style={{ animationDuration: `${duration}s` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="ticker-copy">
              {networks.map((net) => {
                const sorted = sortTypes(net.types);
                const badgeKey = NETWORK_CLASS_MAP[net.label] || "default";

                return (
                  <span key={net.label} className="ticker-segment">
                    <span
                      className={`ticker-net-badge ticker-net-badge--${badgeKey}`}
                    >
                      {net.label}
                    </span>
                    {sorted.map((type) => (
                      <span key={type} className="ticker-pill">
                        {type}
                      </span>
                    ))}
                    <span className="ticker-divider" />
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
