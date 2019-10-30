import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SignUp from '../components/SignUp';
import { changeActiveItem } from '../actions';


const SignUpContainer = props => <SignUp {...props} />;

const mapDispatchToProps = dispatch => ({
  changeActiveItem: item => dispatch(changeActiveItem(item)),
});

export default withRouter(connect(null, mapDispatchToProps)(SignUpContainer));
