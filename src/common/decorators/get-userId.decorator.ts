import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data, ctx: ExecutionContext): number => {
    return ctx.switchToHttp().getRequest().user.id;
  },
);
