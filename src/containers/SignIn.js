import React from 'react';
import { connect } from 'react-redux';
import SignIn from '../components/SignIn';
import { changeActiveItem } from '../actions';


const SignInContainer = props => <SignIn {...props} />;

const mapDispatchToProps = dispatch => {
  return {
    changeActiveItem: item => dispatch(changeActiveItem(item)),
  };
};

export default connect(null, mapDispatchToProps)(SignInContainer);
