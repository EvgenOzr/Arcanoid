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
        const addBlock = (newStartL, newRow, altColor = this.props.blockColor) => {
            if (rowNumber === row){
                rowNumber = 0;
                newTop += 60;
                startLeft += newStartL;
                newLeft = startLeft;
                row += newRow;
            }
            newStyle = {left: `${newLeft}px`, top: `${newTop}px`, background: altColor}
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
                    (i < 23) ? addBlock(-60, 1) : addBlock(-60, 1, "grey");
                    break;
                case 3:
                    (i < 16) ? addBlock(-60, 1,  "#3835FF") : addBlock(60, -1);
                    break;
                case 4:
                    if (i < 10){
                        addBlock(60, -1,  "orange")
                    }else if((i => 10) && (i < 31)){
                        addBlock(60, -1)
                    }else if((i > 30) && (i < 46)){
                        addBlock(-60, 1)
                    }else if(i => 46){
                        addBlock(-60, 1,  "orange")
                    }
                    break;
                case 5:
                    (i <= 28) ? addBlock(-60, 0) : addBlock(60, 0, "grey");
                    break;
                default:
                    break;
            }
            rowNumber++;
        }
    }

    render(){
        if(this.props.level != this.currentLevel){
            this.currentLevel = this.props.level;
            this.createBlock();
        } 
        return(
            <>
                <div className = 'field'> 
                    {this.blocks}
                </div>
                <div className = 'field__bottom'></div>
            </>
        )
    }

}