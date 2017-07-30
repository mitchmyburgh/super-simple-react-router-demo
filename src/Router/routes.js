import React, {Component} from 'react';
import {Link} from 'super-simple-react-router';

var store = {
  user: true
}
class Comp extends Component {
  render() {
    //console.log(this.props);
    let {title} = this.props;
    //console.log(this.props)
    return (
      <div>{title}<Link href="/sam" externalLink={false}>Sam</Link></div>
    );
  }
}

//Props precedence: component props, route props, prant props
export var parents = {
  base: {
    components: {
      header: {component: Comp, props: {title: "Header Base Parent"}}, //rendered 1st
      sidebar: {component: Comp, props: {title: "Sidebar Base Parent"}}, //redndered 2nd
      notification: {component: Comp, props: {title: "Notification Base Parent"}}, //rendered 3rd
      body: {component: Comp, props: {title: "Body Base Parent"}}, //rendered 4th
      footer: {component: Comp, props: {title: "Footer Base Parent"}},//rendered last
      other: [ //rendered 5th
        {component: Comp, props: {title: "Other 1 Base Parent"}},
        {component: Comp, props: {title: "Other 2 Base Parent"}}
      ]
    },
    middleware: [
      (redirect, path, props) => {
        return true;
      }
    ],
    props: {
      a: 1,
      b: 2,
      store
    }
  }
}
export var routes = [
  {
    path: '/',
    components: {
      body: {component: Comp, props: {title: "Body / route"}}, //replaces parent body
      other: [ //replaces all other components in teh parents
        {component: Comp, props: {title: "Other 1 / route"}}
      ]
    },
    parent: 'base',
    middleware: [ // called after parent middleware
      (redirect, router, props) => {
        //redirect('/login?test=12', false);
        return true;//return false to block access to the route
      }
    ],
    props: { //a will overwrite value from parent
      a: 3,
      c: 4,
      store,
      title: "test"
    }
  },
  {
    path: '/login',
    components: {
      body: {component: Comp, props: {title: "Body /login route"}},
    },
    parent: 'base',
    middleware: [
      (redirect, router, props) => {
        return true;
      }
    ],
    props: {
      store
    }
  },
  {
    path: '/sam/:n',
    components: {
      body: {component: Comp, props: {title: "Sam"}},
    }
  },
]

//Does not execute any middleware, not even the parents
export var catchall = {
  components: {
    body: {component: Comp, props: {title: "Catch all"}},
  },
  parent: 'base',
  props: {
    store
  }
}
