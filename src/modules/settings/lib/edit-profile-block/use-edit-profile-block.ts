import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProfileData } from 'shared/api/profile.api';
import { useGetProfile, useUpdateProfile } from 'shared/query/profile.query';

type ProfileDataForForm = {
  birthday: number | null;
  first_name: string;
  last_name: string;
  nickname: string;
  additional_information: string;
};

export type UseEditProfileBlockReturn = {
  birthday: Date | null;
  firstName: string;
  lastName: string;
  login: string;
  info: string;
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

  const [birthday, setBirthday] = useState<Date | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [info, setInfo] = useState<string>('');

  const { data: profile, isLoading: isLoadingProfile, error: errorProfile } = useGetProfile();

  const { mutate: updateProfile, isPending: isSaving, error: errorSave } = useUpdateProfile();

  const prevProfileUidRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (profile && profile.uid !== prevProfileUidRef.current) {
      prevProfileUidRef.current = profile.uid;

      setBirthday(profile.birthday ? new Date(profile.birthday * 1000) : null);
      setFirstName(profile.first_name);
      setLastName(profile.last_name || '');
      setLogin(profile.nickname);
      setInfo(profile.additional_information || '');
    }
  }, [profile]);

  const handleReturnButton = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  const handleBirthdayChange = useCallback((value: Date | null) => {
    setBirthday(value);
  }, []);

  const handleFirstNameChange = useCallback((value: string) => {
    setFirstName(value);
  }, []);

  const handleLastNameChange = useCallback((value: string) => {
    setLastName(value);
  }, []);

  const handleLoginChange = useCallback((value: string) => {
    setLogin(value);
  }, []);

  const handleInfoChange = useCallback((value: string) => {
    setInfo(value);
  }, []);

  const handleSave = useCallback(() => {
    const birthdayTimestamp = birthday ? Math.floor(birthday.getTime() / 1000) : null;

    const updatePayload: ProfileData = {
      nickname: login,
      first_name: firstName,
      last_name: lastName || undefined,
      additional_information: info || undefined,
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
  }, [birthday, firstName, lastName, login, info, updateProfile]);

  const typedErrorProfile: Error | null =
    errorProfile instanceof Error ? errorProfile : errorProfile ? new Error(String(errorProfile)) : null;
  const typedErrorSave: Error | null =
    errorSave instanceof Error ? errorSave : errorSave ? new Error(String(errorSave)) : null;

  return {
    birthday,
    firstName,
    lastName,
    login,
    info,
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