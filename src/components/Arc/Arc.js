import React, {Component} from 'react';
import './Arc.css';
import Field from '../Field/Field';
import Platform from '../Platform/Platform';
import Levels from './levels.js';
import Ball from '../Ball/Ball';

export default class Arc extends Component{
    constructor(props){
        super(props);
        this.state.level = Levels[this.state.level].level;
        this.state.blockNumber = Levels[this.state.level - 1].blockNumber;
    }
    state = {
        startGame: false,
        level: 0,
        blockNumber: 0,
        ballPosition: {},
        platformPosition: {},
    }

    componentDidMount(){
        this.movePlatform();
    }

    movePlatform = () => {
        let arrowLeft,
            arrowRight,
            left;   
        const move = () => {
            left = +getComputedStyle(document.querySelector('.platform')).left.replace(/\D/g, '');
            (arrowLeft) ? left += -2 : left += 2;
            if (left < 75) left = 75;
            if (left > 1125) left = 1125;
            this.setState({platformPosition: {left:`${left}px`}})
            if(!this.state.startGame){
                this.setState({ballPosition: {left:`${left}px`}})
            }
            if (arrowLeft) arrowLeft = setTimeout(move, 2);
            if (arrowRight) arrowRight = setTimeout(move, 2);
        }
        document.addEventListener('keydown', (event) => {
            //джвижение платформы влево
            if (event.code === 'ArrowLeft'){
                if(!arrowLeft) arrowLeft = setTimeout(move, 2);
                clearTimeout(arrowRight);
                arrowRight = 0;
            } 
            //джвижение платформы вправо
            if (event.code === 'ArrowRight'){
                if(!arrowRight) arrowRight = setTimeout(move, 2);
                clearTimeout(arrowLeft);
                arrowLeft = 0;
            }
            if (event.code === 'Space') {
                if (!this.state.startGame){
                    this.setState({startGame: true});
                    this.game();
                }
            }
        });
        document.addEventListener('keyup', (event) => {
            if ((event.code ==='ArrowLeft') || (event.code === 'ArrowRight') || (event.code === 'Space')){
               clearTimeout(arrowLeft);
               clearTimeout(arrowRight);
               arrowLeft = 0;
               arrowRight = 0;
            } 
        });

    }

    changeBallPosition = (newLeft, newTop) => {
        this.setState({ballPosition: {left:`${newLeft}px`, top: `${newTop}px`}})
    }

    game = () => {
        let ball = document.querySelector('.ball');
        let platform = document.querySelector('.platform');
        let field = document.querySelector('.field');
        let ballTop = +getComputedStyle(ball).top.replace(/\D/g, '');;
        let ballLeft = +getComputedStyle(ball).left.replace(/\D/g, '');
        let direct = true;
        let angle = 0;
        let speed = 13;
        let tempX;
        let tempY;
        let ballXY;
        let platformXY;
        let blockNumber = this.state.blockNumber;
        let run;

        const removeBlock = (elem) => {
            if (elem.style.background == "grey"){
                elem.style.background = "green";
            } else if (elem.style.background == "orange"){
                elem.style.background = "grey";
            } else if (elem.style.background == "black"){
            } else {
                elem.remove();
                blockNumber--;
                console.log(blockNumber)
                this.setState({blockNumber: blockNumber})
                if (blockNumber === 0){
                    // clearTimeout(run);
                    // this.stopGame(this.state.level + 1, 600);
                    // return;
                    // const endStage = document.createElement('div');
                    // endStage.classList.add('endstage');
                    // endStage.innerHTML = `Поздравляем. Уровень пройден. Следующий уровень ${this.state.level + 1}`
                    // field.append(endStage);
                    const time = setTimeout(()=>{  
                        // alert("You are win!")
                        clearTimeout(run);
                        // endStage.remove();
                        this.stopGame(this.state.level + 1, 600);
                    }, 50);
                    return;
                }
            }
            if(speed > 1) speed -= 0.5;
        }

        const move = () => {
            //движение по вертикали
            (direct) ? ballTop -= 2 : ballTop += 2;
            //движение по горизонтали
            ballLeft += angle;
            this.changeBallPosition(ballLeft, ballTop);

            //проверки на столкновение с границами или блоками
            ballXY = ball.getBoundingClientRect();
            platformXY = platform.getBoundingClientRect();
            tempX = ballXY.x;
            tempY = ballXY.y;

            // верхняя граница поля
            if (ballXY.top <= field.getBoundingClientRect().top){                     
                direct = !direct;
            }

            // до нижней границы, если под шаром нет платформы
            if (ballXY.bottom >= platformXY.bottom && this.state.startGame){    
                // console.log(1);
                clearTimeout(run);
                this.stopGame(this.state.level, +getComputedStyle(platform).left.replace(/\D/g, ''));// platform.getBoundingClientRect().left);
                return;
            }

            // до платформы, если под шаром платформа, меняем направление
            if (ballXY.bottom === platformXY.top){
                if(ballXY.left + ballXY.width >= platformXY.left && ballXY.left <= platformXY.left + platformXY.width){
                    //отскок шарика
                    direct = true;
                    let sector = (ballXY.left + ballXY.width/2) - (platformXY.left+platformXY.width/2);
                    if(sector > 0){
                        if (sector < 75) angle = 1;
                        if (sector < 54) angle = 0.8;
                        if (sector < 32) angle = 0.5;
                        if (sector < 16) angle = 0.2;
                        if (sector < 2) angle = 0;
                    } else {
                        if (sector > -75) angle = -1;
                        if (sector > -54) angle = -0.8;
                        if (sector > -32) angle = -0.5;
                        if (sector > -16) angle = -0.2;
                        if (sector > -2) angle = 0;
                    }
                }
            }

            // смена направлени от стены
            if ((ballXY.left <= field.getBoundingClientRect().left) || (ballXY.left + ballXY.width >= field.getBoundingClientRect().left+field.getBoundingClientRect().width)){
                angle *= -1;
            }

            const checkBlock =(lPoint, rPoint, lCheck = null, rCheck = null) =>{
                if((lPoint.classList == "block") || (rPoint.classList == "block")){
                    // столкновение только левой точкой
                    if((lPoint.classList == "block") && (rPoint.classList != "block")){
                        if(angle){
                            (lCheck.classList != "block") ? angle *= -1 : direct *= !direct;
                        } else {
                            direct = !direct;
                        }
                        removeBlock(lPoint);
                    }
                    // столкновение только правой точкой
                    if((rPoint.classList == "block") && (lPoint.classList != "block")){ 
                        if(angle){
                            (rCheck.classList != "block") ? angle *= -1 : direct = !direct;
                        } else {
                            direct = !direct;
                        }
                        removeBlock(rPoint);
                    }
                    // столкновение всей поверхностью
                    if((lPoint.classList == "block") && (rPoint.classList == "block")){
                        direct = !direct;
                        removeBlock(lPoint);
                    }
                }
            }
            // проверка на координатах шарика
            let elemLeftPoint;
            let elemRightPoint;
            let checkLeft;
            let checkRight;
            if(direct){
                elemLeftPoint = document.elementFromPoint(tempX, tempY - 1);
                elemRightPoint = document.elementFromPoint(tempX + 15, tempY - 1);
                if(angle === 0) {    
                    checkBlock(elemLeftPoint, elemRightPoint);
                } else {
                    checkLeft = document.elementFromPoint(tempX + 1, tempY - 1);
                    checkRight = document.elementFromPoint(tempX + 14, tempY - 1);
                    checkBlock(elemLeftPoint, elemRightPoint, checkLeft, checkRight);
                    elemLeftPoint = document.elementFromPoint(tempX - 1, tempY + 7);
                    elemRightPoint = document.elementFromPoint(tempX + 16, tempY + 7);
                    checkBlock(elemLeftPoint, elemRightPoint, checkLeft, checkRight);
                }
            } else {
                elemLeftPoint = document.elementFromPoint(tempX, tempY + 16);
                elemRightPoint = document.elementFromPoint(tempX + 15, tempY + 16);
                if(angle === 0) {    
                    checkBlock(elemLeftPoint, elemRightPoint);
                } else {
                    checkLeft = document.elementFromPoint(tempX + 1, tempY + 15);
                    checkRight = document.elementFromPoint(tempX + 14, tempY + 15);
                    checkBlock(elemLeftPoint, elemRightPoint, checkLeft, checkRight);
                    elemLeftPoint = document.elementFromPoint(tempX-1, tempY + 7);
                    elemRightPoint = document.elementFromPoint(tempX + 16, tempY + 7);
                    checkBlock(elemLeftPoint, elemRightPoint, checkLeft, checkRight);
                }
            }  
            run = setTimeout(move, speed);
        }
        if(this.state.startGame) run = setTimeout(move, speed);
    }

    stopGame = (newLevel, ballLeft) =>{
        if (newLevel > this.state.level){
            this.setState({
                level: newLevel,
                startGame: false,
                blockNumber: Levels[newLevel - 1].blockNumber,
                platformPosition: {left: 600, top: 605}
            })
        }
        //начальное положение шарика
        this.setState({
            startGame: false,
            ballPosition: {left: ballLeft, top: 590},
        })
    }

    render(){
        let {blockNumber, blockColor, row, startLeft} = Levels[this.state.level - 1];
        return(
            <>
                <h1 className='title'>Arcanoid level - {this.state.level}</h1>
                <div className = 'Arcanoid'>
                    <Field 
                        start={this.state.startGame}
                        level = {this.state.level}
                        blockNumber = {blockNumber}
                        blockColor = {blockColor}
                        row = {row}
                        startLeft = {startLeft}
                    />
                    <Platform position = {this.state.platformPosition}/>
                    <Ball position = {this.state.ballPosition} />
                </div>
            </>
        )
    }
}