import React from 'react';
import './items.css';

class Items extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			locations:[],
			planets:[],
			events:[],
			items:[],
			characters:[],
			campaign:'',
			selected:-1,
			campaignData: null,
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
		const items = await base('Key Items').select().all()
			.then( r => {return r});
		const events = await base('Important Historical Events').select().all()
			.then( r => {return r});
		const locations = await base('Key Locations').select().all()
			.then( r => {return r});
		const campaignData = await base('Campaign').select().all()
      .then( r => {return r});

		this.setState({planets, characters, events, locations, campaignData, items});
	}

	async componentDidMount() {
			await this.fetchAirtable()
	}

	handleCampaignChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;

			this.setState({campaign:value, selected:-1});
	}

	findKey(id, content){

		if(id && content.find(o => o.id === id))
			return(content.find(o => o.id === id).fields.Name)
	}

	renderItem(obj, index){
		let selected = index === this.state.selected; // && r === this.state.row;

		if(this.state.campaign !== '' && this.findKey(obj.fields.Campaign[0], this.state.campaignData) !== this.state.campaign){
				return(null)
		}

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
						{obj.fields["Campaign"] && <div><strong>Campaign :</strong>{obj.fields["Campaign"].map((o)=>this.findKey(o, this.state.campaignData))}</div>}
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
		if(this.state.items.length < 1){
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
		<div className='page'>
			<div className='char-filters'>
				<div className='char-filter'>
					<div className='char-filter-label'>Campaign:</div>
					{this.state.campaignData &&
						<select value={this.state.campaign} onChange={this.handleCampaignChange}>
							<option>ALL</option>
							{this.state.campaignData.map((o,i)=><option key={`camp ${i}`} value={o.fields.Name}>{o.fields.Name}</option>)}
						</select>
					}
				</div>
			</div>
			<div className='items-table'>
				{this.state.items && this.state.items.length > 0 && this.state.items.map(this.renderItem.bind(this))}
			</div>
		</div>
		);
	}
}

export default Items;
