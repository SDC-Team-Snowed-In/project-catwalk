/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import config from '../../config';

import ImageGallery from './ImageGallery/ImageGallery';
import ProductInfo from './ProductInfo/ProductInfo';
import StyleSelector from './StyleSelector/StyleSelector';
import AddToCart from './AddToCart/AddToCart';

const ProductDescription = ({
  productId, productRating, reviewsRef, setProductNameGlobal,
  setCurrentProductData, setCurrentStyleData, setCart, cart,
}) => {
  const { trackEvent } = useTracking({ module: 'Product Overview' });

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [allStyles, setAllStyles] = useState([]);
  const [styleInfo, setStyleInfo] = useState({});

  const [isExpanded, setIsExpanded] = useState(false);
  const server = `http://18.191.91.129:3000`;
  // const server = `http://localhost:3001`;


  const getProduct = () => {
    console.log('Initializing getProduct Fetch on /products/:id')
    const productRequest = {
      url: `${server}/overview/products/${productId}`,
      method: 'get',
      headers: {
        Authorization: config.TOKEN,
      },
    };
    axios(productRequest)
      .then((productResponse) => {
        console.log('Response for /products/id')
        console.log(productResponse)
        const productDataRoot = productResponse.data.rows[0]
        console.log('Response productDataRoot')
        console.log(productDataRoot)
        setCurrentProductData(productDataRoot);
        setProductName(productDataRoot.name);
        setProductNameGlobal(productDataRoot.name);
        setCategory(productDataRoot.category);
        setDescription(productDataRoot.description);
      }).catch((err) => {
        console.log('Not successful')
        console.error(err)
      }); // eslint-disable-line no-console

    const stylesRequest = {
      url: `${server}/overview/styles/${productId}/`,
      method: 'get',
      headers: {
        Authorization: config.TOKEN,
      },
    };
    axios(stylesRequest)
      .then((stylesResponse) => {
        // console.log('Response for /products/:id/styles')
        // console.log(stylesResponse)
        const resultRoot=stylesResponse.data.rows[0].results;
        // console.log('New Root');
        // console.log(resultRoot);

        setAllStyles(resultRoot);

        let defaultStyle;

        if (resultRoot.find((style) => style['default?'] === true) !== undefined) {
          defaultStyle = resultRoot.find((style) => style['default?'] === true);
        } else {
          // eslint-disable-next-line prefer-destructuring
          defaultStyle = resultRoot[0];
        }
        setStyleInfo(defaultStyle);
      }).catch((err) => console.error(err)); // eslint-disable-line no-console
  };

  useEffect(() => {
    if (styleInfo) {
      setCurrentStyleData(styleInfo);
    }
  }, [styleInfo]);

  useEffect(() => {
    getProduct();
  }, [productId]);
  return (
    <div>
      <Container className="container-fluid">
        <Row>
          <Col className={isExpanded ? 'col-12' : 'col-7'} onClick={() => trackEvent({ element: 'Image Gallery', time: new Date() })}>
            <ImageGallery styleInfo={styleInfo} setIsExpanded={setIsExpanded} />
          </Col>
          {isExpanded ? null
            : (
              <Col className="col-5">
                <Divider style={{ marginTop: '10px' }} />
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <ProductInfo
                    productName={productName}
                    productRating={productRating}
                    category={category}
                    description={description}
                    styleInfo={styleInfo}
                    reviewsRef={reviewsRef}
                  />
                </div>
                <Divider />
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <StyleSelector
                    allStyles={allStyles}
                    styleInfo={styleInfo}
                    setStyleInfo={setStyleInfo}
                  />
                </div>
                <Divider />
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <AddToCart
                    styleInfo={styleInfo}
                    setCart={setCart}
                    cart={cart}
                    productName={productName}
                  />
                </div>
              </Col>
            )}
        </Row>
      </Container>
    </div>
  );
};

ProductDescription.propTypes = {
  productId: PropTypes.number.isRequired,
  productRating: PropTypes.string,
  reviewsRef: PropTypes.object,
  setCurrentProductData: PropTypes.func.isRequired,
  setCurrentStyleData: PropTypes.func.isRequired,
  setProductNameGlobal: PropTypes.func.isRequired,
  setCart: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
};

ProductDescription.defaultProps = {
  productRating: null,
  reviewsRef: {},
};

export default ProductDescription;
