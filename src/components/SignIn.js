import React, { Component, Fragment } from 'react';
import {
  Input,
  Button,
  Form,
} from 'semantic-ui-react';
import firebase from 'firebase/app';
import GoogleAuth from '../containers/GoogleAuth';
import MessageNotify from './MessageNotify';
import 'firebase/auth';
import firebaseConfig from '../utils/firebaseConfig';
import { isEmailValid } from '../utils/functions';


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: false,
      messageDisplay: false,
      messageText: '',
      messageType: 'correct',
    };
  }

  handleSignIn = () => {
    const { email, password } = this.state;
    const { changeActiveItem, history } = this.props;

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase
      .auth().signInWithEmailAndPassword(email, password)
      .then(data => {
        if (!data.user.emailVerified) {
          localStorage.setItem('message', '請先至信箱收信並完成驗證方可啟用該帳戶');
        } else {
          localStorage.setItem('message', '登入成功');
          changeActiveItem('Food Provider');
          history.push('/');
        }
      })
      .catch(err => {
        let error;
        if (err.code === 'auth/user-disabled') {
          error = '該帳戶已被停用，如有疑問請洽管理者';
        }
        this.setState({
          messageDisplay: true,
          messageText: error || '帳號或密碼錯誤',
          messageType: 'error',
        });
      });
  }

  handleInputChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  // 與 SignUp 重複都有用到
  handleEmailValid = () => {
    const { email } = this.state;
    this.setState({
      emailError: !isEmailValid(email),
    });
  }

  handleMessageDisplay = (data) => {
    this.setState({
      messageDisplay: data.message,
    });
  }

  render() {
    const {
      email, password, emailError, messageDisplay, messageText, messageType,
    } = this.state;
    return (
      <Fragment>
        <div className='signin'>
          {messageDisplay
            && (
            <MessageNotify
              message={messageDisplay}
              isShow={this.handleMessageDisplay}
              type={messageType}
              text={messageText}
            />
            )}
          <div className='signin__background-image' />
          <GoogleAuth type='登入' />
          <div className='signin__area'>
            <div className='signin__title'>登入</div>
            <Form widths='equal'>
              <Form.Input
                className='signin__input-email'
                fluid
                name='email'
                value={email}
                error={emailError && { content: '請輸入有效的 email' }}
                placeholder='輸入 email'
                onChange={this.handleInputChange}
                onBlur={this.handleEmailValid}
              />
            </Form>
            <div>
              <Input
                className='signin__input-password'
                name='password'
                type='password'
                value={password}
                placeholder='輸入密碼'
                onChange={this.handleInputChange}
              />
            </div>
            <Button primary className='signin__input-submit' as='a' onClick={this.handleSignIn}>
              送出
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}


export default SignIn;
