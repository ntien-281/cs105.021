// TODO Tiêu đề game + nút bắt đầu, pause game

import React from 'react'

const Header = () => {
  return (
    <div className='header-wrapper'>
      <div className="header-title"></div>
      <div className="header-button-wrapper">
        <div className="start">
          <button id="start-button">Bắt đầu</button>
        </div>
        <div className="pause">
          <button id="pause-button">Dừng</button>
        </div>
        <div className="reset">
          <button id="resett-button">Reset</button>
        </div>
      </div>
    </div>
  )
}

export default Header