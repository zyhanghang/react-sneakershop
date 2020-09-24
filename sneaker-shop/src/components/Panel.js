/**
 * 子组件作为参数传递并渲染
 * 子组件可以关闭弹出层 (在AddInventory中控制弹出层的关闭)
 * 子组件和调用者可以通讯 (回调函数)
 */
import React from 'react';
import { render } from 'react-dom';

class Panel extends React.Component {
  state = {
    active: false,
    component: null,
    callback: () => {}
  };

  open = (options = {
    //不传值时的默认
    props: {},
    component: null,
    callback: () => {}
  }) => {
    const { props, component, callback } = options;
    // key 值变化组件会重新渲染
    const _key = new Date().getTime();
    // component是一个构造函数，要求将其转换为组件
    // 将close函数作为参数传递给子组件，使子组件可以关闭Panel
    const _component = React.createElement(component, { 
      ...props,
      close : this.close, 
      key: _key 
    });
    this.setState({
      active: true,
      component: _component,
      callback: callback
    });
  };

  close = data => {
    this.setState({
      active: false
    });
    this.state.callback(data);
  };

  render() {
    const _class = {
      true: 'panel-wrapper active',
      false: 'panel-wrapper'
    };
    return (
      <div className={_class[this.state.active]}>
        <div className="over-layer" onClick={ () => {this.close();}}></div>
        <div className="panel">
          <div className="head">
            <span className="close" onClick={ () => {this.close();}}>x</span>
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

const _div = document.createElement('div');
document.body.appendChild(_div);

const _panel = render(<Panel />, _div);
console.log(_panel);
export default _panel;