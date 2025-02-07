import { IsString, IsOptional, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 20)
  nickname?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  stateMessage?: string;
}
