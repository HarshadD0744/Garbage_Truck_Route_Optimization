import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface DirectionalArrowProps {
  start: LatLngTuple;
  end: LatLngTuple;
  color?: string;
  weight?: number;
  order: number;
}

const DirectionalArrow: React.FC<DirectionalArrowProps> = ({
  start,
  end,
  color = 'blue',
  weight = 3,
  order
}) => {
  // Calculate arrow points
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate midpoint for the arrow
  const midPoint: LatLngTuple = [
    start[0] + dx * 0.5,
    start[1] + dy * 0.5
  ];

  return (
    <>
      <Polyline
        positions={[start, end]}
        pathOptions={{ 
          color, 
          weight,
          dashArray: '10, 10',
          lineCap: 'round'
        }}
      >
        <Tooltip permanent direction="center" className="route-step-tooltip">
          {`Step ${order}`}
        </Tooltip>
      </Polyline>
    </>
  );
};

export default DirectionalArrow;