import React from 'react';
import './navbutton.css';
import { NavLink } from "react-router-dom";

class NavButton extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	render(){

		return(
			<NavLink className={`nav-button`} activeClassName="selected" to={this.props.click}>
				{this.props.label}
			</NavLink>
		);
	}
}

export default NavButton;
