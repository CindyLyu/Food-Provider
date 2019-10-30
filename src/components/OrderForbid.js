import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../index.sass';
import {
  Segment,
  Icon,
  Header,
  Button,
} from 'semantic-ui-react';
import { HashLink as Link } from 'react-router-hash-link';


class NoMatch extends Component {
  handleGoToIndex = () => {
    const { history } = this.props;
    history.push('/#plans');
  }

  render() {
    return (
      <div>
        <Segment placeholder className='nomatch'>
          <Header icon>
            <Icon name='exclamation triangle' />
            此訂單已完成或是失效，請至訂單紀錄查看
            <br />
            如需新增訂單請至選購方案購買
          </Header>
          <Link smooth to='/#plans'>
            <Button primary onClick={this.handleGoToIndex}>
              選購方案
            </Button>
          </Link>
        </Segment>
      </div>
    );
  }
}


export default withRouter(NoMatch);
