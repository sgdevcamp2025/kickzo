import { IsEnum, IsNotEmpty } from "class-validator";
import { DeviceType } from "../enum/device-type.enum";
import { MESSAGES } from "../constants/constants";
import { ApiProperty } from "@nestjs/swagger";
export class DeviceTypeDto {
  @IsNotEmpty({ message: MESSAGES.REQUIRED_DEVICE })
  @IsEnum(DeviceType, {
    message: MESSAGES.INVALID_DEVICE,
  })
  @ApiProperty({
    description: "디바이스 타입",
    example: "mobile",
  })
  device: DeviceType;
}
