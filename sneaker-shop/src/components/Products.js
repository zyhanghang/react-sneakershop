import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import axios from 'commons/axios';
import ToolBox from 'components/ToolBox';
import Product from 'components/Product';
import Panel from 'components/Panel';
import AddInventory from 'components/AddInventory';



class Products extends React.Component {

  state = {
    // products是一个数组
    products: [],
    sourceProducts: [],
    cartNum: 0
  };

  
  // 生命周期函数，初次渲染完成执行
  componentDidMount() {
    axios.get('/products')
    .then(response => {
      this.setState({
        products: response.data,
        sourceProducts: response.data
      });
    })
    this.updateCartNum();
  }
  
  search = text => {
    console.log(text);
    // 1. Copy，如果使用 const _products = this.state.products，原数组也会改变
    let _products = [...this.state.sourceProducts]
    // 2. Filter
    _products = _products.filter(p => {
      const matchArray = p.name.match(new RegExp(text, 'gi'))
      return !!matchArray
    })
    // 3. Set State
    this.setState({
      products: _products
    });
  }
  
  toAdd = () => {
    Panel.open({
      component: AddInventory,
      callback: data => {
        if (data) {
          this.add(data);
        }
        console.log(data + 'in products component');
      }
    });
  }
  
  add = product => {
    const _products = [...this.state.products]
    _products.push(product)
    const _sProducts = [...this.state.sourceProducts]
    _sProducts.push(product)
    this.setState({
      products: _products,
      sourceProducts: _sProducts
    })
  }
  
  update = product => {
    const _products = [...this.state.products]
    const _index = _products.findIndex(p => p.id === product.id)
    //splice函数替换数组中某一项
    _products.splice(_index, 1, product)
    const _sProducts = [...this.state.sourceProducts]
    const _sIndex = _products.findIndex(p => p.id === product.id)
    _sProducts.splice(_sIndex, 1, product)
    this.setState({
      products: _products,
      sourceProducts: _sProducts
    })
  }
  
  delete = id => {
    const _products = this.state.products.filter(p => p.id !== id)
    const _sProducts = this.state.sourceProducts.filter(p => p.id !== id)
    this.setState({
      products: _products,
      sourceProducts: _sProducts
    })
  }
  
  // ToolBox 和 Product 是兄弟组件，通过共同的父组件进行通讯
  updateCartNum = async() => {
    const cartNum = await this.initCartNum();
    this.setState({
      cartNum: cartNum
    })
  }

  initCartNum = async() => {
    const user = global.auth.getUser() || {};
    // get 请求可以通过这种方式发送参数
    const res = await axios.get(`/carts`, {
      params: {
        userId: user.email
      }
    });
    const carts = res.data || [];
    const cartNumArr = carts.map(cart => cart.amount);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const cartNum = cartNumArr.reduce(reducer, 0);
    return cartNum;
  }

  renderManagerBtn = () => {
    const user = global.auth.getUser() || {};
    if (user.type === 1) {
      return (
        <button className="button is-primary add-btn" onClick={this.toAdd}>add</button>
      )
    }
  }

  //什么时候重新执行render函数: state或props变化
  render() {
    return (
      <div>
        <ToolBox search={this.search} cartNum={this.state.cartNum} />
        <div className="products">
          <div className="columns is-multiline is-desktop">
            <TransitionGroup component={null}>
              {
                this.state.products.map(p => {
                  return (
                    <CSSTransition classNames="product-fade" timeout={{enter: 300, exit: 300}} key={p.id}>
                      <div className="column is-3" key={p.id}>
                        {/* 向 Product 组件传递函数 */}
                        <Product 
                          product={p} 
                          update={this.update} 
                          delete={this.delete} 
                          updateCartNum={this.updateCartNum} 
                        />
                      </div>
                    </CSSTransition>
                  )
                })
              }
            </TransitionGroup>
          </div>
          {/* <button className="button is-primary add-btn" onClick={this.toAdd}>add</button> */}
          {this.renderManagerBtn()}
        </div>
      </div>
    )
  }
} 

export default Products;