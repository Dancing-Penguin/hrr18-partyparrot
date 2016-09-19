import React from 'react';
import Category from './Category';
import EventDetails from './EventDetails';
import { Navigation } from 'react-router';

export default class CategoryList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
  // console.log(this.props.categoryList) 
    return (
      <div className='category-list'>
        <div className="wide">
          <div className="row">
            {this.props.categoryList.map((cat) => <Category key={cat.id} category={cat} handler={this.props.handler} /> )}
          </div>
        </div>
      </div>
    )

  }
}