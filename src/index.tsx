import React from 'react';
import ReactDOM from 'react-dom';

import '@fontsource/roboto';

import CssBaseline from '@material-ui/core/CssBaseline';

import Vax from './Vax';

const NormalizedApp: React.FC<{}> = () => (
  <>
    <CssBaseline />
    <Vax />
  </>
);

ReactDOM.render(<NormalizedApp />, document.getElementById('app'));
