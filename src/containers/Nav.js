import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Nav from '../components/Nav';
import { changeActiveItem } from '../actions';


const NavContainer = props => <Nav {...props} />;

const mapStateToProps = state => ({
  activeItem: state.activeItem,
});

const mapDispatchToProps = dispatch => ({
  changeActiveItem: item => dispatch(changeActiveItem(item)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavContainer));
