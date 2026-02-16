import { apiFetch } from './fetcher';

export type ProfileData = {
  nickname: string;
  first_name: string;
  last_name?: string;
  patronymic?: string;
  additional_information?: string;
  birthday?: number;
  email?: string;
  gender?: string;
  country?: string;
  city_id?: number;
  phone?: string;
};

export type ProfileResponse = {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  additional_information: string;
  birthday: number;
  email: string;
  gender: string;
  gender_label: string;
  country: string;
  country_label: string;
  city_id: number;
  city: string;
  phone: string;
  avatar: string;
  avatar_url: string;
  avatar_webp: string;
  avatar_webp_url: string;
  is_doctor: boolean;
  is_confirmed_doctor: boolean;
  is_filled: boolean;
  is_staff: boolean;
};

export const getProfile = (): Promise<ProfileResponse> => {
  return apiFetch<ProfileResponse>('/api/proxy/api/v1/auth/messenger/profile/', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateProfile = (data: ProfileData): Promise<ProfileResponse> => {
  return apiFetch<ProfileResponse>('/api/proxy/api/v1/auth/messenger/profile/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteProfile = (uid: string): Promise<{ messages: string }> => {
  console.log('DELETE URL:', `/api/proxy/api/v1/auth/messenger/profile/${encodeURIComponent(uid)}/`);
  const url = `/api/proxy/api/v1/auth/messenger/profile/${encodeURIComponent(uid)}/`;

  return apiFetch<{ messages: string }>(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
