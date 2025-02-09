import { IsEnum, IsNotEmpty } from "class-validator";
import { DeviceType } from "../enum/device-type.enum";
import { MESSAGES } from "../constants/constants";
export class DeviceTypeDto {
  @IsNotEmpty({ message: MESSAGES.REQUIRED_DEVICE })
  @IsEnum(DeviceType, {
    message: MESSAGES.INVALID_DEVICE,
  })
  device: DeviceType;
}
