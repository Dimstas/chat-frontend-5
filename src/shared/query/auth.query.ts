import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  getAuthCode,
  getAuthToken,
  GetCodePayload,
  GetCodeResponse,
  GetTokenPayload,
  GetTokenResponse,
} from 'shared/api/auth.api';

export const useGetAuthCode = (): UseMutationResult<GetCodeResponse, unknown, GetCodePayload, unknown> => {
  return useMutation({
    mutationFn: getAuthCode,
  });
};

export const useGetAuthToken = (): UseMutationResult<GetTokenResponse, unknown, GetTokenPayload, unknown> => {
  return useMutation({
    mutationFn: getAuthToken,
  });
};
