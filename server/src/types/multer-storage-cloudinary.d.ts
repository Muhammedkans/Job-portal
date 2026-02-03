declare module 'multer-storage-cloudinary' {
  import { v2 as cloudinary } from 'cloudinary';
  import { StorageEngine } from 'multer';

  interface Options {
    cloudinary: typeof cloudinary;
    params?: (req: Request, file: Express.Multer.File) => Promise<{
      folder?: string;
      resource_type?: string;
      allowed_formats?: string[];
      public_id?: string;
      format?: string;
    }> | {
      folder?: string;
      resource_type?: string;
      allowed_formats?: string[];
      public_id?: string;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: Options);
    _handleFile(req: any, file: any, cb: any): void;
    _removeFile(req: any, file: any, cb: any): void;
  }
}
