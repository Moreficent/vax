import React from 'react';

import {fetch_locations} from './api';
import TopBar from './TopBar';

const Vax: React.FC<{}> = () => {
  React.useEffect(() => {
    // fetch_slots();
    fetch_locations().then((x) => console.log(x));
  });

  return (
    <>
      <TopBar />
      <h1>ho gaya</h1>
    </>
  );
};

export default Vax;
