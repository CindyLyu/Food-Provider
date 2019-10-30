import React, { PureComponent } from 'react';
import {
  Segment,
  Container,
  Icon,
} from 'semantic-ui-react';
import '../index.sass';


class Footer extends PureComponent {
  render() {
    return (
      <Segment className='footer' inverted vertical style={{ padding: '2em 0em' }}>
        <Container className='footer__body'>
          <Icon name='food' />
          Food Provider（ Cindy Lyu 練習作品
          <Icon className='footer__github' name="github" />
          ）
        </Container>
      </Segment>
    );
  }
}


export default Footer;
