/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useTracking } from 'react-tracking';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../../../config';

import Review from './Review';
import NewReviewForm from './NewReviewForm';

const ReviewsList = ({
  productReviews, sortStatus, handleSortChange, characteristics,
  renderToggle, setRenderToggle, selectedRatings, ratingsLength,
  productName, productId, setGetToggle,
}) => {
  const { trackEvent } = useTracking({ module: 'Reviews List' });
  const [renderedReviews, setRenderedReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(2);
  const [show, setShow] = useState(false);

  const renderReviewList = (reviews, count) => {
    const renderArray = [];
    if (count <= reviews.length) {
      for (let i = 0; i < count; i += 1) {
        renderArray.push(reviews[i]);
      }
      setRenderedReviews(renderArray);
    } else {
      setRenderedReviews(reviews);
    }
  };

  const filterReviewList = (reviews, count, ratingArray) => {
    if (ratingsLength) {
      const filterArray = [];
      for (let i = 0; i < reviews.length; i += 1) {
        if (ratingArray.includes(reviews[i].rating)) {
          filterArray.push(reviews[i]);
        }
      }
      setRenderedReviews(filterArray);
    } else {
      renderReviewList(productReviews, reviewCount);
    }
  };

  const markReview = (e, reviewId, string) => {
    e.preventDefault();
    let url = `http://13.52.186.54/reviews/${reviewId}/`;

    if (string === 'Yes') {
      url += 'helpful';
    }
    if (string === 'Report') {
      url += 'report';
    }

    axios.put(url)
      .then((res) => {
        console.log('PUT success ', res);
      })
      .then(() => {
        setGetToggle(true);
      })
      .then(() => {
        (string === 'Report') ? alert('This review has been reported') : null
      })
      .catch((err) => { console.log('HELPFUL ERROR', err); });
  };

  useEffect(() => {
    renderReviewList(productReviews, reviewCount);
    setRenderToggle(false);
  }, [reviewCount, renderToggle]);

  useEffect(() => {
    filterReviewList(productReviews, reviewCount, selectedRatings);
  }, [ratingsLength]);

  return (
    <div className="review-list">
      <div>
        {productReviews.length}
        {' '}
        reviews, sorted by
        {' '}
        <select
          style={{ cursor: 'pointer' }}
          value={sortStatus}
          onChange={(e) => handleSortChange(e)}
        >
          <option value="relevant">Relevant</option>
          <option value="helpful">Helpful</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div>
        {renderedReviews.map((review) => <Review className="rendered-review" key={review.id} review={review} markReview={markReview} />)}
      </div>
      {!productReviews.length ? <div>Be the first to review this product.</div> : null}
      {(productReviews.length <= 2 || reviewCount >= productReviews.length) ? null : <Button id="more-reviews-btn" className="review-buttons" onClick={() => setReviewCount(reviewCount + 2)}>More Reviews</Button>}
      {reviewCount >= productReviews.length ? <Button id="fewer-reviews-btn" className="review-buttons" onClick={() => setReviewCount(2)}>Fewer Reviews</Button> : null}
      <Button className="review-buttons" onClick={() => { setShow(true); trackEvent({ element: 'Add a Review', time: new Date() }); }}>Add a Review +</Button>
      <NewReviewForm
        productName={productName}
        characteristics={characteristics}
        show={show}
        onHide={() => setShow(false)}
        productId={productId}
        setGetToggle={setGetToggle}
      />
    </div>
  );
};

ReviewsList.propTypes = {
  productReviews: PropTypes.arrayOf(PropTypes.shape({
    rating: PropTypes.number.isRequired,
    reviewer_name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    })),
    recommended: PropTypes.bool,
    response: PropTypes.string,
    helpfulness: PropTypes.number.isRequired,
  })),
  sortStatus: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  renderToggle: PropTypes.bool.isRequired,
  setRenderToggle: PropTypes.func.isRequired,
  selectedRatings: PropTypes.arrayOf(PropTypes.number),
  ratingsLength: PropTypes.number.isRequired,
  characteristics: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      value: PropTypes.string,
    }),
  ),
  productName: PropTypes.string.isRequired,
  productId: PropTypes.number.isRequired,
  setGetToggle: PropTypes.func.isRequired,
};

ReviewsList.defaultProps = {
  productReviews: null,
  selectedRatings: PropTypes.arrayOf(null),
  characteristics: PropTypes.objectOf(null),
};

export default ReviewsList;
