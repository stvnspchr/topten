var React = require('react');
var request = require('superagent');

require("./css/normalize.css");
require("./css/skeleton.css");
require("./css/topten.css");

var Input = React.createClass({
	getInitialState: function() {
		return ({
			value: '',
			id: '',
			album: '',
			artist: '',
			image: '',
			link: '',
			searching: false
		})
	},
	clearState: function() {
		this.setState({
			artist: '',
			album: '',
			image: '',
			link: '',
			comment: '',
			searching: false
		});
	},
	changeHandler: function(event) {
		if (event.target.value === '') {
			this.clearState();
			this.setState({value: ''});
		} else {
			this.setState({searching: true});
			this.setState({value: event.target.value});
			this.doRequest(event.target.value);
		}
	},
	keyDownHandler: function(event) {
		if ( event.keyCode === 13 ) {
			this.save(event);
		}
	},
	commentHandler: function(event) {
		this.setState({comment: event.target.value});
	},
	doRequest: function(val) {
		var url = 'https://api.spotify.com/v1/search?type=album&q=' + val;
		request
			.get(url)
			.end(function(err, res){
				if (err || !res.ok) {
				 	this.clearState();
				} else {
					if ( res.body.albums.items[0].id ) {
						var id = res.body.albums.items[0].id;
						this.setState({id: res.body.albums.items[0].id});
						this.getAlbum(id);
					}
				}
			}.bind(this));
	},
	getAlbum: function(id) {
		var url = 'https://api.spotify.com/v1/albums/' + id
		request
			.get(url)
			.end(function(err, res){
				if (err || !res.ok) {

				} else {
					this.setState({
						artist: res.body.artists[0].name,
						album: res.body.name,
						image: res.body.images[1].url,
						link: res.body.external_urls.spotify
					});
				}
				
			}.bind(this));
	},
	save: function(event) {
		event.preventDefault();
		var saved = {
			id: this.state.id,
			album: this.state.album,
			artist: this.state.artist,
			image: this.state.image,
			comment: this.state.comment
		}
		albums.push(saved);
		localStorage.setItem( 'albums', JSON.stringify(albums) );
		location.reload();
	},
	render: function() {
		var resultClass = this.state.searching ? '' : 'hidden';
		return (
			<div>
				<div className='row'>
          <div className='twelve columns'>
	          <input className='u-full-width' type='text' placeholder='Type an album name' onKeyDown={this.keyDownHandler} onChange={this.changeHandler} value={this.state.value} />
          </div>
        </div>
				<div className={'row ' + resultClass}>
          <div className='seven columns'>
	          <h3 className='m-a-0'>{this.state.artist}</h3>
						<h5>{this.state.album}</h5>
						<textarea className='u-full-width' placeholder='Enter a comment' onChange={this.commentHandler}></textarea>
						<div className='text-center'>
          		<a className='button button-primary' href='#' onClick={this.save}>Add Album</a>
          	</div>
          </div>
          <div className='five columns text-center'>
          	<img src={this.state.image} width='100%' />
          	<a className='button' href={this.state.link} target='_blank' ><i className='fa fa-spotify'></i> Listen</a>
          </div>
        </div>
			</div>

		);
	}
});

var ListItem = React.createClass({
	deleteCaller: function(event){
		event.preventDefault();
		this.props.deleteEvent();
	},
	render: function() {
		return (
			<div className='row'>
				<div className='two columns text-center'>
	      	<h1 className='m-a-0'>{this.props.order}.</h1>
	      	<a href='#' className='m-a-0 display-block'><i className='fa fa-bars fa-lg text-muted'></i></a>
	      	<a href='#' className='m-a-0 display-block' id={this.props.order} onClick={this.deleteCaller}><i className='fa fa-trash fa-lg text-muted'></i></a>
	      </div>
	      <div className='six columns'>
	        <h3 className='m-a-0'>{this.props.artist}</h3>
					<h5>{this.props.album}</h5>
					<p><em>{this.props.comment}</em></p>
	      </div>
	      <div className='four columns text-center'>
	      	<img src={this.props.image} width='100%'/>
	      	<a className='button' href={'https://open.spotify.com/album/' + this.props.id} target='_blank' ><i className='fa fa-spotify fa-lg'></i> Listen</a>
	      </div>
	    </div>
	  );
	}
});

var List = React.createClass({
	getInitialState: function() {
    return {items: this.props.items};
  },
  deleteItem: function(index) {
		var newItems = this.state.items;
		newItems.splice( index, 1 );
		localStorage.setItem( 'albums', JSON.stringify(newItems) );
		this.setState({
      items: newItems
    });
	},
	addItem: function() {

	},
	render: function() {
		var rows = [];

		this.state.items.forEach(function(item, index) {
			var i = index + 1;
			rows.push(
				<ListItem
					deleteEvent={this.deleteItem.bind(this, index)}
					key={item.id}
					order={i}
					id={item.id}
					album={item.album}
					artist={item.artist}
					link={item.link}
					image={item.image}
					comment={item.comment} />
			);
    }.bind(this));

		return (
			<div>
				{rows}
			</div>
		);
	}
});

var App = React.createClass({
	getInitialState: function() {
		return ({
			items: albums
		})
	},
	// componentWillReceiveProps: function(nextProps) {
	// 	var newItem = nextProps;
	// 	var albums = this.state.items;
	// 	albums.push(newItem);
	//   this.setState({
	//     items: albums
	//   });
	// },
  render: function() {
    return (
      <div className='container'>
      	<div className='row'>
          <div className='one-half column search'>
          	<h1 className='text-center'>Make Yo List</h1>
          	<Input />
          </div>
          <div className='one-half column list'>
          	<List items={this.state.items} />
          </div>
        </div>
      </div>
    );
  }
});


// var albums = [{
// 		id: '7elNFxdWSjWvtUP1gqyQGV',
// 		album: 'Goon',
// 		artist: 'Tobias Jesso Jr.',
// 		image: 'https://i.scdn.co/image/224318cd5655b6b52b82b5c2d7b367484eafee89',
// 		comment: 'A quick little comment'
// 	},{
// 		id: '1SUC3BzNqa5Kna2bZAsAK8',
// 		album: 'Strange Trails',
// 		artist: 'Lord Huron',
// 		image: 'https://i.scdn.co/image/e9c3babfd122877846e1ed2f7051d551b4c4294e',
// 		comment: 'A quick little comment'
// 	},{
// 		id: '2uRTsStAmo7Z2UwCIvuwMv',
// 		album: 'b\'lieve i\'m goin down...',
// 		artist: 'Kurt Vile',
// 		image: 'https://i.scdn.co/image/f84fc2583ae7e6d68e6fcb8276eb9a6db73dafe2',
// 		comment: 'A quick little comment'
// 	}
// ];

if (localStorage.getItem('albums') ) {
	var albums = JSON.parse( localStorage.getItem('albums') );
} else {
	var albums = [];
}


module.exports = App;