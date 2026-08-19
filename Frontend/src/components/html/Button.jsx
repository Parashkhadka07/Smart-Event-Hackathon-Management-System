import React from "react";
import "../css/button.css";
const Button = (props) => {
  return <a className="button" href="#"  style={{ height: props.height, width: props.width }}>{props.name}</a>;
};

export default Button;
