import isToday from 'date-fns/isToday';
import format from 'date-fns/format';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';

import { truncateString } from '../../../../utils';
import { LabelStringSet } from '../../../../ui/Label';

export const getChannelTitle = (channel = {}, currentUserId, stringSet = LabelStringSet) => {
  if (!channel?.name && !channel?.members) {
    return stringSet.NO_TITLE;
  }
  if (channel?.name && channel.name !== 'Group Channel') {
    return channel.name;
  }
  if (channel?.members?.length === 1) {
    return stringSet.NO_MEMBERS;
  }
  return (channel?.members || [])
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => (nickname || stringSet.NO_NAME))
    .join(', ');
};

export const getLastMessageCreatedAt = ({
  channel,
  locale,
  stringSet,
}) => {
  const createdAt = channel?.lastMessage?.createdAt;
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return stringSet?.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, 'MMM d', optionalParam);
  }
  return format(createdAt, 'yyyy/M/d', optionalParam);
};

export const getTotalMembers = (channel) => (
  channel?.memberCount
    ? channel.memberCount
    : 0
);

const getPrettyLastMessage = (message = {}) => {
  const MAXLEN = 30;
  const { messageType, name } = message;
  if (messageType === 'file') {
    return truncateString(name, MAXLEN);
  }
  return message.message;
};

export const getLastMessage = (channel) => (channel?.lastMessage ? getPrettyLastMessage(channel?.lastMessage) : '');

export const getChannelUnreadMessageCount = (channel) => (
  channel?.unreadMessageCount
    ? channel.unreadMessageCount
    : 0
);
