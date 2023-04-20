import React, {Component} from 'react';
import './Platform.css';

export default class Platform extends Component{
    render(){
        return(
            <div 
                className = 'platform'
                style = {this.props.position}
            />
        )
    }
}