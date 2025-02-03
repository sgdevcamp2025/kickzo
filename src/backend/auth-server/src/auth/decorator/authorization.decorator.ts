import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Authorization = createParamDecorator(
  (date: any, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers["authorization"] as string;
    if (typeof authorization !== "string") {
      return null;
    }
    return authorization;
  },
);
