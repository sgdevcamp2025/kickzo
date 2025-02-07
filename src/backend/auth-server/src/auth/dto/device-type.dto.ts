import { IsEnum, IsNotEmpty } from "class-validator";
import { DeviceType } from "../enum/device-type.enum";

export class DeviceTypeDto {
  @IsNotEmpty({ message: "device는 비워둘 수 없습니다." })
  @IsEnum(DeviceType, {
    message: "device는 web 또는 mobile 중 하나여야 합니다.",
  })
  device: DeviceType;
}
