import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { changeActiveItem } from '../actions';


const HomeContainer = props => <Home {...props} />;

const mapDispatchToProps = dispatch => {
  return {
    changeActiveItem: item => dispatch(changeActiveItem(item)),
  };
};

export default connect(null, mapDispatchToProps)(HomeContainer);
