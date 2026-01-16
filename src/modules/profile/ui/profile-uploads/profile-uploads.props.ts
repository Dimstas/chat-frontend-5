export type ProfileUploadsProps = {
  uid: string;
};

type TabContentType = 'media' | 'files' | 'voices' | 'links';

export type Tab = {
  id: TabContentType;
  title: string;
  content: FilesContent | LinksContent;
};

export type FilesContent = {
  id: number;
  file: string;
  url: string;
  size: string;
  type: string;
  created: string;
  isLoading?: boolean;
  progress?: number;
};

export type LinksContent = {
  url: string;
  title: string;
  fromUser: string;
  created: string;
};
