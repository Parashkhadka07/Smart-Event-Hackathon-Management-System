import { Link } from "react-router-dom";
import "../css/button.css";

const Button = (props) => {
  return (
    <Link
      className="button"
      to={props.link || "#"}
      onClick={props.onClick}
      style={{
        height: props.height,
        width: props.width,
      }}
    >
      {props.name}
    </Link>
  );
};

export default Button;
