import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'commons/axios';
import { toast } from 'react-toastify';
import Panel from 'components/Panel';
import EditInventory from 'components/EditInventory';
import { formatPrice } from 'commons/helper';

class Product extends React.Component {

  toEdit = () => {
    Panel.open({
      component: EditInventory,
      props: {
        product: this.props.product,
        deleteProduct: this.props.delete
      },
      callback: data => {
        if (data) {
          this.props.update(data)
        }
      }
    })
  }

  addCart = async() => {
    if (!global.auth.isLogin()) {
      toast.info('Please Login First');
      this.props.history.push('/login');
      return;
    } 
    try {
      const user = global.auth.getUser() || {};
      // console.log(user);
      const { id, name, image, price } = this.props.product;
      // 先查询购物车内是否有这个 id。如果有，修改数量；如果没有，amount设置为 1
      // 异步函数，与async()配对使用，得到resposne后才执行之后的代码
      const res = await axios.get(`/carts?productId=${id}`);
      const carts = res.data;
      console.log(carts);
      if (carts && carts.length > 0) {
        const cart = carts[0];
        cart.amount += 1;
        await axios.put(`/carts/${cart.id}`, cart);
      } else {
        const cart = {
          productId: id,
          //name 和 value一致可以省略
          name,
          image, 
          price,
          amount: 1,
          userId: user.email
        }
        console.log(user);
        console.log(cart);
        await axios.post('/carts', cart);
      }
      this.props.updateCartNum();
      toast.success('Add Cart Success');
    } catch (error) {
      toast.error('Add Cart Failed');
    }
  }

  renderManagerBtn = () => {
    const user = global.auth.getUser() || {};
    if (user.type === 1) {
      return (
        <div className="p-head has-text-right" onClick={this.toEdit}>
          <span className="icon edit-btn">
            <i className="fas fa-sliders-h"></i>
          </span>
        </div>
      )
    }
  }

  render() {
    const { name, image, tags, price, status } = this.props.product;
    const _pclass = {
      available: 'product',
      unavailable: 'product out-stock'
    }
    return (
      <div className={_pclass[status]}>
        <div className="p-content">
          {/* 使用class定义的组件要加this */}
          {this.renderManagerBtn()}
          {/* 图片 */}
          <div className="img-wrapper">
            <div className="out-stock-text">Out Of Stock</div>
            <figure className="image is-4by3">
              <img src={image} alt={name}/>
            </figure>
          </div>
          <p className="p-tags">{tags}</p>
          <p className="p-name">{name}</p>
        </div>
        <div className="p-footer">
          <p className="price">{formatPrice(price)}</p>
          <button className="add-cart" disabled={status === 'unavailable'} onClick={this.addCart}> 
            <i className="fas fa-shopping-cart"></i>
            <i className="fas fa-exclamation"></i>
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(Product);