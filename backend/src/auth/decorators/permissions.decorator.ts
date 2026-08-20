import { SetMetadata } from '@nestjs/common';

// Custom decorator mapped exactly to legacy permission types: read, add, edit, delete, printx, confirm, upload
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (moduleName: string, action: string) => 
  SetMetadata(PERMISSIONS_KEY, { module: moduleName, action });
