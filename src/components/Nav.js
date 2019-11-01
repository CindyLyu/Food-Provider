import React, { Component } from 'react';
import '../index.sass';
import {
  Button,
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';
import { HashLink as Link } from 'react-router-hash-link';
import { scrollToTop } from '../utils/functions';


function signOut(props) {
  const { onSignOut, location, history } = props;
  localStorage.setItem('message', '登出成功');
  if (location.pathname !== '/') {
    history.push('/');
  } else {
    history.go(0);
  }
  onSignOut({
    isSignOut: true,
  });
}

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class DesktopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: false,
    };
  }


  componentDidMount() {
    const { changeActiveItem, location } = this.props;
    if (location.hash === '#plans') {
      changeActiveItem('選購方案');
    } else if (location.hash === '#process') {
      changeActiveItem('服務流程');
    }
  }

  hideFixedMenu = () => this.setState({ fixed: false })

  showFixedMenu = () => this.setState({ fixed: true })

  handleItemClick = e => {
    const { changeActiveItem } = this.props;
    const item = e.target.innerText;
    changeActiveItem(item);
    if (item === 'Food Provider') {
      scrollToTop();
    }
  }

  handleSignOut = () => {
    signOut(this.props);
  }

  render() {
    const { children, activeItem, isSignIn } = this.props;
    const { fixed } = this.state;
    const isGeneralMenu = !!window.location.pathname.replace('/food_provider/', '');
    return (
      <Responsive
        getWidth={getWidth}
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            textAlign='center'
            vertical
          >
            <Menu
              pointing={!fixed && !isGeneralMenu}
              secondary={!fixed && !isGeneralMenu}
              size='large'
              fixed={fixed ? 'top' : null}
              menu={fixed}
              className={isGeneralMenu && !fixed ? 'nav general' : 'nav'}
              textAlign='center'
            >
              <Container>
                <Menu.Item
                  className='nav__item'
                  active={activeItem === 'Food Provider'}
                >
                  <Link
                    to='/'
                    className='nav__item-text'
                    onClick={this.handleItemClick}
                    active
                  >
                    <Icon name='food' />
                      Food Provider
                  </Link>
                </Menu.Item>
                <Menu.Item
                  className='nav__item'
                  active={activeItem === '服務流程'}
                >
                  <Link
                    smooth
                    to='/#process'
                    className='nav__item-text'
                    onClick={this.handleItemClick}
                  >
                    服務流程
                  </Link>
                </Menu.Item>
                <Menu.Item
                  className='nav__item'
                  active={activeItem === '選購方案'}
                >
                  <Link
                    smooth
                    to='/#plans'
                    className='nav__item-text'
                    onClick={this.handleItemClick}
                  >
                    選購方案
                  </Link>
                </Menu.Item>
                {isSignIn
                  && (
                  <Menu.Item
                    className='nav__issignin'
                    position='right'
                  >
                    <Link to='/order_records'>
                      <Button
                        color='orange'
                        className='nav__signin-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                        <Icon name='user' />
                        訂單記錄
                      </Button>
                    </Link>
                    <Button
                      basic
                      color='orange'
                      className='nav__sign-up-text'
                      onClick={this.handleSignOut}
                      as='a'
                    >
                      登出
                    </Button>
                  </Menu.Item>
                  )}
                {!isSignIn
                  && (
                  <Menu.Item className='nav__notsignin' position='right'>
                    <Link to='/sign_in'>
                      <Button
                        basic
                        color='orange'
                        className='nav__signin-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                      登入
                      </Button>
                    </Link>
                    <Link to='/sign_up'>
                      <Button
                        color='orange'
                        className='nav__sign-up-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                      註冊
                      </Button>
                    </Link>
                  </Menu.Item>
                  )}
              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {children}
      </Responsive>
    );
  }
}


class MobileNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: false,
    };
  }


  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  handleItemClick = e => {
    const { changeActiveItem } = this.props;
    const item = e.target.innerText;
    changeActiveItem(item);
    this.setState({
      sidebarOpened: false,
    });
  }

  handleSignOut = () => {
    signOut(this.props);
  }

  render() {
    const { children, isSignIn, activeItem } = this.props;
    const { sidebarOpened } = this.state;
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='overlay'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Link to='/'>
            <Menu.Item
              as='a'
              onClick={this.handleItemClick}
              active={activeItem === 'Food Provider'}
            >
              Food Provider
            </Menu.Item>
          </Link>
          <Link to='/#process'>
            <Menu.Item
              as='a'
              onClick={this.handleItemClick}
              active={activeItem === '服務流程'}
            >
              服務流程
            </Menu.Item>
          </Link>
          <Link smooth to='/#plans'>
            <Menu.Item
              as='a'
              onClick={this.handleItemClick}
              active={activeItem === '選購方案'}
            >
              選購方案
            </Menu.Item>
          </Link>
          {!isSignIn
            && (
            <Link to='/sign_in'>
              <Menu.Item
                as='a'
                onClick={this.handleItemClick}
                active={activeItem === '登入'}
              >
                登入
              </Menu.Item>
            </Link>
            )}
          {isSignIn
            && (
            <Link to='/sign_in'>
              <Menu.Item
                as='a'
                onClick={this.handleItemClick}
                active={activeItem === '登出'}
              >
                登出
              </Menu.Item>
            </Link>
            )}
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item
                  onClick={this.handleToggle}
                  className='nav__sidebar button'
                >
                  <Icon
                    name='sidebar'
                    color='orange'
                    className='nav__sidebar-icon'
                    inverted
                  />
                </Menu.Item>
                {isSignIn
                  && (
                  <Menu.Item className='nav__issignin' position='right'>
                    <Link to='/order_records'>
                      <Button
                        color='orange'
                        className='nav__signin-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                        <Icon name='user' />
                        訂單記錄
                      </Button>
                    </Link>
                    <Button
                      basic
                      color='orange'
                      className='nav__sign-up-text'
                      onClick={this.handleSignOut}
                      as='a'
                    >
                      登出
                    </Button>
                  </Menu.Item>
                  )}
                {!isSignIn
                  && (
                  <Menu.Item className='nav__notsignin' position='right'>
                    <Link to='/sign_in'>
                      <Button
                        basic
                        color='orange'
                        className='nav__signin-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                      登入
                      </Button>
                    </Link>
                    <Link to='/sign_up'>
                      <Button
                        color='orange'
                        className='nav__sign-up-text'
                        onClick={this.handleItemClick}
                        as='a'
                      >
                      註冊
                      </Button>
                    </Link>
                  </Menu.Item>
                  )}
              </Menu>
            </Container>
          </Segment>
          {children}
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}


const ResponsiveNav = props => (
  <div>
    <DesktopNav {...props}>{props.children}</DesktopNav>
    <MobileNav {...props}>{props.children}</MobileNav>
  </div>
);


export default ResponsiveNav;
