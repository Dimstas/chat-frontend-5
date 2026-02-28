// src/modules/settings/lib/edit-profile-block/use-edit-profile-block.ts
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { ProfileData } from 'shared/api/profile.api';
import { useGetProfile, useUpdateProfile } from 'shared/query/profile.query';

type State = {
  birthday: Date | null;
  firstName: string;
  lastName: string;
  login: string;
  info: string;
};

type Action =
  | { type: 'SET_BIRTHDAY'; payload: Date | null }
  | { type: 'SET_FIRST_NAME'; payload: string }
  | { type: 'SET_LAST_NAME'; payload: string }
  | { type: 'SET_LOGIN'; payload: string }
  | { type: 'SET_INFO'; payload: string }
  | { type: 'RESET_FROM_PROFILE'; payload: ProfileData };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BIRTHDAY':
      return { ...state, birthday: action.payload };
    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.payload };
    case 'SET_LAST_NAME':
      return { ...state, lastName: action.payload };
    case 'SET_LOGIN':
      return { ...state, login: action.payload };
    case 'SET_INFO':
      return { ...state, info: action.payload };
    case 'RESET_FROM_PROFILE':
      return {
        birthday: action.payload.birthday ? new Date(action.payload.birthday * 1000) : null,
        firstName: action.payload.first_name,
        lastName: action.payload.last_name || '',
        login: action.payload.nickname,
        info: action.payload.additional_information || '',
      };
    default:
      return state;
  }
};

export type UseEditProfileBlockReturn = State & {
  isLoadingProfile: boolean;
  isSaving: boolean;
  errorProfile: Error | null;
  errorSave: Error | null;
  handleBirthdayChange: (date: Date | null) => void;
  handleFirstNameChange: (value: string) => void;
  handleLastNameChange: (value: string) => void;
  handleLoginChange: (value: string) => void;
  handleInfoChange: (value: string) => void;
  handleReturnButton: () => void;
  handleSave: () => void;
};

export const useEditProfileBlock = (): UseEditProfileBlockReturn => {
  const router = useRouter();

  const { data: profile, isLoading: isLoadingProfile, error: errorProfile } = useGetProfile();
  const { mutate: updateProfile, isPending: isSaving, error: errorSave } = useUpdateProfile();

  const [state, dispatch] = useReducer(reducer, {
    birthday: null,
    firstName: '',
    lastName: '',
    login: '',
    info: '',
  });

  const prevProfileUidRef = useRef<string | undefined>(undefined);
  const initialLoadDoneRef = useRef(false);

  // Используем useEffect с флагом для начальной загрузки
  useEffect(() => {
    if (profile && !initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      prevProfileUidRef.current = profile.uid;

      // Используем dispatch вместо setState
      dispatch({ type: 'RESET_FROM_PROFILE', payload: profile });
    }
  }, [profile]);

  // Обновление при изменении профиля (кроме первого раза)
  useEffect(() => {
    if (profile && profile.uid !== prevProfileUidRef.current && initialLoadDoneRef.current) {
      prevProfileUidRef.current = profile.uid;

      // Используем dispatch вместо setState
      dispatch({ type: 'RESET_FROM_PROFILE', payload: profile });
    }
  }, [profile]);

  const handleReturnButton = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const handleBirthdayChange = useCallback((value: Date | null) => {
    dispatch({ type: 'SET_BIRTHDAY', payload: value });
  }, []);

  const handleFirstNameChange = useCallback((value: string) => {
    dispatch({ type: 'SET_FIRST_NAME', payload: value });
  }, []);

  const handleLastNameChange = useCallback((value: string) => {
    dispatch({ type: 'SET_LAST_NAME', payload: value });
  }, []);

  const handleLoginChange = useCallback((value: string) => {
    dispatch({ type: 'SET_LOGIN', payload: value });
  }, []);

  const handleInfoChange = useCallback((value: string) => {
    dispatch({ type: 'SET_INFO', payload: value });
  }, []);

  const handleSave = useCallback(() => {
    const birthdayTimestamp = state.birthday ? Math.floor(state.birthday.getTime() / 1000) : null;

    const updatePayload: ProfileData = {
      nickname: state.login,
      first_name: state.firstName,
      last_name: state.lastName || undefined,
      additional_information: state.info || undefined,
      birthday: birthdayTimestamp || undefined,
    };

    console.log('Sending profile update:', updatePayload);

    updateProfile(updatePayload, {
      onSuccess: (data) => {
        console.log('Profile updated successfully:', data);
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  }, [state, updateProfile]);

  const typedErrorProfile: Error | null =
    errorProfile instanceof Error ? errorProfile : errorProfile ? new Error(String(errorProfile)) : null;
  const typedErrorSave: Error | null =
    errorSave instanceof Error ? errorSave : errorSave ? new Error(String(errorSave)) : null;

  return {
    ...state,
    isLoadingProfile,
    isSaving,
    errorProfile: typedErrorProfile,
    errorSave: typedErrorSave,
    handleBirthdayChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleLoginChange,
    handleInfoChange,
    handleReturnButton,
    handleSave,
  };
};
