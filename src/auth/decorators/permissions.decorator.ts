import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = 'permissions';
//@Permissions('create_user','delete_user')
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);