import React from 'react';
import './ShowCounts.css';

export default function ShowCounts({ bike, dock }) {
  const counts = {
    Bikes: bike !== undefined ? bike : -1,
    Docks: dock !== undefined ? dock : -1,
  };
  return (
    <div className="show-counts">
    {Object.entries(counts).map(([name, number]) => (
      <div className="count" key={name}>
        <div className="name">{name}</div>
        <div className={number === -1 ? 'number hidden' : 'number'}>{number}</div>
      </div>
    ))}
    </div>
  );
}
