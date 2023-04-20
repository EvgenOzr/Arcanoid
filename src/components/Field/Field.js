import React, {Component} from 'react';
import './Field.css';
// import '../Block/Block'
import Block from '../Block/Block';

export default class Field extends Component{
    constructor(props){
        super(props)
        this.blocks = [];
        this.currentLevel = 0;
        // this.createBlock();
    }

    createBlock = () =>  {
        let startLeft = this.props.startLeft;
        let newLeft = startLeft;
        let newTop = 50;
        let row = this.props.row;
        let newStyle = {};
        let rowNumber = 0;
        let blockNumber = this.props.blockNumber;
        //add block
        const addBlock = (newStartL, newRow) => {
            if (rowNumber === row){
                rowNumber = 0;
                newTop += 60;
                startLeft += newStartL;
                newLeft = startLeft;
                row += newRow;
            }
            newStyle = {left: `${newLeft}px`, top: `${newTop}px`, background: this.props.blockColor}
            this.blocks.push(
                <Block 
                    key={Math.random()}
                    style = {newStyle}
                />
            )
            newLeft += 120;
        }
        for(let i = 1; i <= blockNumber ;i++){
            switch(this.currentLevel){
                case 1:
                    addBlock(60, -1);
                    break;
                case 2:
                    addBlock(-60, 1);
                    break;
                case 3:
                    (i < 15) ? addBlock(-60, 1) : addBlock(60, -1);
                    break;
                default:
                    break;
            }
            rowNumber ++;
        }
    }

    render(){
        if(this.props.level != this.currentLevel){
            this.currentLevel = this.props.level;
            this.createBlock();
        } 
        let classes = '';
        (this.props.start) ? classes ="field noCursor": classes = "field";
        return(
            <>
                <div className = {classes}>
                    {this.blocks}
                </div>
                <div className = 'field__bottom'></div>
            </>
        )
    }

}