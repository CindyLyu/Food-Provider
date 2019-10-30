import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth';
import { changeActiveItem } from '../actions';


const GoogleAuthContainer = props => <GoogleAuth {...props} />;

const mapDispatchToProps = dispatch => ({
  changeActiveItem: item => dispatch(changeActiveItem(item)),
});

export default withRouter(connect(null, mapDispatchToProps)(GoogleAuthContainer));
