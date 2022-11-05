import React from "react";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

import styles from "./pagination.module.scss";

const Pagination = ({ handlePageClick, pageCount, forcePagination }) => {
  //console.log(pageCount+"hi")
  console.log(forcePagination+" Hi")

  if(forcePagination!==0 && forcePagination!==pageCount-1)
  {
    return (
      <div className={styles.pageContianer}>
        {pageCount && pageCount !== 0 && forcePagination!==0 ? (
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            activeClassName={styles.activeSideBarStyle}
            containerClassName={styles.mainContainer}
            disableInitialCallback
            forcePage={forcePagination}
          />
        ) : null}
      </div>
    );
  }
  else if(forcePagination==0)
  {
    return (
      <div className={styles.pageContianer}>
        {pageCount && pageCount !== 0 ? (
          <ReactPaginate
            previousLabel= {false}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            activeClassName={styles.activeSideBarStyle}
            containerClassName={styles.mainContainer}
            //initialPage={0}
            disableInitialCallback
            forcePage={forcePagination}
          />
        ) : null}
      </div>
    );
  }
  else
  {
    return (
      <div className={styles.pageContianer}>
        {pageCount && pageCount !== 0 ? (
          <ReactPaginate
            previousLabel= {"Prev"}
            nextLabel= {false}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            activeClassName={styles.activeSideBarStyle}
            containerClassName={styles.mainContainer}
            disableInitialCallback
            forcePage={forcePagination}
          />
        ) : null}
      </div>
    );
  }
};

export default Pagination;

Pagination.propTypes = {
  calPageCount: PropTypes.func,
  forcePagination: PropTypes.number,
  handlePageClick: PropTypes.func,
};
