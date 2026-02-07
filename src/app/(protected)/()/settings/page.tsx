'use client';

import { AllSettingsBlock } from 'modules/settings';
import { JSX } from 'react';

export default function SettingsPage(): JSX.Element {
  return <AllSettingsBlock editProfile={() => {}} blackList={() => {}} support={() => {}} leave={() => {}} />;
}
