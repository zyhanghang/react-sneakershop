import React, { useState, useEffect, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import axios from 'commons/axios';
import Layout from 'Layout';
import CartItem from 'components/CartItem';
import { formatPrice } from 'commons/helper';

// 在函数式组件中使用state等React特性需要 Hook
const Cart = () => {
  const [carts, setCarts] = useState([]);
  console.log(carts);
  // 类似 componentDidMount
  // 如果不传递第二个参数，会重复执行
  useEffect(() => {
    const user = global.auth.getUser() || {};
    axios.get(`/carts?userId=${user.email}`).then(res => setCarts(res.data));
  }, []);

  // 当carts变化的时候才执行
  const totalPrice = useMemo(() => {
    const itemPrices = carts.map(cart => cart.amount * parseInt(cart.price));
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const totalPrice = itemPrices.reduce(reducer, 0);
    return formatPrice(totalPrice);
  }, [carts]);
  
  const updateCart = cart => {
    const newCarts = [...carts];
    const _index = newCarts.findIndex(c => c.id === cart.id);
    newCarts.splice(_index, 1, cart);
    setCarts(newCarts);
  }

  const deleteCart = cart => {
    //将传过来的 cart从 carts数组中移除
    const _carts = carts.filter(c => c.id !== cart.id);
    setCarts(_carts);
  }
  
  return (
    <Layout>
      <div className="cart-page">
        <span className="cart-title">Shopping Cart</span>
        <div className="cart-list">
          <TransitionGroup component={null}>
            {
              carts.map(cart => (
                <CSSTransition classNames="cart-item" timeout={300} key={cart.id}>
                  <CartItem 
                    key={cart.id} 
                    cart={cart} 
                    updateCart={updateCart} 
                    deleteCart={deleteCart} 
                  />
                </CSSTransition>
             ))
            }
          </TransitionGroup>
        </div>
        { carts.length === 0 ? <p className="no-cart">No Sneakers In Cart</p> : '' }
        <div className="cart-total">
          Toatl: 
          <span className="total-price">{totalPrice}</span>
        </div>
      </div>
    </Layout>
  ); 
};

export default Cart;