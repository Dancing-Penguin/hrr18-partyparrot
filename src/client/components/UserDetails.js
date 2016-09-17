import React from 'react';
import EventList from './EventList';
//import User from '../../server/models/user.js';



export default class UserDetails extends React.Component {
  constructor() {
    super();
    this.state  = {
      userEvents: [],
      userProfile: {}
      }
    }
  render () {

    return (
        <div className="wide">
    <div className="row margin-top">
      <div className="col-md-5">
        <div className="author-box">
          <div className="row">
            <h3 className="h3-responsive text-xs-center">About Event Organizer</h3>
            <hr />
            <div className="col-xs-12" style={{"text-align":"center"}}>
              <img src="https://www.viawater.nl/files/default-user.png" alt="" className=" img-circle z-depth-2" style={{"max-width":"200px"}} />
            </div>
            <div className="col-xs-12">
              <p className="text-xs-center margin-top">
                <strong>Name:  </strong>
                {console.log('testing this.state: ', this.state.userProfile)}

              </p>



              <p>Member Since: </p>



            </div>
          </div>
        </div>
      </div>
      <EventList events = {this.state.userEvents}/>
    </div>
  </div>
    )
  }
 getUserData() {
    $.ajax({
      url: '/userEvents',
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        console.log('Hey I have the data ', data);
        this.setState({userEvents: data});
      },
      error: (err,data) => {
        console.error(err.toString());
      }
    });
    // Update User Model with User Info
    //  $.ajax({
    //   url: '/create',
    //   contentType: 'application/json',
    //   type: 'POST',
    //   data: JSON.stringify(eventObj),
    //   success: (data) => {
    //     this.setState({data: data});
    //     this.setState({submitted: "submitted"});
    //   },
    //   error: (xhr, status, err) => {
    //     this.clearForm();
    //   }
    // });
    // Get User Profile Data
    $.ajax({
      url: '/userProfile',
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({userProfile: data}, function(){
          //this.forceUpdate();
        });

        //console.log('After setState, this.state.userProfile: ', this.state.userProfile);
        this.forceUpdate();
      },
      error: (err,data) => {
        console.error(err.toString());
      }
    });
  }

  componentDidMount(){
    this.getUserData();
  }

}



