import React from 'react';
// Collapsible courtesy of react-collapsible
// github.com/glennflanagan/react-collapsible
import Collapsible from './Collapsible';

export default class Event extends React.Component {

   componentDidMount() {
    // $('.card-txt').append(this.props.event.eventbrite.description.html)
  }

  render(){
    return (
      <div>
        <hr />
        <div className="row">

          <div className="col-md-12">
            <h4>{this.props.event.eventbrite.name.text}</h4>
            <img src={this.props.event.eventbrite.logo ? this.props.event.eventbrite.logo.url : "http://130.211.52.161/tradeo-content/themes/nucleare-pro/images/no-image-box.png"}  alt="" />
          </div>

          <div style={{"margin-top":"20px"}} className="col-md-12">
            <Collapsible trigger="View Event Description">
              <div style={{"margin-top":"20px"}}>
                <p className="card-txt" dangerouslySetInnerHTML={{__html: this.props.event.eventbrite.description.html}}></p>
              </div>
            </Collapsible>
          </div>

        </div>
        <hr />
      </div>
    );
  }
}
