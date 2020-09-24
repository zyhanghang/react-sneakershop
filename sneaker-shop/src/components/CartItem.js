import React, { useState, useMemo } from 'react';
import axios from 'commons/axios';
import { formatPrice } from 'commons/helper';


const CartItem = props => {
  const [amount, setAmount] = useState(props.cart.amount)
  const { id, name, image, price } = props.cart || {};

  // (1) 每次渲染页面都会执行函数
  // const sumPrice = formatPrice(amount * parseInt(price));
  // (2) 只有amount或price变化才会执行函数
  const sumPrice = useMemo(() => {
    return formatPrice(amount * parseInt(price));
  }, [amount, price]);

  const handleChange = e => {
    const _amount = parseInt(e.target.value);
    setAmount(_amount);
    const newCart = {
      ...props.cart,
      amount: _amount
    }
    axios.put(`/carts/${id}`, newCart).then(res => {
      console.log(newCart)
      props.updateCart(newCart);
    })
  }

  const deleteCart = () => {
    axios.delete(`/carts/${id}`).then(res => {
      //在父组件中删除
      props.deleteCart(props.cart);
    })
  }

  return (
    <div className="columns is-vcentered">
      <div className="column is-narrow" onClick={deleteCart}>
        <span className="close">X</span>
      </div>
      <div className="column is-narrow">
        <img src={image} alt={name} width="100" />
      </div>
      <div className="column cart-name is-narrow">
        {name}
      </div>
      <div className="column">
        <span className="price">{formatPrice(price)}</span>
      </div>
      <div className="column">
        <input type="number" className="imput num-input" value={amount} min={1} onChange={handleChange} />
      </div>
      <div className="column">
        <span className="sum-price">{sumPrice}</span>
      </div>
    </div>
  )
} 

export default CartItem;