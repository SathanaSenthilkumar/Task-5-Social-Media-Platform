import React from "react";

import { UilSetting } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { FaSnapchat } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
const NavIcons = () => {
  return (
    <div className="navIcons">
      <Link to="../home">
        <IoHome
          style={{ color: "#fff", fontSize: "22px", color: "var(--location)" }}
        />
      </Link>
      <UilSetting style={{ cursor: "pointer" }} />
      <FaSnapchat
        style={{ color: "#fff", fontSize: "22px", cursor: "pointer" }}
      />
      <div>
        <IoChatbubblesOutline
          style={{ color: "#fff", fontSize: "22px", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default NavIcons;
