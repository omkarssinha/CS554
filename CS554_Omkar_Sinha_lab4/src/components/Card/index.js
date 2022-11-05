import React from "react";
import PropTypes from "prop-types";
import styles from "./card.module.scss";

const Card = ({ title, img, id, lastModified, onClick }) => {
  return (
    <div className={styles.cardContainer} onClick={onClick}>
      <img src={img} alt="img" className={styles.imgStyle} />
      <h1>{title}</h1>
      <hr className={styles.lineStyle} />
      <p className={styles.idStyle}>ID : 
      {id ? id : "No id found"}
    </p>
      <p className={styles.lastModifiedStyle}>Last Modified : 
      {lastModified ? lastModified : "No date found"}
    </p>
       
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  img: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
