import React, { Component } from 'react';
import Router from './Router/Router'

import {routes, parents, catchall} from './Router/routes'

class App extends Component {
  render() {
    return (
      <Router parents={parents} routes={routes} catchall={catchall} hash={false}/>
    );
  }
}

export default App;
