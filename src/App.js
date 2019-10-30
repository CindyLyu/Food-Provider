import React, { Component, useEffect } from 'react';
import './index.sass';
import {
  BrowserRouter, Route, Switch, useLocation,
} from 'react-router-dom';
import firebase from 'firebase/app';
import ResponsiveNav from './containers/Nav';
import Home from './containers/Home';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Footer from './components/Footer';
import OrderRecords from './components/OrderRecords';
import NotFound from './components/NotFound';
import Order from './components/Order';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from './utils/firebaseConfig';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: false,
    };
  }


  componentDidMount() {
    const { isSignIn } = this.state;
    if (!isSignIn) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      firebase
        .auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({
              isSignIn: true,
            });
          } else {
            this.setState({
              isSignIn: false,
            });
          }
        });
    }
  }

  handleSignOut = () => {
    const { changeActiveItem } = this.props;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase
      .auth().signOut()
      .then(() => {
        changeActiveItem('Food Provider');
        this.setState({
          isSignIn: false,
        });
      })
      .catch(err => {
        localStorage.setItem('message', '登出失敗');
        console.log(err);
      });
  }

  render() {
    const { isSignIn } = this.state;
    return (
      <BrowserRouter basename='food_provider'>
        <ResponsiveNav
          isSignIn={isSignIn}
          onSignOut={this.handleSignOut}
        >
          <ScrollToTop />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/sign_up' component={SignUp} />
            <Route exact path='/sign_in' component={SignIn} />
            <Route exact path='/order_records' component={OrderRecords} />
            <Route path='/order' component={Order} />
            <Route path='*'><NotFound /></Route>
          </Switch>
          <Footer />
        </ResponsiveNav>
      </BrowserRouter>
    );
  }
}


export default AppLayout;
