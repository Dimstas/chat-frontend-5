'use client';

import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import { useImageUpload } from 'modules/settings/lib/edit-profile-block/use-image-upload';
import { ImageCropperModal } from 'modules/settings/ui/image-cropper/image-cropper-modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import { ButtonUI } from 'shared/ui';
import DualInput from '../dual-input/dual-input';
import GroupTypeSelect from '../group-type-select/group-type-select';
import styles from './create-new-group-block.module.scss';

export const CreateNewGroupBlock: React.FC = (): JSX.Element => {
  const { setGroupData } = useNewGroupStore();
  const router = useRouter();

  const {
    selectedFile,
    previewUrl,
    error: imageUploadError,
    handleFileChange,
    triggerFileSelect,
    fileInputRef,
    isCropperOpen,
    closeCropper,
  } = useImageUpload();

  const [croppedZoom, setCroppedZoom] = useState<number | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState<'public-group' | 'private-group' | 'public-channel' | 'private-channel'>(
    'private-group',
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setGroupData({ avatarPreview: previewUrl });
    }
  }, [previewUrl, setGroupData]);

  const handleNameChange = (val: string): void => {
    setGroupName(val);
    setGroupData({ name: val });
  };

  const handleDescChange = (val: string): void => {
    setGroupDescription(val);
    setGroupData({ description: val });
  };

  const handleTypeChange = (type: typeof groupType): void => {
    setGroupType(type);
    setGroupData({ chatType: type });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch('/api/upload-avatar', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Ошибка загрузки аватара');
    }
    const data = await response.json();
    return data.uid;
  };

  const handleConfirmCrop = async (file: File, zoom: number): Promise<void> => {
    setCroppedZoom(zoom);
    closeCropper();

    setIsUploadingAvatar(true);
    try {
      const uid = await uploadAvatar(file);
      setGroupData({ avatarUid: uid });
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const next = (): void => {
    if (!groupName.trim()) {
      alert('Введите название группы');
      return;
    }
    router.push('/new-group/invite-members');
  };

  const avatarSrc = previewUrl || '/images/settings/noAvatarIcon.svg';
  const avatarStyle: React.CSSProperties = {};
  if (croppedZoom !== null && previewUrl) {
    avatarStyle.transform = `scale(${croppedZoom / 100})`;
    avatarStyle.transition = 'transform 0.3s ease';
  }

  return (
    <>
      <div className={styles.container}>
        <button type="button" className={styles.returnButton} onClick={() => router.back()}>
          <div className={styles.iconAndLabelContainer}>
            <Image
              src="/images/settings/returnArrowIcon.svg"
              alt=""
              width={21}
              height={21}
              className={styles.returnIcon}
            />
            <span className={styles.labelText}>Создать группу</span>
          </div>
        </button>

        <div className={styles.imageContainer}>
          <div className={styles.avatar}>
            <Image src={avatarSrc} alt="Аватар группы" width={200} height={200} className="" style={avatarStyle} />
          </div>
          <button type="button" className={styles.selectImage} onClick={triggerFileSelect} disabled={isUploadingAvatar}>
            {isUploadingAvatar ? 'Загрузка...' : 'Выбрать фотографию'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {imageUploadError && <div className={styles.error}>{imageUploadError}</div>}
        </div>

        <div className={styles.profileForm}>
          <DualInput
            maxFirst={100}
            maxSecond={250}
            placeholderFirst="Название*"
            placeholderSecond="Описание"
            valueFirst={groupName}
            valueSecond={groupDescription}
            onChangeFirst={handleNameChange}
            onChangeSecond={handleDescChange}
          />

          <GroupTypeSelect initial={groupType} onChange={handleTypeChange} />

          <ButtonUI
            variant="general"
            appearance="primary"
            label="Далее"
            type="button"
            disabled={!groupName.trim()}
            onClick={next}
          />
        </div>
      </div>

      {isCropperOpen && (
        <div className={styles.overlay}>
          <ImageCropperModal
            isOpen={isCropperOpen}
            onClose={closeCropper}
            onConfirm={handleConfirmCrop}
            initialPreviewUrl={previewUrl}
            initialOriginalFile={selectedFile}
          />
        </div>
      )}
    </>
  );
};
