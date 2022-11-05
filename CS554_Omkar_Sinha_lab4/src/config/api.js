import md5 from "blueimp-md5";
import { characterUrl, comicsUrl, seriesUrl } from "./configuration";

const generateAuthUrl = (baseUrl, offset, name) => {
  const ts = new Date().getTime();
  const stringToHash =
    ts + process.env.REACT_APP_PRIVATE_KEY + process.env.REACT_APP_PUBLIC_KEY;
  const hash = md5(stringToHash);

  const splitBaseUrl = baseUrl.split("/");
  const getCurrentApi = splitBaseUrl[splitBaseUrl.length - 1];

  console.log("getCurrentApi", getCurrentApi);

  let url;
  if (name && name.length !== 0) {
    if (getCurrentApi === "characters") {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        process.env.REACT_APP_PUBLIC_KEY +
        "&hash=" +
        hash +
        "&nameStartsWith=" +
        name +
        "&offset=" +
        offset;
    } else {
      url =
        baseUrl +
        "?ts=" +
        ts +
        "&apikey=" +
        process.env.REACT_APP_PUBLIC_KEY +
        "&hash=" +
        hash +
        "&titleStartsWith=" +
        name +
        "&offset=" +
        offset;
    }
  } else {
    url =
      baseUrl +
      "?ts=" +
      ts +
      "&apikey=" +
      process.env.REACT_APP_PUBLIC_KEY +
      "&hash=" +
      hash +
      "&offset=" +
      offset;
  }

  return url;
};

const getCharacterList = (offset, name) =>
  generateAuthUrl(characterUrl(), offset, name);

const getCharacterById = (id) => generateAuthUrl(`${characterUrl()}/${id}`);

const getComicsList = (offset, name) =>
  generateAuthUrl(comicsUrl(), offset, name);

const getComicsById = (id) => generateAuthUrl(`${comicsUrl()}/${id}`);

const getSeriesList = (offset, name) =>
  generateAuthUrl(seriesUrl(), offset, name);

const getSeriesById = (id) => generateAuthUrl(`${seriesUrl()}/${id}`);

export {
  getCharacterList,
  getCharacterById,
  getComicsList,
  getComicsById,
  getSeriesList,
  getSeriesById,
};
