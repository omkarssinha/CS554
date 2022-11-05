import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { getCharacterList } from "../../config/api";
import css from "./characters.module.scss";
import axios from "axios";
import Search from "../../components/SearchBar";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import Header from "../../components/Header";


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


const callPageCount = (response) => {
  return Math.ceil(response?.total / response?.limit);
};

const Characters = (props) => {
  const {
    history,
    match: {
      params: { id },
    },
  } = props;
  const parsedId = parseInt(id);
  const initialPageOffset = parsedId * 20;

  const [characterPayload, setCharacterPayload] = useState([]);
  const [pageOffset, setPageOffset] = useState(initialPageOffset);
  const [pagination, setPagination] = useState(parsedId);
  const [searchText, setSearchText] = useState("");

  const { response, loading, error } = AxiosCall(
    {
      method: "get",
      url: getCharacterList(!isNaN(pageOffset) ? pageOffset : -1, searchText),
    },
    !isNaN(pageOffset) ? pageOffset : -1,
    searchText
  );
  // console.log("pageOffset", response.results.length === 0 && searchText.length !== 0);
  useEffect(() => {
    if (response !== null) {
      history.push(`/characters/page/${pagination}`);
      setCharacterPayload(response?.results);
    }
  }, [response, pagination, history]);

  const handlePageClick = async ({ selected }) => {
    if (parsedId !== selected) {
      const calPagination = selected * 20;
      setPagination(selected);
      setPageOffset(calPagination);
    }
  };

  const handleClick = (c) => history.push(`/characters/${c.id}`, { params: c });

  const handleSearchChange = (e) => {
    setPagination(0);
    setPageOffset(0);
    setSearchText(e.target.value);
  };
  console.log("error", error);
  return (
    <React.Fragment>
      {error ? (
        <Error />
      ) : (
        <React.Fragment>

          <Header text="CHARACTERS" />
          <Search searchText={searchText} onChange={handleSearchChange} />
          <Pagination
            pageCount={callPageCount(response)}
            handlePageClick={handlePageClick}
            forcePagination={pagination}
          />
          {response && response.results.length === 0 ? (
            <div className={css.notFound}>
              <h1>No result found.</h1>
            </div>
          ) : (
            <React.Fragment>
              <div className={css.characterContainer}>
                {characterPayload &&
                  characterPayload.map((c) => (
                    <Card
                      onClick={() => handleClick(c)}
                      key={c.id}
                      title={c.name}
                      img={`${c.thumbnail.path}.${c.thumbnail.extension}`}
                      id={c.id}
                      lastModified={c.modified}
                    />
                  ))}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Characters;
