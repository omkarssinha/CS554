import React from "react";
import PropTypes from "prop-types";
import { BiArrowBack } from "react-icons/bi";
import { useHistory } from "react-router-dom";

import Button from "../Button";
import style from "./header.module.scss";

const Header = ({ text, goBack }) => {
  const history = useHistory();

  const handleClick = () => (goBack ? history.goBack() : history.replace("/"));
  return (
    <div className={style.headerContainer}>
    {(text!="PokemonAPI") &&
      <div onClick={handleClick} className={style.backBtnContainer}>
        <BiArrowBack />
        {goBack ? <p>Back</p> : <p>Home</p>}
      </div>
    }
      <h1>{text}</h1>
      <div className={style.btnContainer}>
        <Button
          text="Home"
          onClick={() => history.push("/")}
        />
        <Button text="Pokemons" onClick={() => history.push("/pokemon/page/1")} />
        <Button text="Trainers" onClick={() => history.push("/trainer")} />
      </div>
    </div>
  );
};

Header.propTypes = {
  text: PropTypes.string,
  goBack: PropTypes.bool,
};

export default Header;
