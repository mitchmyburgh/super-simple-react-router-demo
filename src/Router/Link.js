import React, { Component } from 'react'
import PropTypes from 'prop-types';

class Link extends Component {

  static contextTypes = {
    redirect: PropTypes.func.isRequired
  };

  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    href: PropTypes.string,
    path: PropTypes.string,
    onClick: PropTypes.func,
    externalLink: PropTypes.bool,
  };

  static defaultProps = {
    externalLink: false
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event){
    const href = this.props.href

    if (this.props.onClick){
      this.props.onClick(event)
    }

    if (event.isDefaultPrevented() || event.isPropagationStopped()) return

    if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey){
      event.preventDefault()
      this.context.redirect(href, !!this.props.replace)
    }
  }

  render(){
    const props = Object.assign({}, this.props)
    delete props.externalLink
    props.href = props.href || ''
    props.onClick = this.onClick
    return <a ref="link" {...props}>{props.children}</a>
  }

}

export default Link
