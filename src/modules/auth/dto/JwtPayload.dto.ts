/* eslint-disable prettier/prettier */
import { IsEnum, IsMongoId, IsString } from "class-validator";
import { Role } from "src/modules/users/enum/role.enum";

export class JwtPayloadDto {
    @IsMongoId()
    sub: string;
    @IsString()
    username: string;
    @IsEnum({Role})
    role: Role
}