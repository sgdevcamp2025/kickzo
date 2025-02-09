import { IsEmail, IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsNickname } from "../decorators/nickname.decorator";

interface ICheckExists {
  nickname?: string;
  email?: string;
}

export class CheckExistsDto {
  @ValidateIf((o: ICheckExists) => !o.email)
  @IsString()
  @IsNickname()
  @Transform(({ value }: { value: string }) => value?.trim())
  nickname?: string;

  @ValidateIf((o: ICheckExists) => !o.nickname)
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim())
  email?: string;
}
