import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Header from "../../components/Header";
import css from "./characterDetails.module.scss";
import { getCharacterById } from "../../config/api";


const AxiosCall = (axiosParams, pageOffset, search) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      setLoading(true);
      document.body.style.overflow = "hidden";
      const result = await axios.request(params);
      setResponse(result?.data?.data);
      if (pageOffset > result?.data?.data?.total) {
        setError(true);
      } else {
        setError(false);
      }
    } catch (error) {
      setError(true);
    } finally {
      document.body.style.overflow = "auto";
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams, pageOffset);
  }, [pageOffset, search]);

  return { response, error, loading };
};


const CharacterDetails = (props) => {
  const {
    history,
    match: { params },
    location: { state },
  } = props;

  const { response, loading, error } = AxiosCall(
    {
      method: "get",
      url: getCharacterById(params && params.id),
    },
    null
  );

  const [payload, setPayload] = useState(
    state && state.params ? state.params : []
  );

  useEffect(() => {
    if (error || isNaN(params && params.id)) history.replace("/404");
    if (response !== null) {
      setPayload(response?.results[0]);
    }
  }, [response, history, payload, error, params]);

  return (
    <React.Fragment>
      <Header text={payload.name} goBack={true} />
      {!loading && (
        <div className={css.detailContainer}>
          <div className={css.detailSubContainer}>
            <div style={{ marginTop: "20px" }}>
              <h1 className={css.titleStyle}>{payload.name}</h1>
              <img
                src={`${payload.thumbnail.path}.${payload.thumbnail.extension}`}
                alt="img"
                className={css.imgStyle}
              />
              <div className={css.rowStyle}>
                <h1>
                  Introduction :{" "}
                  <span>
                    {" "}
                    {payload.description
                      ? payload.description
                      : "No description is available"}
                  </span>
                </h1>
              </div>
              <div className={css.rowStyle}>
                <h1>
                  Appeared in Comics :{" "}
                  <div className={css.listElement}>
                    {(payload.comics.items).map(i => (
                      <li>
                      <a href={"../comics/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                      </li>
                    ))}                      
                  </div>
                </h1>
              </div>
              <div className={css.rowStyle}>
                <h1>
                  Appeared in Series :{" "}
                    <div className={css.listElement}>
                      {(payload.series.items).map(i => (
                        <li>
                         <a href={"../series/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                        </li>
                      ))}                      
                    </div>
                </h1>
              </div>
            </div>
            <div
              style={{
                marginBottom: "11px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                isHoverBorder={true}
                text="Return"
                onClick={() => history.goBack()}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CharacterDetails;
