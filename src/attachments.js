import React from 'react';
import './attachments.css';

class Attachments extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			attachments:[],
			baseMod:[],
			modOption:[],
			book:[],
			type:[],
			attachmentType:[],
			selectedType:'',
			selectedAttachType:'',
			selectedMod:'',
			selectedOption:'',
		};

		this.fetchAirtable = this.fetchbindAirtable.bind(this);

	}

	async fetchbindAirtable() {
		var Airtable = require('airtable');
		var base = new Airtable({ apiKey: 'keyBLZcTEyTyMA9Kp' }).base('appg4e4fj1qmENljB');
		let attachments = await base('Attachments').select().all()
			.then( r => {return r});
		let baseMod = await base('Base Modifiers').select().all()
			.then( r => {return r});
		let modOption = await base('Modification Options').select().all()
			.then( r => {return r});
		let book = await base('Book Reference').select().all()
			.then( r => {return r});
		let type = await base('Type').select().all()
			.then( r => {return r});
		//console.log('attachments',attachments)
		attachments.sort((a,b)=>{
					if(a.fields.Name < b.fields.Name) { return -1; }
					if(a.fields.Name > b.fields.Name) { return 1; }
					return 0;
				});
		baseMod.sort((a,b)=>{
					if(a.fields.Name < b.fields.Name) { return -1; }
					if(a.fields.Name > b.fields.Name) { return 1; }
					return 0;
				});

		modOption.sort((a,b)=>{
					if(a.fields.Name < b.fields.Name) { return -1; }
					if(a.fields.Name > b.fields.Name) { return 1; }
					return 0;
				});
		type.sort((a,b)=>{
					if(a.fields.Name < b.fields.Name) { return -1; }
					if(a.fields.Name > b.fields.Name) { return 1; }
					return 0;
				});
		this.setState({attachments, baseMod, modOption, book, type},()=>this.grabUniques(this.state.attachments));
	}

	async componentDidMount() {
			await this.fetchAirtable()
	}

	handleTypeChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({selectedType:value, selected:-1});
	}

	handleModChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({selectedMod:value, selected:-1});
	}

	handleAttachmentTypeChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({selectedAttachType:value, selected:-1});
	}

	handleOptionsModChange = (e) => {
		let value = e.target.value === "ALL" ? '' : e.target.value;
			this.setState({selectedOption:value, selected:-1});
	}

	findAtt(id){

		if(this.state.attachmentType && id){
			if(id.length > 0){
				for(var i = 0; i < id.length; i++){
					if(this.state.attachmentType.find(o => o === id[i]))
					{
						return(this.state.attachmentType.find(o => o === id[i]))
					}
				}
			}
			else{
				if(this.state.attachmentType.find(o => o === id))
					return(this.state.attachmentType.find(o => o === id))
			}
		}
	}

	findBaseMod(id){
		if(this.state.baseMod && id){

			if(id.length > 0){
				for(var i = 0; i < id.length; i++){
					if(this.state.baseMod.find(o => o.id === id[i]))
					{
						return(this.state.baseMod.find(o => o.id === id[i]).fields.Name)
					}
				}
			}
			else{
				if(this.state.baseMod.find(o => o.id === id))
					return(this.state.baseMod.find(o => o.id === id).fields.Name)
			}
		}
	}

	findKey(id, content){
		if(id && content){
			if(id.length > 0){
				for(var i = 0; i < id.length; i++){
					if(content.find(o => o.id === id[i]))
					{
						return(content.find(o => o.id === id[i]).fields.Name)
					}
				}
			}
			else{
				if(content.find(o => o.id === id))
					return(content.find(o => o.id === id).fields.Name)
			}
		}
	}

	grabUniques(data){
		 let cFinal = [];
	  for(var i = 0; i < data.length; i++){
	    let att = data[i].fields["Attachment Type"];



	    if(att){
	      att.map((o,i)=>{
	        if(!cFinal.includes(o.trim())){
	          cFinal.push(o.trim())
	        }
	        return null;
	      })
	    }

	  }
		this.setState({attachmentType:cFinal});
	}

	renderItem(obj, index){
		let selected = index === this.state.selected; // && r === this.state.row;
		if((this.state.selectedType !== '' && this.findKey(obj.fields.Type, this.state.type) !== this.state.selectedType) ||
		(this.state.selectedMod !== '' && this.findBaseMod(obj.fields["Base Modifiers: Link"]) !== this.state.selectedMod) ||
		(this.state.selectedOption !== '' && this.findKey(obj.fields["Modification Options: Link"], this.state.modOption) !== this.state.selectedOption) ||
		(this.state.selectedAttachType !== '' && this.findAtt(obj.fields["Attachment Type"]) !== this.state.selectedAttachType)
	){
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
						{obj.fields["Book"] && <div><strong>Book :</strong> {obj.fields["Book"].map((o)=>this.findKey(o, this.state.book))}</div>}
						{obj.fields["Price"] && <div><strong>Price :</strong>{obj.fields.Price}</div>}
						{obj.fields["Rarity"] && <div><strong>Rarity :</strong>{obj.fields.Rarity}</div>}
						{obj.fields["HP Required"] && <div><strong>HP Required :</strong>{obj.fields["HP Required"]}</div>}
						{obj.fields["Attachment Type"] && <div><strong>Attachment Type :</strong><ul>{obj.fields["Attachment Type"].map((o)=><li>{o}</li>)}</ul></div>}
						{obj.fields["Base Modifiers: Link"] && <div><strong>Base Modifiers: Link:</strong><ul>{obj.fields["Base Modifiers: Link"].map((o)=><li>{this.findKey(o,this.state.baseMod)}</li>)}</ul></div>}
						{obj.fields["Modification Options: Link"] && <div><strong>Modification Options: Link:</strong><ul>{obj.fields["Modification Options: Link"].map((o)=><li>{this.findKey(o,this.state.modOption)}}</li>)}</ul></div>}
						{/*obj.fields["Modification Options: Mods"] && <div><strong>Modification Options: Mods:</strong><ul>{obj.fields["Modification Options: Mods"].map((o)=><li>{o}}</li>)}</ul></div>*/}
						{obj.fields["Type"] && <div><strong>Type :</strong><ul>{obj.fields.Type.map((o)=><li>{this.findKey(o,this.state.type)}</li>)}</ul></div>}
						{obj.fields.Attachments && obj.fields.Attachments.map((o,i)=>{
							return(
									<img alt='default' className='content-image' src={o.url}/>
							);
						})}
						{obj.fields["Description"] && <div><strong>Description :</strong> {obj.fields.Description}</div>}
						<div className='close-btn' onClick={(e)=>{e.preventDefault();e.stopPropagation();this.setState({selected:-1});}}>X</div>
				</div>
			}
			</div>
		)
	}

	render(){
		if(this.state.attachments.length < 1){
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
		<div className='attachments-page'>
			<div className='att-filters'>
				<div className='att-filter'>
				<div className='att-filter'>
					<div className='att-filter-label'>Attachment Type:</div>
					{this.state.attachmentType &&
						<select value={this.state.selectedAttachType} onChange={this.handleAttachmentTypeChange}>
						<option>ALL</option>
						{this.state.attachmentType.map((o, i)=><option key={`spec ${i}`} value={o}>{o}</option>)}
					</select>
					}
				</div>
					<div className='att-filter-label'>Type:</div>
					{this.state.type &&
						<select value={this.state.selectedType} onChange={this.handleTypeChange}>
							<option>ALL</option>
							{this.state.type.map((o,i)=><option key={`camp ${i}`} value={o.fields.Name}>{o.fields.Name}</option>)}
						</select>
					}
				</div>
				<div className='att-filter'>
					<div className='att-filter-label'>Base Mod Options:</div>
					{this.state.baseMod &&
						<select value={this.state.selectedMod} onChange={this.handleModChange}>
						<option>ALL</option>
						{this.state.baseMod.map((o, i)=><option key={`spec ${i}`} value={o.fields.Name}>{o.fields.Name}</option>)}
					</select>
					}
				</div>
				<div className='att-filter'>
					<div className='att-filter-label'>Modification Options:</div>
					{this.state.modOption &&
						<select value={this.state.selectedOption} onChange={this.handleOptionsModChange}>
						<option>ALL</option>
						{this.state.modOption.map((o, i)=><option key={`spec ${i}`} value={o.fields.Name}>{o.fields.Name}</option>)}
					</select>
					}
				</div>
			</div>
			<div className='attachments-table'>
				{this.state.attachments && this.state.attachments.length > 0 && this.state.attachments.map(this.renderItem.bind(this))}
			</div>
		</div>
		);
	}
}

export default Attachments;
