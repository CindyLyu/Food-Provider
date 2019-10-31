import React, { Component, Fragment } from 'react';
import {
  Button,
  Form,
} from 'semantic-ui-react';
import firebase from 'firebase/app';
import GoogleAuth from '../containers/GoogleAuth';
import 'firebase/auth';
import firebaseConfig from '../utils/firebaseConfig';
import MessageNotify from './MessageNotify';
import { isEmailValid } from '../utils/functions';


class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordAgain: '',
      passwordError: false,
      emailError: false,
      messageDisplay: false,
      messageText: '',
      messageType: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { password, passwordAgain, passwordError } = this.state;
    if (prevState.passwordAgain !== passwordAgain || (prevState.password !== password && password && passwordAgain)) {
      if (passwordError === false && password !== passwordAgain) {
        this.setState({
          passwordError: true,
        });
      } else if (passwordError === true && password === passwordAgain) {
        this.setState({
          passwordError: false,
        });
      }
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit = () => {
    let {
      email, password, passwordAgain, messageText,
    } = this.state;
    const { changeActiveItem, history } = this.props;
    const isInvalid = password !== passwordAgain || password === '' || email === '';
    const passwordInvalid = password === passwordAgain;
    if (isInvalid || !passwordInvalid) {
      this.setState({
        messageDisplay: true,
        messageText: '資料未填寫完全',
        messageType: 'error',
      });
      return;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase
      .auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          messageDisplay: true,
          messageText: '註冊成功',
          messageType: 'correct',
        });
        localStorage.setItem('message', '註冊成功');
        changeActiveItem('Food Provider');
        history.push('/');
      })
      .catch(err => {
        this.setState({
          messageDisplay: true,
          messageText: '註冊失敗，請稍後再試',
          messageType: 'error',
        });
        switch (err.code) {
          case 'auth/invalid-email':
            messageText = 'email 格式有誤';
            break;
          case 'auth/weak-password':
            messageText = '密碼強度太低，請設定超過 6 個字元';
            break;
          case 'auth/email-already-in-use':
            messageText = 'email 已註冊過，請直接登入即可';
            break;
          case 'auth/operation-not-allowed':
            messageText = 'auth/operation-not-allowed';
            break;
          default:
            messageText = err.code;
        }
        this.setState({
          messageDisplay: true,
          messageText,
        });
      });
  }

  handleEmailValid = () => {
    const { email } = this.state;
    this.setState({
      emailError: !isEmailValid(email),
    });
  }

  handleMessageDisplay = data => {
    this.setState({
      messageDisplay: data.message,
    });
  }

  render() {
    const {
      email,
      password,
      passwordAgain,
      passwordError,
      emailError,
      messageDisplay,
      messageText,
      messageType,
    } = this.state;
    return (
      <Fragment>
        {messageDisplay
          && (
          <MessageNotify
            message={messageDisplay}
            isShow={this.handleMessageDisplay}
            type={messageType}
            text={messageText}
          />
          )}
        <div className='signup__background-image' />
        <GoogleAuth type='註冊' />
        <div className='signup'>
          <div className='signup__title'>註冊</div>
          <Form>
            <Form.Input
              fluid
              className='signup__input-email'
              error={emailError && { content: '請輸入有效的 email' }}
              placeholder='輸入 email'
              name='email'
              type='email'
              value={email}
              onChange={this.handleInputChange}
              onBlur={this.handleEmailValid}
            />
            <Form.Input
              className='signup__input-password'
              error={passwordError}
              placeholder='輸入密碼（至少 6 個字元）'
              name='password'
              type='password'
              value={password}
              onChange={this.handleInputChange}
            />
            <Form.Input
              fluid
              className='signup__input-passwordagain'
              error={passwordError && { content: '兩次密碼輸入不一致' }}
              placeholder='再次輸入密碼'
              name='passwordAgain'
              type='password'
              value={passwordAgain}
              onChange={this.handleInputChange}
            />
            <Button primary className='signup__input-submit' as='a' onClick={this.handleSubmit}>
              送出
            </Button>
          </Form>
        </div>
      </Fragment>
    );
  }
}


export default SignUp;
