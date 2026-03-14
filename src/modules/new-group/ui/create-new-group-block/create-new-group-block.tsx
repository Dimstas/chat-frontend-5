'use client';

import { useImageUpload } from 'modules/settings/lib/edit-profile-block/use-image-upload';
import { ImageCropperModal } from 'modules/settings/ui/image-cropper/image-cropper-modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';
import { ButtonUI } from 'shared/ui';
import DualInput from '../dual-input/dual-input';
import GroupTypeSelect from '../group-type-select/group-type-select';
import styles from './create-new-group-block.module.scss';

export const CreateNewGroupBlock: React.FC = (): JSX.Element => {
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

  const router = useRouter();
  const [croppedZoom, setCroppedZoom] = useState<number | null>(null);

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const handleConfirmCrop = (file: File, zoom: number): void => {
    setCroppedZoom(zoom);
    closeCropper();
  };

  const next = (): void => {
    router.push('/new-group/invite-members');
  };

  const avatarSrc = previewUrl || '/images/settings/noAvatarIcon.svg';
  const avatarStyle: React.CSSProperties = {};
  if (croppedZoom !== null && previewUrl) {
    avatarStyle.transform = `scale(${croppedZoom / 100})`;
    avatarStyle.transition = 'transform 0.3s ease';
  }

  const isNameValid = groupName.trim().length > 0;

  return (
    <>
      <div className={styles.container}>
        <button type="button" className={styles.returnButton} onClick={() => {}}>
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
            <Image src={avatarSrc} alt="Аватар группы" width={200} height={200} className={''} style={avatarStyle} />
          </div>
          <button type="button" className={styles.selectImage} onClick={triggerFileSelect}>
            Выбрать фотографию
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
            onChangeFirst={setGroupName}
            onChangeSecond={setGroupDescription}
          />

          <GroupTypeSelect initial="closed" onChange={(type) => console.log('Выбран тип:', type)} />

          <ButtonUI
            variant="general"
            appearance="primary"
            label="Далее"
            type="button"
            disabled={false}
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
