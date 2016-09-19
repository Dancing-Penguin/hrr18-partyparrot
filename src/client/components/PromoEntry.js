import React from 'react';

export default class PromoEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state  = {
      clicks: "0"
    };
  }

  componentWillMount() {
    this.bitlyLinkClicks(this.props.promo.link);
  }

  render() {
    return (
      <table className="col-xs-12" style={{"margin-bottom":"10px"}}>
        <tr>
          <td className="col-xs-12">
            <strong>{this.props.promo.eventbrite.name.text}</strong>
          </td>
        </tr>
        <tr>
          <td className="col-xs-3 noPad">Points:</td>
          <td className="col-xs-3 noPad">
            <img style={{ "width":"10px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-bronze_2x.png" alt="" />
          </td>
          <td className="col-xs-3 noPad">
            <img style={{ "width":"10px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-silver_2x.png" alt="" />
          </td>
          <td className="col-xs-3 noPad">
            <img style={{ "width":"10px"}} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-gold_2x.png" alt="" />
          </td>
        </tr>
        <tr>
          <td className="col-xs-3 noPad">{this.state.clicks}</td>
          <td className="col-xs-3 noPad">{this.props.promo.bPoint}</td>
          <td className="col-xs-3 noPad">{this.props.promo.sPoint}</td>
          <td className="col-xs-3 noPad">{this.props.promo.gPoint}</td>
        </tr>
      </table>
    );
  }

  bitlyLinkClicks(linkclicksurl) {
    var ACCESS_TOKEN = "21d527d16de4bfef19119f2b3746d795c4fe2a36";

    $.ajax({
      url: "https://api-ssl.bitly.com/v3/link/clicks?access_token=" + ACCESS_TOKEN + "&link=" + linkclicksurl,
      type: 'GET',

      success: (data) => {
        this.setState({clicks: data.data.link_clicks});
      },
      error: (data) => {
        console.error('Failed to get link clicks. Error: ', data);
      }
    });
  }

};