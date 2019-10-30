import React, { Component, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.sass';
import {
  Step,
  Icon,
  Form,
  Segment,
  Dimmer,
  Loader,
  Button,
  Divider,
  Header,
  Checkbox,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import firebase from 'firebase/app';
import NotFound from './NotFound';
import OrderForbid from './OrderForbid';
import MessageNotify from './MessageNotify';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../utils/firebaseConfig';
import {
  foodInfoArrayToString,
  patchDigit,
  numberWithCommas,
  scrollToTop,
} from '../utils/functions';


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const notToEatOptions = ['韭菜', '薑', '香菜', '蒜', '蔥', '其他'];

const wantToEatOptions = ['中式（炒飯、乾麵...）', '西式（燉飯、義大利麵...）', '美式（漢堡...）', '其他'];

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      messageDisplay: false,
      messageText: '',
      userId: '',
      currentOrderKey: '',
      orderNumber: '',
      orderType: '',
      orderPrice: '',
      step: 1,
      shippingTime: '',
      shippingCycle: 'day',
      recipient: '',
      address: '',
      phone: '',
      notToEat: [],
      notToEatOther: '',
      wantToEat: [],
      wantToEatOther: '',
      notToEatOtherTextAreaDisplay: false,
      wantToEatOtherTextAreaDisplay: false,
      recipientError: false,
      shippingTimeError: false,
      addressError: false,
      phoneError: false,
      notFound: false,
      orderCompleted: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    let orders = [];
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const orderNumber = location.pathname.replace('/order/', '');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        if (userId) {
          firebase.database().ref(`orders/${userId}`).orderByChild('orderNumber').equalTo(orderNumber)
            .once('value')
            .then(result => {
              orders = result.val();
              if (orders) {
                const currentOrder = Object.values(orders)[0];
                if (currentOrder.status === '未完成') {
                  this.setState({
                    userId,
                    currentOrderKey: Object.keys(orders)[0],
                    orderNumber: currentOrder.orderNumber,
                    orderType: currentOrder.type,
                    orderPrice: currentOrder.price,
                  }, () => {
                    this.setState({
                      loading: false,
                    });
                  });
                } else {
                  this.setState({
                    orderCompleted: true,
                    step: 0,
                  }, () => {
                    this.setState({
                      loading: false,
                    });
                  });
                }
              } else {
                this.setState({
                  notFound: true,
                }, () => {
                  this.setState({
                    loading: false,
                    step: 0,
                  });
                });
              }
            });
        }
      }
    });
  }

  componentDidUpdate(prevState) {
    const {
      step,
      orderNumber,
      orderType,
      orderPrice,
      currentOrderKey,
      userId,
      shippingTime,
      shippingCycle,
      recipient,
      address,
      phone,
      notToEat,
      notToEatOther,
      wantToEat,
      wantToEatOther,
    } = this.state;
    if (prevState.step !== step && step === 3) {
      const time = new Date();
      const completedTime = `${time.getFullYear()}/${
        patchDigit((time.getMonth() + 1))}/${
        patchDigit(time.getDate())} ${
        patchDigit(time.getHours())}:${
        patchDigit(time.getMinutes())}:${
        patchDigit(time.getSeconds())}`;

      const order = firebase.database().ref(`orders/${userId}/${currentOrderKey}/`);
      order.set({
        orderNumber,
        type: orderType,
        price: orderPrice,
        status: '付款完成',
        shippingTime: shippingTime.toString(),
        shippingCycle: (shippingCycle === 'day' && '每天') || (shippingCycle === 'week' && '隔週') || (shippingCycle === 'month' && '隔月'),
        recipient,
        address,
        phone,
        notToEat,
        notToEatOther,
        wantToEat,
        wantToEatOther,
        completedTime,
      });
    }
  }

  handleNextStep = () => {
    let { step } = this.state;
    this.setState({
      step: step += 1,
    });
  }

  handlePrevStep = () => {
    let { step } = this.state;
    this.setState({
      step: step -= 1,
    });
  }

  handleSubmit = () => {
    const {
      shippingTime, recipient, address, phone, step,
    } = this.state;
    if ((step === 1 && !shippingTime) || !recipient || !address || !phone) {
      this.setState({
        messageDisplay: true,
        messageText: '請檢查未填寫欄位',
      });
      scrollToTop();
    } else {
      this.handleNextStep();
    }
  }

  handleDateChange = date => {
    this.setState({
      shippingTime: date,
    });
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleInputError = e => {
    if (!e.target.value) {
      this.setState({
        [`${e.target.name}Error`]: true,
      });
    } else {
      this.setState({
        [`${e.target.name}Error`]: false,
      });
    }
  }


  handleCheckBox = (type, food) => {
    const {
      notToEat,
      wantToEat,
      notToEatOtherTextAreaDisplay,
      wantToEatOtherTextAreaDisplay,
    } = this.state;

    let newArray;

    if (type === 'wantToEat') {
      if (wantToEat.indexOf(food) >= 0) {
        // 已經有在裡面的話刪除
        newArray = [...wantToEat];
        const newIndex = wantToEat.indexOf(food);
        newArray.splice(newIndex, 1);
      } else {
        // 增加
        newArray = [...wantToEat, food];
      }
      this.setState({
        wantToEat: newArray,
      });
    }

    if (type === 'notToEat') {
      if (notToEat.indexOf(food) >= 0) {
        newArray = [...notToEat];
        const newIndex = notToEat.indexOf(food);
        newArray.splice(newIndex, 1);
      } else {
        newArray = [...notToEat, food];
      }
      this.setState({
        notToEat: newArray,
      });
    }

    // 勾選其他
    if (food === '其他' && type === 'wantToEat') {
      this.setState({
        wantToEatOtherTextAreaDisplay: !wantToEatOtherTextAreaDisplay,
      });
    } else if (food === '其他' && type === 'notToEat') {
      this.setState({
        notToEatOtherTextAreaDisplay: !notToEatOtherTextAreaDisplay,
      });
    }
  }

  handleOrderInvalid = () => {
    const {
      orderNumber,
      orderType,
      orderPrice,
      currentOrderKey,
      userId,
    } = this.state;
    const { history } = this.props;
    const order = firebase.database().ref(`orders/${userId}/${currentOrderKey}/`);
    order.set({
      orderNumber,
      type: orderType,
      price: orderPrice,
      status: '已失效',
    });
    localStorage.setItem('message', '訂單已取消');
    history.push('/');
  }

  handleMessageDisplay = data => {
    this.setState({
      messageDisplay: data.message,
    });
  }

  render() {
    const {
      loading,
      orderNumber,
      orderType,
      orderPrice,
      step,
      notToEatOtherTextAreaDisplay,
      wantToEatOtherTextAreaDisplay,
      recipient,
      phone,
      notToEatOther,
      wantToEatOther,
      shippingTime,
      shippingCycle,
      address,
      notToEat,
      wantToEat,
      recipientError,
      addressError,
      phoneError,
      shippingTimeError,
      messageDisplay,
      messageText,
      notFound,
      orderCompleted,
    } = this.state;
    return (
      <div className='order'>
        <ScrollToTop />
        {messageDisplay && <MessageNotify message={messageDisplay} isShow={this.handleMessageDisplay} type='error' text={messageText} />}
        {orderCompleted && <OrderForbid />}
        {notFound && <NotFound />}
        {loading
          && (
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
          )}
        {!notFound && !orderCompleted
          && (
          <Step.Group attached='top' className='order__step'>
            <Step active={step === 1 && 'active'} disabled={step !== 1 && 'disabled'}>
              <Icon name='write' />
              <Step.Content>
                <Step.Title>填寫資訊</Step.Title>
                <Step.Description>Choose your shipping options</Step.Description>
              </Step.Content>
            </Step>
            <Step active={step === 2 && 'active'} disabled={step !== 2 && 'disabled'}>
              <Icon name='tasks' />
              <Step.Content>
                <Step.Title>確認及付款</Step.Title>
                <Step.Description>Enter billing information</Step.Description>
              </Step.Content>
            </Step>
            <Step active={step === 3 && 'active'} disabled={step !== 3 && 'disabled'}>
              <Icon name='check circle' />
              <Step.Content>
                <Step.Title>完成訂單</Step.Title>
                <Step.Description>Enter billing information</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
          )}
        {step === 1
          && (
          <div className='order__content'>
            <ScrollToTop />
            <div className='order__content-number'>
訂單編號：
              {orderNumber}
            </div>
            <div className='order__content-type'>
方案：
              {orderType}
            </div>
            <div className='order__content-price'>
價格：
              {numberWithCommas(orderPrice)}
            </div>
            <Divider horizontal>
              <Header as='h4' className='order__content-horizontal'>
                <Icon name='shipping' />
                配送資訊
              </Header>
            </Divider>
            <div className='order__content-message'>以下配送資訊欄位均為必填</div>
            <Form>
              <div className='order__content-shippingtime'>
                <div className='order__content-shippingtime-text'>配送起始日期及時間</div>
                <div>
                  <DatePicker
                    className={shippingTimeError ? 'order__content-shippingtime-datepicker error' : 'order__content-shippingtime-datepicker'}
                    name='shippingTime'
                    minDate={new Date()}
                    value={shippingTime}
                    selected={shippingTime}
                    onChange={this.handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="yyyy/MM/dd hh:mm aa"
                    onBlur={this.handleInputError}
                  />
                </div>
                {shippingTimeError && <div className='order__content-shippingtime-error'>請填寫日期和時間</div>}
              </div>
              <Form.Group>
                <div className='order__content-shippingcycle'>
                  <div className='order__content-shippingcycle-text'>配送週期</div>
                  <div>
                    <select
                      name='shippingCycle'
                      onChange={this.handleInputChange}
                      value={shippingCycle}
                    >
                      <option value='day'>每天</option>
                      <option value='week'>隔週</option>
                      <option value='month'>隔月</option>
                    </select>
                  </div>
                </div>
              </Form.Group>
              <Form.Field
                error={recipientError && '請填寫收件者'}
                label='收件者'
                name='recipient'
                control='input'
                value={recipient || ''}
                onChange={this.handleInputChange}
                onBlur={this.handleInputError}
              />
              <Form.Field
                error={addressError && '請填寫地址'}
                label='地址'
                name='address'
                control='input'
                value={address || ''}
                onChange={this.handleInputChange}
                onBlur={this.handleInputError}
              />
              <Form.Field
                error={phoneError && '請填寫電話'}
                label='聯絡電話'
                name='phone'
                control='input'
                value={phone || ''}
                onChange={this.handleInputChange}
                onBlur={this.handleInputError}
              />
              <Divider horizontal>
                <Header as='h4' className='order__content-horizontal'>
                  <Icon name='food' />
                  食物資訊
                </Header>
              </Divider>
              <Form.Group grouped className='order__content-notToEat'>
                <label>請告訴我們你不吃的食物（我們將避免這些食物出現在你的餐點當中）</label>
                {notToEatOptions.map(item => {
                  if (notToEat.indexOf(item) >= 0) {
                    return (
                      <div>
                        <label className='order__content-notToEat-item'>
                          <Checkbox checked onChange={() => this.handleCheckBox('notToEat', item)} />
                          {item}
                        </label>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <label className='order__content-notToEat-item'>
                        <Checkbox checked={false} onChange={() => this.handleCheckBox('notToEat', item)} />
                        {item}
                      </label>
                    </div>
                  );
                })}
                <Form.Field
                  className={!notToEatOtherTextAreaDisplay ? 'hidden order__content-textarea' : 'order__content-textarea'}
                  name='notToEatOther'
                  control='textarea'
                  rows='3'
                  value={notToEatOther || ''}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group grouped className='order__content-wantToEat'>
                <label>也請告訴我們你喜歡吃的食物種類（我們會依據你的喜好來提供餐點）</label>
                {wantToEatOptions.map(item => {
                  if (wantToEat.indexOf(item) >= 0) {
                    return (
                      <div>
                        <label className='order__content-wantToEat-item'>
                          <Checkbox checked onChange={() => this.handleCheckBox('wantToEat', item)} />
                          {item}
                        </label>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <label className='order__content-wantToEat-item'>
                        <Checkbox checked={false} onChange={() => this.handleCheckBox('wantToEat', item)} />
                        {item}
                      </label>
                    </div>
                  );
                })}
                <Form.Field
                  className={!wantToEatOtherTextAreaDisplay ? 'hidden order__content-textarea' : 'order__content-textarea'}
                  name='wantToEatOther'
                  control='textarea'
                  rows='3'
                  value={wantToEatOther || ''}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button secondary onClick={this.handleOrderInvalid} className='order__content-cancel'>取消訂單</Button>
              <Button primary onClick={this.handleSubmit} type='submit'>下一步</Button>
            </Form>
          </div>
          )}
        {step === 2
           && (
           <div className='order__content'>
             <ScrollToTop />
             <div className='order__content-warning'>請確認以下資訊無誤，再執行付款</div>
             <div>
訂單編號：
               {orderNumber}
             </div>
             <div>
方案：
               {orderType}
             </div>
             <div>
價格：
               {numberWithCommas(orderPrice)}
             </div>
             <Divider horizontal>
               <Header as='h4' className='order__content-horizontal'>
                 <Icon name='shipping' />
                 配送資訊
               </Header>
             </Divider>
             <div>
配送起始日期及時間：
               {shippingTime.toString()}
             </div>
             <div>
               配送週期：
               {
                 (shippingCycle === 'day' && '每天')
                 || (shippingCycle === 'week' && '隔週')
                 || (shippingCycle === 'month' && '隔月')
               }
             </div>
             <div>
收件者：
               {recipient}
             </div>
             <div>
地址：
               {address}
             </div>
             <div>
聯絡電話：
               {phone}
             </div>
             <Divider horizontal>
               <Header as='h4' className='order__content-horizontal'>
                 <Icon name='food' />
                 食物資訊
               </Header>
             </Divider>
             <div>
               不吃的食物：
               {foodInfoArrayToString(notToEat)}
               <br />
其他：
               {notToEatOther}
             </div>
             <div>
               喜歡吃的食物：
               {foodInfoArrayToString(wantToEat)}
               <br />
其他：
               {wantToEatOther}
             </div>
             <Button onClick={this.handlePrevStep} className='order__content-back' secondary>回上一步</Button>
             <Button primary onClick={this.handleSubmit} type='payment'>付款</Button>
           </div>
           )}
        {step === 3
          && (
          <div>
            <Segment placeholder className='order__content completed'>
              <Header icon>
                <Icon name='check circle outline' size='huge' />
                <br />
                訂單完成！如有需要暫停送餐請提前三天聯絡我們，我們也將保留您購買的送餐的次數。
              </Header>
            </Segment>
          </div>
          )}
      </div>
    );
  }
}


export default Order;
