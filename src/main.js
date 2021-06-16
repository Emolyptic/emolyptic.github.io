import React from 'react';
import './main.css';
import{
	HashRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom"
import Home from './home.js';
import NPC from './npc.js';
import Worlds from './worlds.js';
import NavButton from './navbutton.js';
import Characters from './characters.js';
import Locations from './locations.js';
import Items from './items.js';
import Events from './events.js';
import Attachments from './attachments.js';
import Ships from './ships.js';


class Main extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			page:0
		}
	}
  componentDidUpdate(prevProps, prevState){
	}
	render(){
		let page = this.state.page;
		return(
		<Router>
		<div className='main-page'>
			<div className='header'> Star Wars RPG</div>
			<div className='nav'>
					<NavButton label={"Home"} 					selected={this.state.page === 0} click={"/home"}/>
					<NavButton label={"Characters"} 		selected={this.state.page === 1} click={"/characters"}/>
					<NavButton label={"Worlds"} 				selected={this.state.page === 2} click={"/worlds"}/>
					<NavButton label={"Key Locations"}	selected={this.state.page === 3} click={"/locations"}/>
					<NavButton label={"Events"} 				selected={this.state.page === 4} click={"/events"}/>
					<NavButton label={"Ships"} 					selected={this.state.page === 5} click={"/ships"}/>
					<NavButton label={"Items"} 					selected={this.state.page === 6} click={"/items"}/>
					<NavButton label={"Attachments"}		selected={this.state.page === 7} click={"/attachments"}/>
			</div>
			<div className='section-body'>
				<Switch>
					<Route 	path="/home" exact
						render={(props) => (
							<Home/>
						)}
					/>
					<Route 	path="/characters" exact
						render={(props) => (
							<Characters/>
						)}
					/>
					<Route 	path="/worlds" exact
						render={(props) => (
							<Worlds/>
						)}
					/>
					<Route 	path="/locations" exact
						render={(props) => (
							<Locations/>
						)}
					/>
					<Route 	path="/events" exact
						render={(props) => (
							<Events/>
						)}
					/>
					<Route 	path="/ships" exact
						render={(props) => (
							<Ships/>
						)}
					/>
					<Route 	path="/items" exact
						render={(props) => (
							<Items/>
						)}
					/>
					<Route 	path="/attachments" exact
						render={(props) => (
							<Attachments/>
						)}
					/>
				</Switch>
			</div>
		</div>
		</Router>
		);
	}
}

export default Main;
