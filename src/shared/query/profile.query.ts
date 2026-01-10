'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ProfileResponse, updateProfile } from '../api/profile.api';

export type UpdateProfilePayload = {
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
  phone: string;
};

export const useUpdateProfile = (): UseMutationResult<ProfileResponse, unknown, UpdateProfilePayload, unknown> => {
  return useMutation({
    mutationFn: updateProfile,
  });
};
