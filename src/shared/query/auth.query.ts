import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getAuthCode,
  getAuthToken,
  GetCodePayload,
  GetCodeResponse,
  GetTokenPayload,
  GetTokenResponse,
  checkUniqueName,
  GetUniqueNameCheckResponse,
} from '../api/auth.api';

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

export const useCheckUniqueName = (nickname: string): UseQueryResult<GetUniqueNameCheckResponse, unknown> => {
  return useQuery({
    queryKey: ['unique-name-check', nickname],
    queryFn: () => checkUniqueName(nickname),
    enabled: !!nickname,
    staleTime: 5 * 60 * 1000,
   });
};