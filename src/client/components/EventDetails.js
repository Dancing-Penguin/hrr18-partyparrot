import React from 'react';


export default class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shortenedUrl: 'Promotion URL',
      linkclickscount: 0,
      username: 'username',
      eventid: this.props.event.eventbrite.id,
      promoters: [],
      formatPromoters: [],
      zero: 0
    }
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
                <button className="btn btn-lg waves-effect waves-light" style={{"backgroundColor":"#ff5a00"}}>Promote with <img src="img/BitlyLogo.png" className="img-responsive img-fluid" style={{"width":"60px", "display":"inline"}} /></button>
                <hr />
                <input className="inputId bitlybox" id="bitlyurl" value={this.state.shortenedUrl} readOnly/>
                <button className="copyBtn bitlybox" data-clipboard-target="#bitlyurl">
                    <img id="copyimg" src="http://leanconf.co.uk/assets/clippy-686d81e030899b477865d67a01fe34e83d8e68aa8da91a59205ad3e901a3ec71.svg" />
                </button>
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
                      {this.state.formatPromoters.map((promoter) => 
                        <tr key={++this.state.zero}>
                          <td>{promoter.fullName}</td><td>{promoter.clickCount}</td>
                        </tr>)}
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

  // get promoters & pass over to formatBitlyClicks
  getPromoters(eventid) {
    $.ajax({
      url: '/promoters/' + eventid,
      type: 'GET',
      contentType: 'application/json',

      success: (result) => {
        this.setState({promoters: result})
        console.log("promoters:", this.state.promoters)
        this.formatBitlyClicks(result)
      },
      error: (err) => {
        console.log("err0r:", err)
      }
    })
  }

  // prep to add bitly clicks to promoters data array of objects
  formatBitlyClicks(promoters) {
    promoters.map((promoter) => {
      this.addBitlyClicks(promoter)
    })
  }

  addBitlyClicks(promoter) {
    var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36";

    console.log("rightbefore ajax call", this.state.zero, "formatpromo", this.state.formatPromoters)

    $.ajax({
      url: "https://api-ssl.bitly.com/v3/link/clicks?access_token=" + ACCESS_TOKEN + "&link=" + promoter.link,
      type: 'GET',

      success: (data) => {
        promoter.clickCount = data.data.link_clicks
        console.log("formatpromoters:", this.state.formatPromoters)
        var newFormatPromoters = this.state.formatPromoters.push(promoter)
        this.setState({formatPromoters, newFormatPromoters})
        console.log("formatPromoters:", this.state.formatPromoters)
      },
      error: (data) => {
        console.error('Failed to get link clicks. Error: ', data);
      }
    });
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
          this.setState({userid: result.userid})
          // make bitly link (unique for this eventbrite URL + this userid)
          this.bitlyShortenLink(this.props.event.eventbrite.url + "?camid=" + result.userid)
        }
      },
      error: (err) => {
        console.log("err0r:", err)
      }

    })
  }

  // call to bitly to get bitly link
  bitlyShortenLink(currenturl) {

    var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36"; //change access tokens

    $.ajax({
      url: "https://api-ssl.bitly.com/v3/shorten?access_token=" + ACCESS_TOKEN + "&longUrl=" + currenturl + "&format=txt",
      type: 'GET',
      success: (data) => {
        var link = data.trim()
        this.setState({shortenedUrl: link});
        this.saveBitly(link)
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

  componentWillMount() {

    this.getUsername();
    this.getPromoters(this.state.eventid)

  }

  componentDidMount() {

    new Clipboard('.copyBtn')

    $('.card-text').append(this.props.event.eventbrite.description.html)
  }

  componentWillUpdate(nextProps, nextState) {
    // below doesn't actually work, but gives me a re-render without looping infinitely
    this.bitlyLinkClicks(nextState.shortenedUrl);
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