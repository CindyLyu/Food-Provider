import React, { PureComponent } from 'react';
import '../index.sass';
import { Message } from 'semantic-ui-react';


class MessageNotify extends PureComponent {

  componentDidMount() {
    this.timer = setTimeout(() => {
      const { isShow } = this.props;
      isShow({
        message: false,
      });
    }, 6000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleDismiss = () => {
    const { isShow } = this.props;
    isShow({
      message: false,
    });
  }

  render() {
    const { type, text, message } = this.props;
    return (
      <Message
        className='message'
        hidden={!message}
        compact
        color={(type === 'error' && 'red') || (type === 'correct' && 'yellow')}
        onDismiss={this.handleDismiss}
        content={text}
      />
    );
  }
}


export default MessageNotify;
