import React, { Component } from 'react';
import Router from './Router/Router'

import {routes, parents} from './Router/routes'

class App extends Component {
  render() {
    return (
      <Router parents={parents} routes={routes} hash={false}/>
    );
  }
}

export default App;
