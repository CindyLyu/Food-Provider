import React from 'react';
import { connect } from 'react-redux';
import App from '../App';
import { changeActiveItem } from '../actions';


const AppContainer = props => <App {...props} />;

const mapDispatchToProps = dispatch => {
  return {
    changeActiveItem: item => dispatch(changeActiveItem(item)),
  };
};

export default connect(null, mapDispatchToProps)(AppContainer);
