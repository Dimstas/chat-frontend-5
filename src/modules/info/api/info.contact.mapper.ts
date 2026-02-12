import { ProfileInfo } from '../entity/info.entity';
import { InfoProfileApi } from '../model/info.api.schema';

export const mapInfoProfileFromApi = (api: InfoProfileApi): ProfileInfo => {
  const {
    uid,
    is_deleted,
    username,
    nickname,
    first_name,
    last_name,
    avatar,
    avatar_url,
    avatar_webp,
    avatar_webp_url,
    is_filled,
    additional_information,
    birthday,
    is_online,
    was_online_at,
    is_blocked,
    chat_id,
  } = api;

  return {
    uid,
    isDeleted: is_deleted,
    userName: username,
    nickName: nickname,
    firstName: first_name,
    lastName: last_name,
    avatar,
    avatarUrl: avatar_url,
    avatarWebp: avatar_webp,
    avatarWebpUrl: avatar_webp_url,
    isFilled: is_filled,
    additionalInformation: additional_information,
    birthday,
    isOnline: is_online,
    wasOnlineAt: was_online_at,
    isBlocked: is_blocked,
    chatId: chat_id,
  };
};
