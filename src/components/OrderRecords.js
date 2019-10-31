import React, { Component, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.sass';
import {
  Table,
  Accordion,
  Dimmer,
  Loader,
  Responsive,
  Icon,
  Pagination,
} from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../utils/firebaseConfig';
import { numberWithCommas, foodInfoArrayToString } from '../utils/functions';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

class OrderRecords extends Component {
  constructor() {
    super();
    this.state = {
      originalData: [],
      data: [],
      loading: true,
      responsive: '',
      activePage: 1,
    };
  }

  componentDidMount() {
    let data;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        if (userId) {
          firebase.database().ref(`orders/${userId}`).once('value')
            .then(result => {
              if (!result.val()) {
                this.setState({
                  data: '',
                  loading: false,
                });
                return;
              }
              const dataLength = Object.values(result.val()).length;
              const originalData = Object.values(result.val()).reverse();
              // 一頁五列，如果資料數超過 5 列
              if (dataLength > 5) {
                data = originalData.slice(0, 5); // 預設第一頁
              }
              this.setState({
                originalData,
                data,
              }, () => {
                this.setState({
                  loading: false,
                });
              });
            });
        }
      }
    });
    if (window.innerWidth > Responsive.onlyTablet.minWidth) {
      this.setState({
        responsive: 'tablet',
      });
    } else {
      this.setState({
        responsive: 'mobile',
      });
    }
  }

  componentDidUpdate(prevState, nextState) {
    const { activePage, originalData } = this.state;
    if (nextState.activePage !== activePage && nextState.activePage) {
      const startIndex = activePage === '1' ? 0 : 5 * (Number(activePage) - 1);
      const endIndex = 5 * Number(activePage);
      const data = originalData.slice(startIndex, endIndex);
      this.setState({
        data,
      });
    }
  }

  handlePagination = (e) => {
    const { type } = e.target;
    const page = e.target.innerText;
    const { activePage, originalData } = this.state;
    const maxPage = Math.ceil(originalData.length / 5);
    if (type === 'nextItem' && activePage <= maxPage) {
      this.setState({
        activePage: Number(activePage) + 1,
      });
    } else if (type === 'prevItem' && activePage !== 1) {
      this.setState({
        activePage: Number(activePage) - 1,
      });
    } else {
      this.setState({
        activePage: page,
      });
    }
  }

  panels = (
    shippingTime,
    shippingCycle,
    recipient,
    address,
    phone,
    notToEat,
    notToEatOther,
    wantToEat,
    wantToEatOther,
  ) => ([
    {
      key: 'details',
      title: '配送資訊',
      content: {
        content: (
          <Fragment>
            <div>
              配送起始日期及時間：{shippingTime}
            </div>
            <div>
              配送週期：{shippingCycle}
            </div>
            <div>
              收件者：{recipient}
            </div>
            <div>
              地址：{address}
            </div>
            <div>
              聯絡電話：{phone}
            </div>
            <div>
              不吃的食物：{notToEat}
              （其他：{notToEatOther})
            </div>
            <div>
              喜歡吃的食物：{wantToEat}（其他：{wantToEatOther})
            </div>
          </Fragment>
        ),
      },
    },
  ])

  render() {
    const {
      data, loading, responsive, originalData, activePage,
    } = this.state;
    return (
      <div className='records'>
        <ScrollToTop />
        {loading
          && (
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
          )}
        <div className='records__title'>
          <Icon name='clipboard list' />
          訂單記錄
        </div>
        <Table singleLine className='records__orders' textAlign={responsive === 'tablet' ? 'center' : 'left'}>
          <Table.Header>
            {responsive === 'tablet'
              && (
              <Table.Row>
                <Table.HeaderCell>訂單編號</Table.HeaderCell>
                <Table.HeaderCell>訂單狀態</Table.HeaderCell>
                <Table.HeaderCell>方案</Table.HeaderCell>
                <Table.HeaderCell>價格</Table.HeaderCell>
                <Table.HeaderCell>付款完成時間</Table.HeaderCell>
              </Table.Row>
              )}
          </Table.Header>
          <Table.Body>
            {!data
            && (
            <Table.Row>
              <Table.Cell colSpan='6' active>目前無任何資料</Table.Cell>
            </Table.Row>
            )}
            {data && data.map(item => (
              <Fragment>
                <Table.Row>
                  <Table.Cell className='records__orders-number'>
                    {responsive === 'mobile' && '訂單編號：'}
                    {item.orderNumber}
                  </Table.Cell>
                  <Table.Cell>
                    {responsive === 'mobile' && '訂單狀態：'}
                    {item.status}
                  </Table.Cell>
                  <Table.Cell>
                    {responsive === 'mobile' && '方案：'}
                    {item.type}
                  </Table.Cell>
                  <Table.Cell>
                    {responsive === 'mobile' && '價格：'}
                    {numberWithCommas(item.price)}
                  </Table.Cell>
                  <Table.Cell>
                    {responsive === 'mobile' && '付款完成時間：'}
                    {item.completedTime ? item.completedTime : '-'}
                  </Table.Cell>
                </Table.Row>
                <Table.Row positive className='records__orders-body'>
                  <Table.Cell colSpan='6' textAlign='left'>
                    <Accordion panels={
                      this.panels(
                        item.shippingTime,
                        item.shippingCycle,
                        item.recipient,
                        item.address,
                        item.phone,
                        foodInfoArrayToString(item.notToEat),
                        item.notToEatOther,
                        foodInfoArrayToString(item.wantToEat),
                        item.wantToEatOther,
                      )}
                    />
                  </Table.Cell>
                </Table.Row>
              </Fragment>
            ))}
          </Table.Body>
        </Table>
        {data
          && (
          <div className='records__pagination'>
            <Pagination
              onPageChange={this.handlePagination}
              boundaryRange={0}
              defaultActivePage={activePage}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={Math.ceil(originalData.length / 5)}
            />
          </div>
          )}
      </div>
    );
  }
}


export default OrderRecords;
