import React, { PureComponent } from 'react';
import '../index.sass';
import { Message } from 'semantic-ui-react';


class MessageNotify extends PureComponent {
  handleTimeOut = () => setTimeout(() => {
    const { isShow } = this.props;
    isShow({
      message: false,
    });
  }, 6000);

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
        onTimeout={this.handleTimeOut()}
      />
    );
  }
}


export default MessageNotify;
