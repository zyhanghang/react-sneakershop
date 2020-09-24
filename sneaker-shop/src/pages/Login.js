import React from 'react';
import axios from 'commons/axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


// react-hook-form 需要在函数式组件中使用
export default function Login(props) {

  const { register, handleSubmit, errors } = useForm(); 
  const onSubmit = async data => {
    // 1. 阻止默认事件行为，组件帮助处理
    // event.preventDefault();
    // 2. 获取表单数据
    // const formData = {
      // email: this.emailRef.current.value,
      // password: this.passwordRef.current.value
    // }
    
    // 3. 处理登录逻辑
    try {
      const { email, password } = data;
      const res = await axios.post('/auth/login', { email, password });
      const jwToken = res.data;
      global.auth.setToken(jwToken)
      toast.success('Login Success');
      // 4. 跳转到首页视图
      props.history.push('/');
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
    }
  }

  return (
    <div className="login-wrapper"> 
        <form action="" className="box login-box" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label className="label">Email</label>
            < div className="control">
              <input 
                className={`input ${errors.email && 'is-danger'}`} 
                type="text" 
                placeholder="Email" 
                name="email"
                ref={register({
                  required: 'email is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/,
                    message: 'invalid email'
                  }
                })}
                // value={this.state.email}
                // onChange={this.handleChange}
                // ref={this.emailRef} 
              />
              {
                errors.email && (<p className="helper has-text-danger">{errors.email.message}</p>) 
              }
            </div>
         </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input 
                className={`input ${errors.password && 'is-danger'}`}
                type="text" 
                placeholder="Password" 
                name="password"
                ref={register({
                  required: 'password is required',
                  minLength: {
                    value: 6,
                    message: 'password cannot be less than 6 digits'
                  }
                })}
                // value={this.state.password}
                // onChange={this.handleChange}
                // ref={this.passwordRef} 
              />
              {
                errors.password && (<p className="helper has-text-danger">{errors.password.message}</p>) 
              }
            </div>
          </div>
          <div className="control">
            <button className="button is-fullwidth is-primary">Login</button>
          </div>
        </form>
      </div>
  );
};


// class Login extends React.Component {

//   // 受控组件和非受控组件
//   // State
//   // 可以在constructor中用this.state = {}定义，也可以在外部用state = {}定义
//   // constructor() {
//   //   super();
//     // this.state = {
//     //   isLike: false,
//     // }
//   // }
//   state = {
//     email: '',
//     password: ''
//   };

//   // Refs
//   // 可以访问dom组件和自定义组件
//   // ref属性不能用在函数式声明的组件上(Header)，因为函数声明的组件没有实例
//   // emailRef = React.createRef();
//   // passwordRef = React.createRef();

//   handleSubmit = event => {
//     // 1. 阻止默认事件行为
//     event.preventDefault();
//     // 2. 获取表单数据
//     // const formData = {
//       // email: this.emailRef.current.value,
//       // password: this.passwordRef.current.value
//     // }
//     console.log(this.state);
//     // 3. 处理登录逻辑

//     // 4. 跳转到首页视图
//     // this.props.history.push('/');
//   }

//   handleChange = e => {
//     this.setState({
//       [e.target.name]: e.target.value,
//     });
//   }

//   render() {
//     return (
//       <div className="login-wrapper"> 
//         <form action="" className="box login-box" onSubmit={this.handleSubmit}>
//           <div className="field">
//             <label className="label">Name</label>
//             <div className="control">
//               <input class="input" type="text" placeholder="Name" />
//             </div>
//           </div>  
//           <div className="field">
//             <label className="label">Email</label>
//             < div className="control">
//               <input 
//                 class="input" 
//                 type="text" 
//                 placeholder="Email" 
//                 name="email"
//                 value={this.state.email}
//                 onChange={this.handleChange}
//                 // ref={this.emailRef} 
//               />
//             </div>
//          </div>
//           <div className="field">
//             <label className="label">Password</label>
//             <div className="control">
//               <input 
//                 class="input" 
//                 type="text" 
//                 placeholder="Password" 
//                 name="password"
//                 value={this.state.password}
//                 onChange={this.handleChange}
//                 // ref={this.passwordRef} 
//               />
//             </div>
//           </div>
//           <div className="control">
//             <button className="button is-fullwidth is-primary">Login</button>
//           </div>
//         </form>
//       </div>
//     );
//   }
// }

//  export default Login