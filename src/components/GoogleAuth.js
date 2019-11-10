import React, { Component } from 'react';
import {
  Button,
  Icon,
  Divider,
} from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../utils/firebaseConfig';


class GoogleAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: false,
    };
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase
      .auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            isSignIn: true,
          });
        }
      });
  }

  componentDidUpdate(prevState) {
    const { isSignIn } = this.state;
    const { changeActiveItem, type, history } = this.props;
    let messageText;
    if (type === '註冊') {
      messageText = '註冊成功，已登入帳戶';
    } else {
      messageText = '登入成功';
    }
    if (prevState.isSignIn !== isSignIn && isSignIn) {
      localStorage.setItem('message', messageText);
      changeActiveItem('Food Provider');
      history.push('/');
    }
  }

  handleGoogleSignUp = () => {
    firebase.auth().getRedirectResult()
      .then(result => {
        if (result.credential) {
          this.setState({
            isSignIn: true,
          });
        }
      });

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
  }

  render() {
    const { type } = this.props;
    return (
      <div className='signin__google'>
        <Button className='signin__google-button' onClick={this.handleGoogleSignUp} color='google plus'>
          <Icon name='google' />
           使用 Google {type}
        </Button>
        <Divider className='signin__horizontal' horizontal>Or</Divider>
      </div>
    );
  }
}


export default GoogleAuth;
