import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button";
import styles from "./HomePage.module.scss";

const HomePage = () => {
  const history = useHistory();
  //console.log("Hi")
  return (
    <div className={styles.HomeContainer}>
      <div className={styles.boxStyle}>
        <h1 className={styles.mainHeading}>MARVEL</h1>
        <h2 className={styles.subHeading}>
         Explore Marvel!
        </h2>
        <div className={styles.btnContainer}>
          <Button text="HomePage" onClick={() => history.push("/")} />
          <Button
            text="Characters"
            onClick={() => history.push("/characters/page/0")}
          />
          <Button
            text="Comics"
            onClick={() => history.push("/comics/page/0")}
          />
          <Button
            text="Series"
            onClick={() => history.push("/series/page/0")}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
