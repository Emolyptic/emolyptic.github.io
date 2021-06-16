import React from 'react';
import './timeline.css';
import data from './timeline.json';

class Timeline extends React.Component{
	constructor(props){
		super(props);
		this.state = {selected:-1};
	}

	selectYear(index){
		if(this.state.selected === index){
			this.setState({selected:-1});
		}
		else{
			this.setState({selected:index});
		}
	}

	render(){
		return(
		<div className='timeline-page'>
			<div className='timeline-nav'>
				{data.timeline.map(this.renderYear.bind(this))}
			</div>
			<div className='timeline-content'>
				{this.renderYearInfo()}
			</div>
		</div>
		);
	}
	renderYear(obj, index){
		let selected = this.state.selected === index;
		return(
			<div className={`year ${selected ? 'selected' : ''}`} key={`time-${index}`}>
				<div className='year-click' onClick={()=>{this.selectYear(index)}}>{obj.year}</div>
			</div>
		);
	}
	renderYearInfo(){
		if(this.state.selected === -1)
		{
			return null;
		}
		let obj = data.timeline[this.state.selected];
		console.log('obj', obj);
		return(
			<div className='year-info'>
			  {obj.tabs.map(this.renderHeader.bind(this))}
			</div>
		);
	}
	renderHeader(obj,index){
		return(
			<div className='year-content-header'>
				{obj.header}
			</div>
		);
	}
}

export default Timeline;
