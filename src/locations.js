import React from 'react';
import './locations.css';

class Locations extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			locations:[],
			planets:[],
			events:[],
			characters:[],
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
		const locations = await base('Key Locations').select().all()
			.then( r => {return r});

		this.setState({planets, characters, events, locations});
	}

	async componentDidMount() {
			await this.fetchAirtable()
	}

	findKey(id, content){
		if(id && content.find(o => o.id === id))
			return(content.find(o => o.id === id).fields.Name)
	}

	renderLocations(obj, index){
		let selected = index === this.state.selected; // && r === this.state.row;

		return(
			<div className={`item ${selected ? 'selected item-selected' : ''}`} key={`character-${index}`}
			onClick={()=>
				{this.setState({selected:index})}
			}>
				<div className={`item-name ${selected ? 'item-name-selected' : ''}`}>
					{obj.fields.Name}
				</div>
				{selected &&
				<div className='item-content'>
						{obj.fields["Characters"] && <div><strong>Characters :</strong><ul>{obj.fields.Characters.map((o)=><li>{this.findKey(o,this.state.characters)}</li>)}</ul></div>}
						{obj.fields["Historical Events"] && <div><strong>Events :</strong><ul>{obj.fields["Historical Events"].map((o)=><li>{this.findKey(o, this.state.events)}</li>)}</ul></div>}
						{obj.fields["Key Locations"] && <div><strong>Key Locations :</strong><ul>{obj.fields["Key Locations"].map((o)=><li>{this.findKey(o, this.state.locations)}</li>)}</ul></div>}
						{obj.fields["Notes"] && <div><strong>Notes :</strong> {obj.fields.Notes}</div>}
						{obj.fields.Attachments && obj.fields.Attachments.map((o,i)=>{
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
		if(this.state.locations.length < 1){
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
		<div className='locations-page'>
			<div className='locations-table'>
				{this.state.locations && this.state.locations.length > 0 && this.state.locations.map(this.renderLocations.bind(this))}
			</div>
		</div>
		);
	}
}

export default Locations;
