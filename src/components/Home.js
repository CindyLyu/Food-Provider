import React, { Component, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Icon,
  Card,
  Button,
} from 'semantic-ui-react';
import TextLoop from 'react-text-loop';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Section, SectionsSpy } from 'react-smart-sections';
import firebaseConfig from '../utils/firebaseConfig';
import { numberWithCommas, scrollToTop } from '../utils/functions';
import MessageNotify from './MessageNotify';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const plans = [
  {
    header: '小鳥胃',
    price: 1500,
    meta: '適合胃口不大的人',
    description:
      '適合胃口較小或是小資族的人，我們將精心挑選好吃的食物給你。',
  },
  {
    header: '能吃就是福',
    price: 2400,
    meta: 'Firends of Elliot',
    description:
      '給正常食量的你，聽說能夠好好享用食物就是上天賜給你最大的福氣。',
  },
  {
    header: '吃飽最重要',
    price: 3000,
    meta: 'Firends of Elliot',
    description:
      '不要再說減肥這個詞了，反正減肥永遠都是明天的事情，先吃飽再說！',
  },
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageDisplay: false,
      messageText: '',
      messageType: '',
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const actionCodeSettings = {
      url: 'https://project.cindylyu.tw/food_provider/',
      handleCodeInApp: true,
    };
    const isVerifyEmailSuccess = location.search === '?verifyEmail=success';
    if (isVerifyEmailSuccess) {
      this.setState({
        messageDisplay: true,
        messageText: '驗證成功',
        messageType: 'correct',
      });
    }

    // 註冊成功
    const message = localStorage.getItem('message');
    const isSignUpSuccess = message === '註冊成功';
    if (isSignUpSuccess) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      firebase
        .auth().onAuthStateChanged((user) => {
          if (user) {
            user.sendEmailVerification(actionCodeSettings)
              .then(() => {
                this.setState({
                  messageDisplay: true,
                  messageText: '註冊成功，驗證信已寄送，請至信箱查收並完成驗證',
                  messageType: 'correct',
                });
                localStorage.setItem('message', '');
              })
              .catch(error => {
                console.log('senderror', error);
              });
          }
        });
    }
    if (!isSignUpSuccess && message) {
      // 其他訊息
      this.setState({
        messageDisplay: true,
        messageText: message,
        messageType: 'correct',
      });
      localStorage.setItem('message', '');
    }
  }

  handlePurchase = (type, price) => {
    const { changeActiveItem, history } = this.props;
    if (!firebase.auth().currentUser) {
      scrollToTop();
      this.setState({
        messageDisplay: true,
        messageText: '請先登入或註冊',
        messageType: 'error',
      });
      return;
    }

    // 已登入尚未驗證信箱
    if (!firebase.auth().currentUser.emailVerified) {
      scrollToTop();
      this.setState({
        messageDisplay: true,
        messageText: '請先至信箱依據信件指示完成驗證',
        messageType: 'error',
      });
      return;
    }

    changeActiveItem('');
    const time = new Date();
    const orderNumber = `F${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}${time.getHours()}${time.getMinutes()}${time.getMilliseconds()}`;
    const userId = firebase.auth().currentUser.uid;
    const order = firebase.database().ref(`orders/${userId}/`);
    const newOrder = order.push();
    newOrder.set({
      orderNumber,
      type,
      price,
      status: '未完成',
    });
    history.push(`/order/${orderNumber}`);
  }

  handleActiveItem = sections => {
    const { changeActiveItem } = this.props;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].active) {
        changeActiveItem(sections[i].name);
      }
    }
  }

  handleMessageDisplay = data => {
    this.setState({
      messageDisplay: data.message,
    });
  }

  render() {
    const { messageDisplay, messageText, messageType } = this.state;
    return (
      <Fragment>
        <ScrollToTop />
        {messageDisplay
          && (
          <MessageNotify
            message={messageDisplay}
            isShow={this.handleMessageDisplay}
            type={messageType}
            text={messageText}
          />
          )}
        <Section name='Food Provider'>
          <div className='header__text' id='Food Provider'>
            我們來幫你解決
            <span className='header__text-comment'>世紀大難題</span>
            <div className='header__text-end'>
              「
              <TextLoop springConfig={{ stiffness: 100, damping: 10 }}>
                <span>早餐</span>
                <span>午餐</span>
                <span>晚餐</span>
              </TextLoop>
              要吃什麼？」
            </div>
          </div>
          <div className='header__mask' />
        </Section>
        <Section name='服務流程'>
          <div className='process' id='process'>
            <div className='process__content'>
              <div className='process__content-title'>
                流程
              </div>
              <div className='process__content-body'>
                <div className='process__content-body-step'>
                  <Icon name='mouse pointer' size='large' />
                  {window.innerWidth >= '770' && <br />}
                  選擇符合自己胃口的方案
                </div>
                <div>
                  <Icon
                    className='process__content-body-arrow'
                    name={window.innerWidth < '770' ? 'caret down' : 'triangle right'}
                    size='large'
                  />
                </div>
                <div className='process__content-body-step'>
                  <Icon name='write' size='large' />
                  {window.innerWidth >= '770' && <br />}
                  提供不吃 / 喜歡吃的食物資訊及配送時間、地址
                </div>
                <div>
                  <Icon
                    className='process__content-body-arrow'
                    name={window.innerWidth < '770' ? 'caret down' : 'triangle right'}
                    size='large'
                  />
                </div>
                <div className='process__content-body-step'>
                  <Icon name='tasks' size='large' />
                  {window.innerWidth >= '770' && <br />}
                  再次確認訂單內容及結帳
                </div>
                <div>
                  <Icon
                    className='process__content-body-arrow'
                    name={window.innerWidth < '770' ? 'caret down' : 'triangle right'}
                    size='large'
                  />
                </div>
                <div className='process__content-body-step'>
                  <Icon name='shipping fast' size='large' />
                  {window.innerWidth >= '770' && <br />}
                  等待預定時間食物的送達
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section name='選購方案'>
          <div className='plans'>
            <div className='plans__content' id='plans'>
              <div className='plans__content-title'>
                選購方案
              </div>
              <div className='plans__content-body'>
                <Card.Group>
                  {plans.map(item => (
                    <Card>
                      <Card.Content>
                        <Card.Header>{item.header}</Card.Header>
                        <Card.Description className='plans__content-body-price'>
                          <strong>
                            NT$
                            {numberWithCommas(item.price)}
                            <sub> / 30 次配送餐點</sub>
                          </strong>
                        </Card.Description>
                        <Card.Description className='plans__content-body-description'>
                          {item.description}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <div className='ui two buttons'>
                          <Button basic color='green' onClick={() => this.handlePurchase(item.header, item.price)}>
                            購買
                          </Button>
                        </div>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              </div>
            </div>
          </div>
        </Section>
        <SectionsSpy render={sections => {
          this.handleActiveItem(sections);
          return null;
        }}
        />
      </Fragment>
    );
  }
}

export default Home;
