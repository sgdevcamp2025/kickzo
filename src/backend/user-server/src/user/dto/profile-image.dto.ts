import { IsOptional, IsString } from "class-validator";

export class ProfileImageDto {
  @IsString()
  @IsOptional()
  profileImageUrl: string;
}
