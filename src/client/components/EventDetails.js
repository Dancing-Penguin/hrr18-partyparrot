import React from 'react';


export default class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shortenedUrl: 'Promotion URL',
      linkclickscount: 0,
      username: 'username',
      eventid: this.props.event.eventbrite.id,
      promoters: []
    }
  }

  componentDidMount() {

    console.log("props:", this.props)

    console.log("eventid", this.state.eventid)

    this.getUsername();

    $('.card-text').append(this.props.event.eventbrite.description.html)
  }

  componentWillUpdate(nextProps, nextState) {
    this.bitlyLinkClicks(nextState.shortenedUrl);
  }

  render () {
    $('.modal-backdrop').remove() // Quickfix to remove the modal
    return (
      <div>
        <div className="view hm-black-light">
          <img className="img-fluid" style={{"width":"100%"}} src={this.props.event.eventbrite ? this.props.event.eventbrite.logo.url : ''} alt="" />
          <div className="mask flex-center">
            <h1 className="white-text h1-responsive">{this.props.event.name}</h1>
          </div>
        </div>

        <div className="wide">
          <div className="row margin-top">
            <div className="col-md-7">
              <div className="card card-block">
                <h4 className="card-title">Start Promoting Now!</h4>
                <hr />
                // here we should check if the is link for user in db, if so display that, if not get one
                <button className="btn btn-lg waves-effect waves-light" style={{"backgroundColor":"#ff5a00"}}>Get your <img src="img/BitlyLogo.png" className="img-responsive img-fluid" style={{"width":"60px", "display":"inline"}} /> link</button>
                <hr />
                <input className="inputId" value={this.state.shortenedUrl} />
              </div>
              <div className="card card-block">
                <h4 className="card-title">Decription</h4>
                <hr />
                <p className="card-text"> </p>
              </div>
              <div className="card card-block">
                <h4 className="card-title">Prizes</h4>
                <hr />
                <div className="row">
                  <div className="col-xs-3 col-md-2">
                    <img style={{"width":"50px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-gold_2x.png" alt="" />
                  </div>
                  <div className="col-md-4" style={{"marginTop":"20px"}}>
                    <h2 className="h2-responsive">{this.props.event.gPoint}</h2>
                  </div>
                  <div className="col-md-6" style={{"marginTop":"20px"}}>
                    <h4 className="h4-responsive">{this.props.event.gReward}</h4>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xs-2">
                    <img style={{"width":"50px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-silver_2x.png" alt="" />
                  </div>
                  <div className="col-md-4" style={{"marginTop":"20px"}}>
                    <h2 className="h2-responsive">{this.props.event.sPoint}</h2>
                  </div>
                  <div className="col-md-6" style={{"marginTop":"20px"}}>
                    <h4 className="h4-responsive">{this.props.event.sReward}</h4>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xs-2">
                    <img style={{"width":"50px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-bronze_2x.png" alt="" />
                  </div>
                  <div className="col-md-4" style={{"marginTop":"20px"}}>
                    <h2 className="h2-responsive">{this.props.event.bPoint}</h2>
                  </div>
                  <div className="col-md-6" style={{"marginTop":"20px"}}>
                    <h4 className="h4-responsive">{this.props.event.bReward}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card card-block">
                <h4 className="card-title">Leaderboard</h4>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Max Doe</td>
                        <td>{this.state.linkclickscount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="author-box">
                <div className="row">
                  <h3 className="h3-responsive text-xs-center">About Event Organizer</h3>
                  <hr />
                  <div className="col-xs-12" style={{"textAlign":"center"}}>
                    <img src={this.props.event.eventbrite ? this.props.event.eventbrite.logo.url : ''} alt="" className=" img-circle z-depth-2" style={{"maxWidth":"200px"}} />
                  </div>
                  <div className="col-xs-12">
                    <p className="text-xs-center margin-top"><strong>{this.props.event.name}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // get promoters
  getPromoters(eventid) {
    var data = {event: eventid}
    $.ajax({
      url: '/promoters',
      type: 'GET',
      contentType: 'application/json',
      data: JSON.stringify(data),

      success: (result) => {
        this.setState({promoters: data})
      },
      error: (err) => {
        console.log("err0r:", err)
      }
    })
  }


  // will need to loop through this with actual URL
  bitlyLinkClicks(linkclicksurl) {
    var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36";

    $.ajax({
      url: "https://api-ssl.bitly.com/v3/link/clicks?access_token=" + ACCESS_TOKEN + "&link=" + linkclicksurl,
      type: 'GET',

      success: (data) => {
        this.setState({linkclickscount: data.data.link_clicks});
      },
      error: (data) => {
        console.error('Failed to get link clicks. Error: ', data);
      }
    });
  }

  // get username
  getUsername() {
    $.ajax({
      url: '/secrets',
      type: 'GET',
      success: (username) => {
        // save username on state
        this.setState({username: username});
        // find bitly
        this.findBitly(this.state.eventid)

      },
      error: function(err) {
        console.log("Error: ", err)
      }
    })
  }

  // check user db if bitly already exists for this combo
  findBitly(eventid) {
    $.ajax({
      url: '/promoter/' + eventid,
      contentType: 'application/json',
      type: 'GET',
      success: (result) => {
        // if link exist
        if (result.link) {
          // set state
          this.setState({shortenedUrl: result.link})
        } else {
          // make bitly link (unique for this eventbrite URL + this userid)
          this.bitlyShortenLink(this.props.event.eventbrite.url + "?camid=" + this.state.username) // replace with userid later result.userid
        }
      },
      error: (err) => {
        console.log("err0r:", err)
      }

    })
  }

  // call to bitly to get bitly link
  bitlyShortenLink(currenturl) {
    // console.log("currenturl:", currenturl)
    var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36"; //change access tokens

    $.ajax({
      url: "https://api-ssl.bitly.com/v3/shorten?access_token=" + ACCESS_TOKEN + "&longUrl=" + currenturl + "&format=txt",
      type: 'GET',
      success: (data) => {
        var link = data.trim()
        this.setState({shortenedUrl: link});
        this.saveBitly(link)
        // console.log('data bitlyShortenLink ', data);
      },
      error: (data) => {
        console.error('Failed to get shortened URL. Error: ', data);
      }
    });
  }

  // save bitlyLink to db (called when request to make bitly is passed)
  saveBitly(bitlyLink) {
    var data = {
      event: this.state.eventid,
      link: bitlyLink
    }
    $.ajax({
      url: '/promoter',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      success: (result) => {
        console.log("success:", result)
      },
      error: (err) => {
        console.log("err0r:", err)
      }
    })
  }

  // // This doesn't seem needed
  // bitlyGetUsername() {
  //   var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36";

  //   $.ajax({
  //     url: "https://api-ssl.bitly.com/v3/user/info?access_token=" + ACCESS_TOKEN,
  //     type: 'GET',

  //     success: (data) => {
  //       this.setState({username: data.data.full_name});
  //     },
  //     error: (data) => {
  //       console.error('Failed to get bitly username. Error: ', data);
  //     }
  //   });
  // }

}