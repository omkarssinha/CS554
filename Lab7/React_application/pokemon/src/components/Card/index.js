import React from "react";
import PropTypes from "prop-types";

import styles from "./card.module.scss";

const Card = ({ title, img, onClick }) => {
  const imgpath="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"+img+".png";
  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <img src={imgpath} alt="img" className={styles.imgStyle} />
      <h1>{title}</h1>
      <hr className={styles.lineStyle} />
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
