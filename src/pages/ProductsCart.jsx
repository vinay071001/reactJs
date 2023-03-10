import React, { useEffect, useState } from 'react';
import '../assets/css/productsCart.scss';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function productsCart() {
  const [productsList, setProductsList] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [viewCartModal, setViewCartModal] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let totalTemp = 0;
    cartProducts.forEach((obj) => {
      totalTemp = totalTemp + obj.price * obj.quatity;
    });
    totalTemp < 300 ? setDisabledBtn(true) : setDisabledBtn(false);
    setTotalValue(totalTemp);
  }, [cartProducts]);

  async function fetchData() {
    let fetchProductLists = await fetch('https://dummyjson.com/products').then((response) =>
      response.json(),
    );
    setProductsList(fetchProductLists.products);
  }

  function handleCartModal() {
    setViewCartModal(true);
  }

  function handleAddCart(obj) {
    let newObj = {
      ...obj,
      quatity: 1,
    };
    if (!cartProducts.find((object) => obj.id == object.id)) {
      setCartProducts((prevState) => {
        return [...prevState, newObj];
      });
      setOpen(true);
    }
  }

  function handleProductQuantity(id, string) {
    let newArr = cartProducts.map((obj) => {
      if (obj.id == id) {
        if (string == 'increase') {
          obj.quatity = obj.quatity + 1;
        } else {
          obj.quatity = obj.quatity - 1;
        }
      }
      return obj;
    });
    setCartProducts(newArr);
  }

  function handleRemoveProduct(id) {
    let filteredArr = cartProducts.filter((obj) => obj.id != id);
    setCartProducts(filteredArr);
  }

  function handleDiscount() {
    let discountValue = (totalValue * 10) / 100;
    setTotalValue(totalValue - discountValue);
    setDisabledBtn(true);
  }

  function handleCartModalView(e) {
    if (e.target.id == 'outsideCart') {
      setViewCartModal(false);
    }
  }

  return (
    <>
      <div className="productsCartPageWrapper">
        {viewCartModal ? (
          <div className="cartWrap" id="outsideCart" onClick={(e) => handleCartModalView(e)}>
            <div className="cartWrap-header">Cart</div>
            <div className="cartWrap-content">
              {cartProducts.map((obj, key) => {
                return (
                  <div key={key} className="cartWrap-content-list">
                    <div>{obj.title}</div>
                    <div>{obj.price} INR</div>
                    <div>
                      Quantity:- {obj.quatity}
                      <button
                        className="quantityBtn"
                        onClick={() => handleProductQuantity(obj.id, 'increase')}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                      <button
                        className="quantityBtn"
                        disabled={obj.quatity == 1}
                        onClick={() => handleProductQuantity(obj.id, 'decrease')}
                      >
                        <i class="fa-solid fa-minus"></i>
                      </button>
                    </div>
                    <div>
                      <button className="removeBtn" onClick={() => handleRemoveProduct(obj.id)}>
                        Remove Item
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="cartWrap-content-list">
                <div>Total</div>
                <div>{totalValue} INR</div>
              </div>
            </div>
            {/* <div className="cartWrap-footer"></div> */}
            <button className="discountBtn" disabled={disabledBtn} onClick={() => handleDiscount()}>
              Apply 10% discount
            </button>
          </div>
        ) : (
          <>
            <div className="productCartBtnWrap">
              <button className="cartBtn" onClick={() => handleCartModal()}>
                View Cart
              </button>
            </div>
            <div className="productListsWrap">
              {productsList &&
                productsList.map((obj) => {
                  return (
                    <div key={obj.id} className="productsCardWrap">
                      <div className="pageCardWrap-header">
                        <img src="https://www.productsamples.com/wp-content/uploads/2021/10/il-box.png" />
                      </div>
                      <div className="pageCardWrap-content">
                        <h3 className="productsCardTitle">{obj.title}</h3>
                        <p className="productsCardDescription">{obj.description}</p>
                        <h4 className="productsCardPrice">Price:- {obj.price} INR</h4>
                        <p className="prodcutsCardDiscount">{obj.discountPercentage} %OFF</p>
                      </div>
                      <div className="pageCardWrap-footer">
                        <button className="productsCardBtn" onClick={() => handleAddCart(obj)}>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
      <Snackbar open={open} autoHideDuration={500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{
            width: '100%',
          }}
        >
          Product Added to cart
        </Alert>
      </Snackbar>
    </>
  );
}
