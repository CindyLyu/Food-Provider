import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import '../index.sass';
import {
  Segment,
  Icon,
  Header,
  Button,
} from 'semantic-ui-react';

class NoMatch extends PureComponent {
  handleGoToIndex = () => {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    return (
      <div>
        <Segment placeholder className='nomatch'>
          <Header icon>
            <Icon name='times circle outline' />
            404 Not Found
            <br />
            您所尋找的頁面不存在
          </Header>
          <Button primary onClick={this.handleGoToIndex}>回首頁</Button>
        </Segment>
      </div>
    );
  }
}


export default withRouter(NoMatch);
