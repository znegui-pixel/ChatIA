import { Link } from "react-router-dom";
import { Button } from "@mui/material";

type Props = {
  to?: string; // rendre optionnel !
  bg: string;
  text: string;
  textColor: string;
  onClick?: () => Promise<void>;
};

const NavigationLink = (props: Props) => {
  if (props.to) {
    // Si "to" existe => lien normal
    return (
      <Link
        to={props.to}
        style={{
          background: props.bg,
          color: props.textColor,
          padding: "8px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          margin: "0 8px",
          transition: "all 0.3s ease",
        }}
        className="nav-link"
      >
        {props.text}
      </Link>
    );
  }

  // Sinon => bouton cliquable
  return (
    <Button
      onClick={props.onClick}
      sx={{
        background: props.bg,
        color: props.textColor,
        padding: "8px 16px",
        borderRadius: "8px",
        margin: "0 8px",
        textTransform: "none",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "#333",
          color: "white",
        },
      }}
    >
      {props.text}
    </Button>
  );
};

export default NavigationLink;
