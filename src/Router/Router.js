import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* Modules */
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
var urlMatch = require('url-match');


export default class Router extends Component {

  static propTypes = {
    parents: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired
  };

  static childContextTypes = {
    redirect: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      routes: [],
      router: {pathProps: {}, key: -1, pathname: "/"}
    };
  }

  getChildContext() {
    return {
      redirect: this.redirect.bind(this),
    }
  }

  processRoutes (routes, parents) {
    let processedRoutes = [];
    for (let route of routes) {
      let components = {};
      let props = {};
      let middleware = [];
      if (parents && parents[route.parent]){
        components = Object.assign({}, parents[route.parent].components, route.components);
        props = Object.assign({}, parents[route.parent].props, route.props);
        middleware = [...parents[route.parent].middleware, ...route.middleware];
      } else {
        components = route.components;
        props = route.props ? route.props : {};
        middleware = route.middleware ? route.middleware : [];
      }
      let path = urlMatch.generate(route.path);
      let processedRoute = {...route, path, components, props, middleware};
      processedRoutes.push(processedRoute);
    }
    let catchallRoute = null;
    if (this.props.catchall){
      let catchall = this.props.catchall;
      let components = {};
      let props = {};
      //let middleware = [];
      if (parents && parents[catchall.parent]){
        components = Object.assign({}, parents[catchall.parent].components, catchall.components);
        props = Object.assign({}, parents[catchall.parent].props, catchall.props);
        //middleware = [...parents[catchall.parent].middleware, ...catchall.middleware];
      } else {
        components = catchall.components;
        props = catchall.props ? catchall.props : {};
        //middleware = catchall.middleware ? catchall.middleware : [];
      }
      catchallRoute = {...catchall, components, props};
    }
    this.setState({routes: processedRoutes, catchall: catchallRoute}, this.handleUrl);
  }

  componentWillMount() {
    this.processRoutes(this.props.routes, this.props.parents);
    if (this.props.hash){
      this.history = createHashHistory();
    } else {
      this.history = createBrowserHistory();
    }
    this.unlisten = this.history.listen((location, action) => {
      this.handleUrl();
    });
  }
  componentWillUnmount(){
    this.unlisten();
  }

  handleUrl () {
    let pathname = this.history.location.pathname + this.history.location.search;
    for (let [i, route] of this.state.routes.entries()) {
      let pathProps = route.path.match(pathname);
      if (pathProps){
        let {props, middleware} = this.state.routes[i]
        for (let func of middleware) {
          if (!func(this.redirect.bind(this), {pathProps, pathname, history: this.history}, props)){
            return null;
          }
        }
        this.setState({router: {pathProps: pathProps, key: i, pathname}});
        return true;
      }
    }
    this.setState({router: {pathProps: {}, key: -1, pathname}});
    return false;
  }

  redirect(href, replace){
    if (replace){
      this.history.replace(href);
    }else{
      this.history.push(href);
    }
    this.forceUpdate();
  }
  render() {
    let {pathProps, key, pathname} = this.state.router;
    if (key === -1 && this.state.catchall){
      var {components, props} = this.state.catchall;
    } else if (key === -1) {
      return(<div>Could not find a match for {pathname}, maybe include a catchall route :)</div>);
    } else {
      var {components, props} = this.state.routes[key];
    }
    /* Other render */
    let otherRender;
    if (components.other && components.other.length > 0){
      otherRender = components.other.map((component, i) => {
        return (
          <component.component {...Object.assign({}, props, component.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect,
            }}
            key={`OTHERCOMPONENT_${i}`}/>
        )
      })
    }
    return (
      <div className="router">
        {
          components.header &&
          <components.header.component {...Object.assign({}, props, components.header.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect
            }}/>
        }
        {
          components.sidebar &&
          <components.sidebar.component {...Object.assign({}, props, components.sidebar.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect
            }}/>
        }
        {
          components.notification &&
          <components.notification.component {...Object.assign({}, props, components.notification.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect
            }}/>
        }
        {
          components.body &&
          <components.body.component {...Object.assign({}, props, components.body.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect
            }}/>
        }
        {
          otherRender
        }
        {
          components.footer &&
          <components.footer.component {...Object.assign({}, props, components.footer.props)} router={{
              pathProps,
              key,
              pathname,
              redirect: this.redirect
            }}/>
        }
      </div>
    );
  }

}
