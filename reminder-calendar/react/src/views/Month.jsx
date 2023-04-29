import React from 'react';
import Day from './Day';

export default function Month({ month }) {
  return (
    <div className="row d-flex flex-wrap">
    {month.map((row, i) => (
      <React.Fragment key={i}>
        {row.map((day, idx) => (
          <div className="border col-1" style={{width: "14.28%"}} key={idx}>
            <Day day={day} rowIdx={i} />
          </div>
        ))}
      </React.Fragment>
    ))}
    </div>
  );
}