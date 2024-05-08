// TODO UI overlay, bên trái là incoming block(các block này có animation), bên phải là hướng dẫn điều khiển + navigation + điểm + ...

import { Html } from "@react-three/drei";
import React from "react";

const Ui = () => {
  return (
    // Left UI: incoming blocks with animation
    <>
      <div className="incoming-display">
        <strong>Incoming blocks:</strong>
      </div>
    {/* Right UI */}
      <div className="instructions-label">
        <ul>
          <li>
            <strong>Drag:</strong> <span>Mouse</span>
          </li>
          <li>
            <strong>Rotate:</strong>
            <ul>
              <li>
                <strong>X-axis:</strong> Q
              </li>
              <li>
                <strong>Y-axis:</strong> E
              </li>
              <li>
                <strong>Z-axis:</strong> R
              </li>
            </ul>
          </li>
          <li>
            <strong>Hard Drop:</strong> <span>Space</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Ui;
