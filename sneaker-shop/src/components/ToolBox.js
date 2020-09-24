import React from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

class ToolBox extends React.Component {

  state = {
    searchText: ''
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({
      searchText: value
    });
    this.props.search(value);
  }

  clearSearchText = () => {
    this.setState({
      searchText: ''
    });
    this.props.search('');
  }

  goCart = () => { 
    //经过路由匹配（在 Router.js 中定义的）的才有history
    //因此，ToolBox组件使用 history要用 withRouter包装一下
    //登录以后才可以查看购物车
    if (!global.auth.isLogin()) {
      toast.info('Please Login First');
      this.props.history.push('/login');
      return;
    } 
    this.props.history.push('/cart');
  }

  render() {
    return (
      <div className="tool-box">
        <div className="logo-text">Store</div>
        <div className="search-box">
          <div className="field has-addons">
            <div className="control">
              <input type="text" className="input search-input" placeholder="Serach Sneaker" 
                     value={this.state.searchText} onChange={this.handleChange} 
              />
            </div>
            <div className="control">
              <button className="button" onClick={this.clearSearchText}>X</button>
            </div>
          </div>
        </div>
        {/* 跳转可以使用 Link标签 加 to属性 如 <Link to="/cart" className="cart-box"> */}
        <div className="cart-box" onClick={this.goCart}>
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-num">({this.props.cartNum})</span>
        </div>
      </div>
    )
  }
}

export default withRouter(ToolBox);