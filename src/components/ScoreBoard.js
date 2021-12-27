import React from 'react'
import './scoreboard.css'

export const ScoreBoard = ({score}) => {
    return (
        <div className='score-board'>
            <div className='score-title'>
                Score:
            </div>
            <div className='score-body'>
                <h2>{score}</h2>    
            </div>
            
        </div>
    )
}
