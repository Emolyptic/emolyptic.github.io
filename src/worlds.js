import React from 'react';
import './worlds.css';

class Worlds extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			planets:[],
			events:[],
			characters:[],
			keyLocations:[],
			selected:-1,
		};
		this.fetchAirtable = this.fetchbindAirtable.bind(this);
	}

	async fetchbindAirtable() {
		var Airtable = require('airtable');
		var base = new Airtable({ apiKey: 'keyBLZcTEyTyMA9Kp' }).base('appr65sCegFakfJQP');
	    let planets = await base('Planets').select().all()
	      .then( r => {return r});
			const characters = await base('Characters').select().all()
	      .then( r => {return r});
			const events = await base('Important Historical Events').select().all()
	      .then( r => {return r});
			const keyLocations = await base('Key Locations').select().all()
	      .then( r => {return r});

	    this.setState({planets, characters, events, keyLocations});

	  }

		async componentDidMount() {
		    await this.fetchAirtable()
	  }

	findCharacter(id){
		if(id && this.state.characters.find(o => o.id === id))
			return(this.state.characters.find(o => o.id === id).fields.Name)
	}

	findKeyLocation(id){
		if(id)
			return(this.state.keyLocations.find(o => o.id === id).fields.Name)
	}

	findEvents(id){
		if(id)
			return(this.state.events.find(o => o.id === id).fields.Name)
	}

	renderPlanet(planet, index){
		let selected = index === this.state.selected; // && r === this.state.row;


		return(
			<div className={`item ${selected ? 'selected item-selected' : ''}`} key={`character-${index}`}
			onClick={()=>
				{this.setState({selected:index})}
			}>
				<div className={`item-name ${selected ? 'item-name-selected' : ''}`}>
					{planet.fields.Name}
				</div>
				{selected &&
				<div className='item-content'>
						{planet.fields["Characters"] && <div><strong>Characters :</strong><ul>{planet.fields.Characters.map((o)=><li>{this.findCharacter(o)}</li>)}</ul></div>}
						{planet.fields["Historical Events"] && <div><strong>Events :</strong><ul>{planet.fields["Historical Events"].map((o)=><li>{this.findEvents(o)}</li>)}</ul></div>}
						{planet.fields["Key Locations"] && <div><strong>Key Locations :</strong><ul>{planet.fields["Key Locations"].map((o)=><li>{this.findKeyLocation(o)}</li>)}</ul></div>}
						{planet.fields["Notes"] && <div><strong>Notes :</strong> {planet.fields.Notes}</div>}
						{planet.fields.Attachments && planet.fields.Attachments.map((o,i)=>{
							return(
									<img alt='default' className='content-image' src={o.url}/>
							);
						})}
						<div className='close-btn' onClick={(e)=>{e.preventDefault();e.stopPropagation();this.setState({selected:-1});}}>X</div>
				</div>
			}
			</div>
		)
	}

	render(){

		if(this.state.planets.length < 1){
			return(
				<div className='page'>
					<div className='loading'>
						<img src="https://i.imgur.com/jufusiu.gif" alt="this slowpoke moves"  width="250" />
						<div>LOADING....</div>
					</div>
				</div>
			)
		}

		return(
		<div className='worlds-page'>
			<div className='planet-table'>
				{this.state.planets && this.state.planets.length > 0 && this.state.planets.map(this.renderPlanet.bind(this))}
			</div>
		</div>
		);
	}
}

export default Worlds;
