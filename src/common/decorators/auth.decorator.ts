/* eslint-disable prettier/prettier */
import { applyDecorators, SetMetadata, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guards";
import { Role } from "src/modules/users/enum/role.enum";

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(JwtAuthGuard, RolesGuard),
    );
}



