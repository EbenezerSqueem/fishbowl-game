import React from "react";
import { IconSVG } from "./IconSVG";

const Header = () => {
  return (
    <div className="header">
      <div className="header-icon">
        <IconSVG
          width={50}
          height={50}
          viewBoxWidth={220}
          viewBoxHeight={220}
        />
      </div>
      <div className="header-title">
        <p className="header-title-fish">FISH</p>
        <p className="header-title-bowl">BOWL</p>
      </div>
    </div>
  );
};

export default Header;
