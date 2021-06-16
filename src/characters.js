import React from 'react';
import './characters.css';

class Character extends React.Component{
	constructor(props){
		super(props);

		//data.chunk_inefficient(4);
		this.elements = [];
		this.state = {
			selected: -1,
			maxHeight:0,
			species:'',
			campaign:'',
			airData: [],
			campaignData: null,
			speciesData: null,
			campaignList: null,
			speciesList: null,
		};

		this.fetchAirtable = this.fetchbindAirtable.bind(this);
	}

	async fetchbindAirtable() {
		var Airtable = require('airtable');
		var base = new Airtable({ apiKey: 'keyBLZcTEyTyMA9Kp' }).base('appr65sCegFakfJQP');
	    let airData = await base('Characters').select().all()
	      .then( r => {return r});
			const campaignData = await base('Campaign').select().all()
	      .then( r => {return r});
			const speciesData = await base('Species').select().all()
	      .then( r => {return r});

			airData.sort((a,b)=>{
						if(a.fields.Name < b.fields.Name) { return -1; }
				    if(a.fields.Name > b.fields.Name) { return 1; }
				    return 0;
					});
	    this.setState({airData, campaignData, speciesData},()=>{
			});

	  }

		async componentDidMount() {
		    await this.fetchAirtable()
	  }


	findSpecies(id){
		if(id)
			return(this.state.speciesData.find(o => o.id === id[0]).fields.Name)
	}

	findCampaign(id){
		if(id)
			return(this.state.campaignData.find(o => o.id === id[0]).fields.Name)
	}

	handleCampaignChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({campaign:value, selected:-1});
	}

	handleSpeciesChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({species:value, selected:-1});
	}

	renderCharacter(character, index){
		let selected = index === this.state.selected; // && r === this.state.row;
		if((this.state.species !== '' && this.findSpecies(character.fields.Species) !== this.state.species) ||
		(this.state.campaign !== '' && this.findCampaign(character.fields.Campaign) !== this.state.campaign)){
				return(null)
		}
		return(
			<div className={`item ${selected ? 'selected item-selected' : ''}`} key={`character-${index}`}
			onClick={()=>
				{this.setState({selected:index})}
			}>
				<div className={`item-name ${selected ? 'item-name-selected' : ''}`}>
					{character.fields.Name}
					{selected &&
						<div>
						{character.fields.Attachments && character.fields.Attachments.map((o,i)=>{
							return(
									<img alt="default" className='content-image' src={o.url}/>
							);
						})}
						</div>
					}
				</div>
				{selected &&
				<div className='item-content'>
						<div><strong>Campaign</strong> : {this.findCampaign(character.fields.Campaign)}</div>
						<div><strong>Occupation</strong> : {character.fields.Occupation}</div>
						<div><strong>Species :</strong> {this.findSpecies(character.fields.Species)}</div>
						<div><strong>Notes :</strong> {character.fields["Public Notes / Description"]}</div>

						<div className='close-btn' onClick={(e)=>{e.preventDefault();e.stopPropagation();this.setState({selected:-1});}}>X</div>
				</div>
			}

			</div>
		)
	}

	render(){
		if(this.state.airData.length < 1){
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
				<div className='char-filter'>
					<div className='char-filter-label'>Species:</div>
					{this.state.speciesData &&
						<select value={this.state.species} onChange={this.handleSpeciesChange}>
						<option>ALL</option>
						{this.state.speciesData.map((o, i)=><option key={`spec ${i}`} value={o.fields.Name}>{o.fields.Name}</option>)}
					</select>
					}
				</div>
			</div>
			<div className='char-table'>
				{this.state.airData && this.state.airData.length > 0 && this.state.airData.map(this.renderCharacter.bind(this))}
			</div>
		</div>
		);
	}
}

export default Character;
