export type FileReaderFile = {
  name: string;
  type: string;
  size: number;
  lastModified: string;
  uploadDate: Date;
  data: string;
};

export type UploadFile = {
  file: File;
  uploaded?: string;
  error?: string;
  preview?: string;
};
