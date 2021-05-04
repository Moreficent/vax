import React from 'react';

import {fetch_locations} from './api';

const Vax: React.FC<{}> = () => {
  React.useEffect(() => {
    // fetch_slots();
    fetch_locations().then((x) => console.log(x));
  });

  return <h1>Ho gaya</h1>;
};

export default Vax;
