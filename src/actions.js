export const changeActiveItem = item => ({
  type: 'CHANGE_ACTIVE_ITEM',
  activeItem: item,
});

export const updateMessageText = text => ({
  type: 'UPDATE_MESSAGE_TEXT',
  messageText: text,
});
