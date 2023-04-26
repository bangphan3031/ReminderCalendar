import React from 'react';
import Day from './Day';
import _ from 'lodash';

export default function Month({ month }) {
  const weeks = _.chunk(month, 7);
  return (
    <div className="row d-flex flex-wrap">
    {month.map((row, i) => (
      <React.Fragment key={i}>
        {row.map((day, idx) => (
          <div className="border col-1" style={{width: "14.28%"}}>
            <Day day={day} key={idx} rowIdx={i} />
          </div>
        ))}
      </React.Fragment>
    ))}
    </div>
  );
}