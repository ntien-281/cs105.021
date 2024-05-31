// TODO UI overlay, bên trái là incoming block(các block này có animation), bên phải là hướng dẫn điều khiển + navigation + điểm + ...

import { Html } from "@react-three/drei";
import React from "react";

const Ui = () => {
  return (
    // Left UI: incoming blocks with animation
    <>
      <div className="incoming-display">
        <strong>Các khối tiếp:</strong>
      </div>
    {/* Right UI */}
      <div className="instructions-label">
        <ul>
          <li>
            <strong>Camera: </strong> <span>Kéo thả chuột</span>
          </li>
          <li>
            <strong>
              Di chuyển
            </strong>
            <ul>
              <li><strong>X:</strong> W, A</li>
              <li><strong>Z:</strong> S, D</li>
            </ul>
          </li>
          <li>
            <strong>Xoay:</strong>
            <ul>
              <li>
                <strong>X:</strong> Q
              </li>
              <li>
                <strong>Y:</strong> E
              </li>
              <li>
                <strong>Z:</strong> R
              </li>
            </ul>
          </li>
          <li>
            <strong>Thả:</strong> <span>Space</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Ui;
