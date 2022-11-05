import React, { useEffect, useState } from "react";

import { getSeriesById } from "../../config/api";
import Button from "../../components/Button";
import Header from "../../components/Header";
import css from "./seriesDetails.module.scss";
import axios from "axios";

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

const SeriesDetails = (props) => {
  const {
    history,
    match: { params },
    location: { state },
  } = props;

  const { response, loading, error } = AxiosCall(
    {
      method: "get",
      url: getSeriesById(params && params.id),
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
      <Header text={payload.title} goBack={true} />
      {!loading && (
        <div className={css.detailContainer}>
          <div className={css.detailSubContainer}>
            <img
              src={`${payload.thumbnail.path}.${payload.thumbnail.extension}`}
              alt="img"
              className={css.imgStyle}
            />
            <div style={{ marginTop: "20px" }}>
              <h1 className={css.titleStyle}>{payload.title}</h1>
              <div className={css.rowStyle}>
                <h1>
                  Introduction :{" "}
                  <span>
                    {" "}
                    {payload.description
                      ? payload.description
                      : "No intro is available"}
                  </span>
                </h1>
              </div>
              <div className={css.rowStyle}>
                <h1>
                  Characters  :{" "}
                  <div className={css.listElement}>
                    {(payload.characters.items).map(i => (
                    <li>
                    <a href={"../characters/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
                    </li>
                    ))}                      
                  </div>
                </h1>
              </div>
              <div className={css.rowStyle}>
                <h1>
                  Comics :{" "}
                  <div className={css.listElement}>
                    {(payload.comics.items).map(i => (
                    <li>
                    <a href={"../comics/".concat(i.resourceURI.substring(i.resourceURI.lastIndexOf('/')+1))}>{i.name}</a>
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
                text="Go Back"
                onClick={() => history.goBack()}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SeriesDetails;
