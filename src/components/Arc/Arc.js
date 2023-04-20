import React, {Component} from 'react';
import './Arc.css';
import Field from '../Field/Field';
import Platform from '../Platform/Platform';
import Levels from './levels.js';
import Ball from '../Ball/Ball';

export default class Arc extends Component{
    state = {
        startGame: false,
        level: 1,
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
                this.setState({startGame: true});
                this.game();
            }
            // const moveDirection = (direction, ) => {
            //     if (event.code === direction){
            //         if(!arrowLeft) arrowLeft = setTimeout(move, 2);
            //         clearTimeout(arrowRight);
            //         arrowRight = 0;
            //     } 
            // }

        });
        document.addEventListener('keyup', (event) => {
            if ((event.code ==='ArrowLeft') || (event.code === 'ArrowRight')){
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
        let win = 0;
        let blockNumber = Levels[this.state.level - 1].blockNumber;
        let run;
        const move = () => {
            //движение по вертикали
            (direct) ? ballTop -= 2 : ballTop += 2;
            //движение по горизонтали
            ballLeft += angle;
            this.changeBallPosition(ballLeft, ballTop);

            const ballXY = ball.getBoundingClientRect();
            const platformXY = platform.getBoundingClientRect();

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
            // столкновение с блоком
            // блок
            const checkBlock =() =>{
                if((elemLeftPoint.classList == "block") || (elemRightPoint.classList == "block")){
                    // столкновение только левой точкой
                    if((elemLeftPoint.classList == "block") && (elemRightPoint.classList != "block")){
                        if(angle){
                            (checkLeft.classList != "block") ? angle *= -1 : direct *= -1;
                        } else {
                            direct = !direct;
                        }
                        removeBlock(elemLeftPoint);
                    }
                    // столкновение только правой точкой
                    if((elemRightPoint.classList == "block") && (elemLeftPoint.classList != "block")){ 
                        if(angle){
                            (checkRight.classList != "block") ? angle *= -1 : direct = !direct;
                        } else {
                            direct = !direct;
                        }
                        removeBlock(elemRightPoint);
                    }
                    // столкновение всей поверхностью
                    if((elemLeftPoint.classList == "block") && (elemRightPoint.classList == "block")){
                        direct = !direct;
                        removeBlock(elemLeftPoint);
                    }
                    function removeBlock(elem){
                        if (elem.style.background == "grey"){
                            elem.style.background = "green";
                        } else if (elem.style.background == "orange"){
                            elem.style.background = "grey";
                            elem.style.color = "white";
                        } else if (elem.style.background == "black"){
                        } else {
                            elem.remove();
                            win++;
                        }
                        if(speed > 1) speed -= 0.5;
                        // console.log(win);
                    }
                    if (win === blockNumber){
                        const time = setTimeout(()=>{
                            alert("You are win!")
                            clearTimeout(run);
                            this.stopGame(this.state.level + 1, 600)
                        }, 50);
                        return;
                    }
                }
            }
            let tempX = ballXY.x;
            let tempY = ballXY.y;
            // проверка на координатах шарика
            let elemLeftPoint;
            let elemRightPoint;
            let checkLeft;
            let checkRight;
            if(direct){
                elemLeftPoint = document.elementFromPoint(tempX, tempY - 1);
                elemRightPoint = document.elementFromPoint(tempX + 15, tempY - 1);
                if(angle === 0) {    
                    checkBlock();
                } else {
                    checkLeft = document.elementFromPoint(tempX + 1, tempY - 1);
                    checkRight = document.elementFromPoint(tempX + 14, tempY - 1);
                    checkBlock();
                    elemLeftPoint = document.elementFromPoint(tempX-1, tempY + 7);
                    elemRightPoint = document.elementFromPoint(tempX + 16, tempY + 7);
                    checkBlock();
                }
            } else {
                elemLeftPoint = document.elementFromPoint(tempX, tempY + 16);
                elemRightPoint = document.elementFromPoint(tempX + 15, tempY + 16);
                if(angle === 0) {    
                    checkBlock();
                } else {
                    checkLeft = document.elementFromPoint(tempX + 1, tempY + 15);
                    checkRight = document.elementFromPoint(tempX + 14, tempY + 15);
                    checkBlock();
                    elemLeftPoint = document.elementFromPoint(tempX-1, tempY + 7);
                    elemRightPoint = document.elementFromPoint(tempX + 16, tempY + 7);
                    checkBlock();
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
        let {blockNumber, blockColor, row, startLeft, newLeft} = Levels[this.state.level - 1];
        return(
            <>
                <h1 className='title'>Arcanoid</h1>
                <div className = 'Arcanoid'>
                    <Field 
                        start={this.state.startGame}
                        level = {this.state.level}
                        blockNumber = {blockNumber}
                        blockColor = {blockColor}
                        row = {row}
                        startLeft = {startLeft}
                        // newLeft = {newLeft}
                    />
                    <Platform position = {this.state.platformPosition}/>
                    <Ball position = {this.state.ballPosition} />
                </div>
            </>
        )
    }
}