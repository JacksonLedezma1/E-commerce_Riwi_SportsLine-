import { SetMetadata } from "@nestjs/common";

//esta es la que usan los Guards para leer los roles
export const ROLES_KEY = 'roles'
//@Roles('admin','user')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);