// TODO Tiêu đề game + nút bắt đầu, pause game

import React from 'react'
import { useGameStore } from '../store/store'

const Header = ({startPauseGame, resetClick}) => {
  const isGame = useGameStore(state => state.isGame)
  const isPause = useGameStore(state => state.isPause)
  

  return (
    <div className='header-wrapper'>
      <div className="header-title">Tetris 3D</div>
      <div className="header-button-wrapper">
        <div className="start">
          <button id="start-button" onClick={startPauseGame}>{!isGame || isPause ? "Bắt đầu" : "Tạm dừng"}</button>
        </div>
        <div className="reset">
          <button id="reset-button" onClick={resetClick}>Reset</button>
        </div>
      </div>
    </div>
  )
}

export default Header