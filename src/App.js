/* eslint-disable react-hooks/exhaustive-deps */
import {useState,useEffect} from 'react';
import './App.css'
import { ScoreBoard } from './components/ScoreBoard';

import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';

const width = 8;
const candyColors = [
  blueCandy,greenCandy,orangeCandy,purpleCandy,redCandy,yellowCandy
]

const App = () => {

  const [currentColorArrangement,setCurrentColorArrangement] = useState();
  const [squareBeingDragged,setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced,setSquareBeingReplaced] = useState(null);
  const [score,setScore] = useState(0);

  //
  //check for matches in colums of three
  //
  const checkForColumnsOfThree = () =>{
    for(let i = 0;i<=47;i++){
      const columnOfThree = [i,i+width,i+width*2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
        setScore((score)=>score+3);
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true;
      }
    }
  }

  //
  //check for matches in colums of four
  //
  const checkForColumnsOfFour = () =>{
    for(let i = 0;i<=39;i++){
      const columnOfFour = [i,i+width,i+width*2,i+width*3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
        setScore((score)=>score+4);
        columnOfFour.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
  }

//
//check for matches in row of three
//

  const checkForRowsOfThree = () =>{
    for(let i = 0;i<64;i++){
      const rowsOfThree = [i,i+1,i+2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6,7,14,15,22,23,38,39,46,47,54,55,63,64];
      const isBlank = currentColorArrangement[i] === blank;
      if(notValid.includes(i)) continue

      if(rowsOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
        setScore((score)=>score+3);
        rowsOfThree.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
  }

  //
  //check for matches in rows of four
  //

  const checkForRowsOfFour = () =>{
    for(let i = 0;i<64;i++){
      const rowsOfFour = [i,i+1,i+2,i+3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5,6,7,13.14,15,21,22,23,37,38,39,45,46,47,53,54,55,62,63,64];
      const isBlank = currentColorArrangement[i] === blank;
      if(notValid.includes(i)) continue

      if(rowsOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank )){
        setScore((score)=>score+4);
        rowsOfFour.forEach(square => currentColorArrangement[square] = blank);
        return true;
      }
    }
  }

  //
  //drop tiles above into empty squares below when a match has been found and the square cleared
  //
  const moveIntoSquareBelow = () =>{
    for(let i = 0; i< 55;i++){
      const firstRow = [0,1,2,3,4,5,6,7];
      const isFirstRow = firstRow.includes(i);

      if(isFirstRow && currentColorArrangement[i] === blank){
        let randomColor = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomColor];
      }

      if((currentColorArrangement[i + width]) === blank){
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  }

  //drag drop

  const dragDrop = (e) =>{
    setSquareBeingReplaced(e.target)
    
  }

  //drag end

  const dragEnd = (e) =>{
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId + 1,
      squareBeingDraggedId+width,
      squareBeingDraggedId-width 
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnsOfFour();
    const isARowOfFour =checkForRowsOfFour();
    const isAColumnOfThree =checkForColumnsOfThree();
    const isARowOfThree =checkForRowsOfThree();

    if(squareBeingReplacedId && validMove && (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)){
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    }else{
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  }

  //dragstart

  const dragStart = (e) =>{
    setSquareBeingDragged(e.target);
  }


  //
  //create the game board
  //
  const createBoard = () =>{
    const randomColorArrangement = [];
    for(let i = 0; i < 64;i++){
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
       randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(()=>{
    createBoard();
  },[]);

  useEffect(()=>{
    const timer = setInterval(()=>{
      checkForColumnsOfFour();
      checkForColumnsOfThree();
      checkForRowsOfFour();
      checkForRowsOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement])
    },100)
    return () => clearInterval(timer)
  },[checkForColumnsOfFour,checkForColumnsOfThree,checkForRowsOfFour,checkForRowsOfThree,moveIntoSquareBelow,currentColorArrangement])
  
  console.log(score);

  return (
    <div className="App">
      <div className='game'>
        {currentColorArrangement?.map((candyColor,index) =>(
          <img
            alt={candyColor}
            src={candyColor}
            key={index}
            data-id={index}
            draggable={true}
            onDragOver={(e)=>e.preventDefault()}
            onDragEnter={(e)=>e.preventDefault()}
            onDragLeave={(e)=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onDragStart={dragStart}
          />
        ))}
      </div>
      <ScoreBoard score={score}/>
    </div>
  );
}

export default App;
