import { apiFetch } from './fetcher';

// ============ СТАРЫЕ ФУНКЦИИ (для обратной совместимости) ============
export type GetCodePayload = {
  phone_number: string;
};

export type GetCodeResponse = {
  phone_number: string;
  code_len: number;
};

export const getAuthCode = (data: GetCodePayload): Promise<GetCodeResponse> => {
  return apiFetch<GetCodeResponse>('/api/auth/get-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export type GetTokenPayload = {
  phone_number: string;
  code: string;
};

export type GetTokenResponse = {
  is_filled: boolean;
};

export const getAuthToken = (data: GetTokenPayload): Promise<GetTokenResponse> => {
  return apiFetch<GetTokenResponse>('/api/auth/get-token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ============ НОВЫЕ ФУНКЦИИ ДЛЯ PLUSOFON ============

// 1. Старт сессии (аналог getAuthCode)
export type PlusofonStartPayload = {
  phone_number: string;
};

export type PlusofonStartResponse = {
  session_uid: string;
  session_secret: string;
  call_number: string;
  expires_at: string;
  poll_interval_seconds: number;
  attempt_number: number;
};

export const plusofonStart = (data: PlusofonStartPayload): Promise<PlusofonStartResponse> => {
  return apiFetch<PlusofonStartResponse>('/api/auth/start-plusofon-call', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 2. Проверка статуса (новый endpoint)
export type PlusofonStatusPayload = {
  session_uid: string;
  session_secret: string;
};

export type PlusofonStatusResponse = {
  session_uid: string;
  status: 'pending' | 'verified' | 'expired' | 'failed' | 'consumed';
  expires_at: string;
  verified_at: string | null;
  consumed_at: string | null;
  poll_interval_seconds: number;
  is_claim_validable: boolean;
};

export const plusofonStatus = (data: PlusofonStatusPayload): Promise<PlusofonStatusResponse> => {
  return apiFetch<PlusofonStatusResponse>('/api/auth/plusofon-status', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 3. Получение токенов (аналог getAuthToken)
export type PlusofonTokenPayload = {
  session_uid: string;
  session_secret: string;
};

export type PlusofonTokenResponse = {
  is_filled: boolean;
};

export const plusofonGetToken = (data: PlusofonTokenPayload): Promise<PlusofonTokenResponse> => {
  return apiFetch<PlusofonTokenResponse>('/api/auth/get-plusofon-token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 4. Удобная функция для полного цикла авторизации (с polling)
export const plusofonFullAuth = async (
  phoneNumber: string,
  onStatusChange?: (status: PlusofonStatusResponse) => void,
): Promise<{ success: boolean; is_filled?: boolean; error?: string }> => {
  try {
    // Шаг 1: Старт сессии
    const startData = await plusofonStart({ phone_number: phoneNumber });
    const { session_uid, session_secret, poll_interval_seconds } = startData;

    // Шаг 2: Polling статуса
    let isVerified = false;
    const maxAttempts = 60; // 2 минуты максимум (при интервале 2 секунды)
    let attempts = 0;

    while (!isVerified && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, poll_interval_seconds * 1000));

      const statusData = await plusofonStatus({ session_uid, session_secret });
      onStatusChange?.(statusData);

      if (statusData.status === 'verified') {
        isVerified = true;
        break;
      }

      if (statusData.status === 'expired' || statusData.status === 'failed') {
        return {
          success: false,
          error: `Сессия ${statusData.status}`,
        };
      }

      attempts++;
    }

    if (!isVerified) {
      return {
        success: false,
        error: 'Превышено время ожидания подтверждения',
      };
    }

    // Шаг 3: Получение токенов
    const tokenData = await plusofonGetToken({ session_uid, session_secret });

    return {
      success: true,
      is_filled: tokenData.is_filled,
    };
  } catch (error) {
    console.error('Plusofon full auth error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};
