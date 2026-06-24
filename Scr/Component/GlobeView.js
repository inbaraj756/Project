import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { DEBRIS_DATA, RISK_STYLE } from '../data/debrisData';
import '../styles/GlobeView.css';

const DEBRIS_LOCATIONS = {
  "FENGYUN 1C": { lat: 51.6, lng: 85.2, color: "red", risk: "CRITICAL" },
  "COSMOS 2251": { lat: 42.1, lng: 12.4, color: "orange", risk: "HIGH" },
  "SL-8 Rocket Body": { lat: 35.8, lng: 139.7, color: "orange", risk: "HIGH" },
  "IRIDIUM 33": { lat: 20.5, lng: -103.4, color: "yellow", risk: "MEDIUM" },
  "NOAA 16": { lat: -33.9, lng: 151.2, color: "yellow", risk: "MEDIUM" },
  "Envisat": { lat: 48.9, lng: 2.3, color: "green", risk: "LOW" },
  "Meteor 2-5": { lat: 55.8, lng: 37.6, color: "green", risk: "LOW" }
};

const GlobeView = ({ onSelectObject }) => {
  const globeRef = useRef();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredObject, setHoveredObject] = useState(null);
  const [clickedObject, setClickedObject] = useState(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      // Find the container to size accurately if possible, or fallback to window
      const container = document.querySelector('.globe-wrapper');
      if (container) {
        setDimensions({ width: container.clientWidth, height: container.clientHeight });
      } else {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    
    // Initial size
    setTimeout(handleResize, 100); 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configure Globe Auto-rotation
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = true;
      globeRef.current.pointOfView({ altitude: 2.5 });
    }
  }, []);

  // Merge data to create globe points
  const pointsData = useMemo(() => {
    return DEBRIS_DATA.map(obj => {
      const loc = DEBRIS_LOCATIONS[obj.name];
      if (!loc) return null;
      
      return {
        ...obj,
        lat: loc.lat,
        lng: loc.lng,
        color: RISK_STYLE[obj.risk]?.color || '#ffffff',
        size: obj.risk === 'CRITICAL' ? 1.5 : obj.risk === 'HIGH' ? 1.0 : 0.6
      };
    }).filter(Boolean);
  }, []);

  const handlePointClick = (point, event) => {
    // Stop globe auto-rotation when clicking
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
    }
    setClickedObject(point);
  };

  return (
    <div className="globe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Render points
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={d => d.size * 0.1} // Slightly elevate larger points
        pointRadius={d => d.size}
        pointsMerge={false} // Don't merge so we can interact with them individually
        
        // Point Interaction
        onPointHover={setHoveredObject}
        onPointClick={handlePointClick}

        // Custom HTML elements for points (makes them glow/pulse)
        htmlElementsData={pointsData}
        htmlElement={d => {
          const el = document.createElement('div');
          const isPulsing = d.risk === 'CRITICAL' || d.risk === 'HIGH';
          
          el.className = `globe-marker marker-${d.color.replace('#', '')} ${isPulsing ? 'marker-pulse' : ''}`;
          el.style.backgroundColor = d.color;
          
          // Make the hovered or clicked item larger
          if ((hoveredObject && hoveredObject.id === d.id) || (clickedObject && clickedObject.id === d.id)) {
             el.style.transform = 'scale(1.5)';
             el.style.zIndex = 10;
          }
          
          // On click logic inside the HTML element (backup to onPointClick)
          el.onclick = (e) => {
            e.stopPropagation();
            handlePointClick(d, e);
          };

          return el;
        }}
      />

      {/* Info Window Overlay (Positioned absolutely over the globe) */}
      {clickedObject && (
        <div className="globe-infowindow-overlay">
          <div className="globe-infowindow">
            <div className="globe-info-header">
              <strong>{clickedObject.name}</strong>
              <button
                className="globe-info-close"
                onClick={() => {
                  setClickedObject(null);
                  if (globeRef.current) globeRef.current.controls().autoRotate = true;
                }}
                aria-label="Close"
              >✕</button>
            </div>
            <div className="globe-info-body">
              <div>Altitude: {clickedObject.altitude}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                Risk Level:
                <span
                  className="db-risk-badge"
                  style={{
                    background: RISK_STYLE[clickedObject.risk]?.bg,
                    color: RISK_STYLE[clickedObject.risk]?.color,
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem'
                  }}
                >
                  {clickedObject.risk}
                </span>
              </div>
            </div>
            <button
              className="globe-info-btn"
              onClick={() => {
                onSelectObject(clickedObject);
                setClickedObject(null);
              }}
            >
              View in Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="globe-legend">
        <div className="legend-item"><span className="legend-dot" style={{backgroundColor: '#c62828'}}></span> Critical Risk</div>
        <div className="legend-item"><span className="legend-dot" style={{backgroundColor: '#e65100'}}></span> High Risk</div>
        <div className="legend-item"><span className="legend-dot" style={{backgroundColor: '#f57f17'}}></span> Medium Risk</div>
        <div className="legend-item"><span className="legend-dot" style={{backgroundColor: '#2e7d32'}}></span> Low Risk</div>
      </div>
    </div>
  );
};

export default GlobeView;