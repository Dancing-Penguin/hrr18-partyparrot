import React from 'react';
import CategoryList from './CategoryList'
import Logo from './Logo'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    console.log("index.js:", this.props)
    return (
      <div className="index">
        <Logo />
        <CategoryList categoryList={this.props.categories} handler={this.props.handler} />
      </div>
    )
  }

  componentWillMount() {
    this.props.getEvents();
  }
}