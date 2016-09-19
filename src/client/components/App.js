import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      categories: [],
      selectedEvent: {},
      catImg: {
        102: "https://i.ytimg.com/vi/qHbkufKpFF0/maxresdefault.jpg", //sciece+tech
        110: "http://vignette3.wikia.nocookie.net/uncyclopedia/images/9/9d/SuperFancyRestaurant.jpg/revision/latest?cb=20151230201557",//food & drink
        103: "http://mediafarmersmarket.com/wp-content/uploads/2016/08/music-colour-splash.jpg",//music
        108: "http://statplot.com/wp-content/uploads/2014/11/StatPlot-Sports-Stats.jpg",//sports
        119: "http://www.skillbus.co/wp-content/uploads/2015/06/PhotographyMasterclassImage.jpg",//hobbies & special interest
        101: "http://www.aurameir.com/wp-content/uploads/2016/08/Business_Incubation_Startup.jpg",//business
        111: "http://innevation.switchltd.netdna-cdn.com/wp-content/uploads/2016/02/Charity.jpg",//charity
        118: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Subaru_Impreza_22B_STi-Version.jpg",//auto
        115: "https://image-store.slidesharecdn.com/97183076-de60-4112-aff4-5219a7f9d888-large.jpeg"
      }
    }
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        getEvents: this.getEvents.bind(this),
        categories: this.state.categories,
        event: this.state.selectedEvent,
        handler: this.handler.bind(this)
      })
    );

    return (
      <div className="app">
        <NavBar />
        {childrenWithProps}
        <Footer />
      </div>
    )
  }

  getEvents() {
    $.ajax({
      url: '/events',
      type: 'GET',
      success: function(events) {
        this.setState({
          events: events
        })
        this.createCategoryList();
      }.bind(this)
    })
  }

createCategoryList() {
    var categories = [];
    var done = [];
    this.state.events.map(event => {
      var category_id = event.eventbrite.category_id;
      if (category_id) {
        $.ajax({
          url: `https://www.eventbriteapi.com/v3/categories/${category_id}/?token=YZO3HZ5MJZYKY6QU64H2`,
          type: 'GET',
          success: function(category) {
            if (!done.includes(category.id)) {
              categories.push({
                id: categories[categories.length-1] ? categories[categories.length-1].id + 1 : 1,
                title: category.name,
                categoryId: category.id,
                imgUrl: this.state.catImg[category_id] || 'http://www.miamiandbeaches.com/~/media/images/miamiandbeaches/plan-your-trip/gettingaround/miami-from-ft-lauderdale/causeway-miami-skyline-612x338.jpg'
              });
              done.push(category.id)
              this.setState({
                categories: categories
              })
            }
          }.bind(this)
        })
      }
    })
  }

  handler(event) {
    this.setState({
      selectedEvent: event
    });
    this.context.router.push('/EventDetails');
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}

