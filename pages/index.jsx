import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import CloseIcon from '@material-ui/icons/Close';
import Head from 'next/head';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import BuildIcon from '@material-ui/icons/Build';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import CodeIcon from '@material-ui/icons/Code';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TerrainIcon from '@material-ui/icons/Terrain';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ProductDescription from '../components/Description-Scott/ProductDescription';
import Comparison from '../components/Comparison-Dorien/Comparison';
import QAs from '../components/QAs-Malcolm/QAs';
import Reviews from '../components/Reviews-Jim/Reviews';
import styles from './index.module.css';

const App = () => {
  const [productId, setProductId] = useState(18081);
  const [productName, setProductName] = useState('Camo Onesie');
  const [productRating, setProductRating] = useState(null);
  const [currentProductData, setCurrentProductData] = useState(null);
  const [currentStyleData, setCurrentStyleData] = useState(null);
  const [cart, setCart] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const reviewsRef = useRef();

  const retrieveItemsFromLocalStorage = () => {
    const existing = Object.keys(localStorage);
    const itemsInCart = [];
    for (let i = 0; i < existing.length; i += 1) {
      const nm = existing[i];
      const sizeAndQuan = localStorage.getItem(nm);
      const itemDetails = sizeAndQuan.split('/');
      const sz = itemDetails[0];
      const quan = itemDetails[1];
      if (nm.slice(0, 3) === 'NL:') {
        itemsInCart.push({ name: nm.slice(3), size: sz, quantity: quan });
      }
    }
    setCart(itemsInCart);
  };

  const removeItem = (item) => {
    const myCart = [];
    cart.forEach((product) => {
      if (product.name !== item.name
        || product.size !== item.size
        || product.quantity !== item.quantity) {
        myCart.push(product);
      }
    });
    setCart(myCart);

    localStorage.removeItem(`NL:${item.name}`);
  };

  useEffect(() => {
    retrieveItemsFromLocalStorage();
  }, []);

  return (
    <>
      {isDarkMode ? (
        <style type="text/css">
          {`
          .navbar {
            border: solid;
            border-color: rgb(41, 41, 41);
            ;
          }
        .card {
          background-color: #353B40
        }
        `}
        </style>
      ) : null}
      <style type="text/css">
        {`
              #basic-nav-dropdown {
                color: #fff;
              }
              .MuiToggleButton-root {
                color: white;
                border-color: #fff;
              }
              .navbar {
                border: solid;
                border-color: rgb(41, 41, 41);
                border-width: thin;
                ;
              }
            `}
      </style>
      <Head>
        <title>NextLevel</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/united-states.png" type="image/x-icon" />
      </Head>
      <Container className={isDarkMode ? styles.darkMode : null}>
        <Navbar bg="dark" variant="dark" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Navbar.Brand href="#home">
            <img src="/america.png" alt="america" style={{height: '45px', width: '45px', borderColor: '#A9A9A9', border: 'solid', borderWeight: 'thin' }} />
            <strong style={{ fontSize: '20px', fontFamily: 'Palatino', marginLeft: '10px' }}>NEXT Level</strong>
            <span style={{ fontSize: '11px', marginLeft: '20px' }}><i>Made in the USA</i></span>
          </Navbar.Brand>
          <NavDropdown title="Cart" id="basic-nav-dropdown">
            {cart.length > 0 ? cart.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NavDropdown.Item key={index}>
                {`${item.name}`}
                (
                {`${item.size}`}
                ) x
                {`${item.quantity}  `}
                <CloseIcon onClick={() => removeItem(item)} style={{ fontSize: 'Medium', transform: 'translate(12px, -1px)' }} />
              </NavDropdown.Item>
            ))
              : <NavDropdown.Item>Nothing in Cart</NavDropdown.Item>}
          </NavDropdown>
          <ToggleButton
            value="check"
            selected={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          >
            <Brightness5Icon id="darkModeIcon" />
          </ToggleButton>
        </Navbar>
        <div className="App">
          <ProductDescription
            productId={productId}
            productRating={productRating}
            reviewsRef={reviewsRef}
            setProductNameGlobal={setProductName}
            setCurrentProductData={setCurrentProductData}
            setCurrentStyleData={setCurrentStyleData}
            setCart={setCart}
            cart={cart}
          />
          <Comparison
            productId={productId}
            setProductId={setProductId}
            currentProductData={currentProductData}
            currentStyleData={currentStyleData}
            productRating={productRating}
            productName={productName}
          />
          <QAs
            productId={productId}
            productName={productName}
          />
          <Reviews
            productId={productId}
            reviewsRef={reviewsRef}
            setProductRating={setProductRating}
            productName={productName}
          />
        </div>
        <BottomNavigation style={{ backgroundColor: '#A9A9A9' }} showLabels>
          <BottomNavigationAction label="Taylor" value="Taylor" icon={<BuildIcon />} href="https://github.com/taylorsmart" target="_blank" />
          <BottomNavigationAction label="Nick" value="Nick" icon={<CodeIcon />} href="https://github.com/spacerumsfeld-code" target="_blank" />
          <BottomNavigationAction label="Johnny" value="Johnny" icon={<KeyboardIcon />} href="https://github.com/jbframe" target="_blank" />
          <BottomNavigationAction label="Scott" value="Scott" icon={<SportsBasketballIcon />} href="https://github.com/Scott-Guinn" target="_blank" />
          <BottomNavigationAction label="Dorien" value="Dorien" icon={<MonetizationOnIcon />} href="https://github.com/Initial-D-cmd" target="_blank" />
          <BottomNavigationAction label="Malcolm" value="Malcolm" icon={<TerrainIcon />} href="https://github.com/Malcolm-Marshall" target="_blank" />
          <BottomNavigationAction label="Jim" value="Jim" icon={<EmojiPeopleIcon />} href="https://github.com/JimBurch" target="_blank" />
        </BottomNavigation>
      </Container>
    </>
  );
};

export default App;
