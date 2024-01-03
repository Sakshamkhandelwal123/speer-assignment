import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (executionContext: string, context: ExecutionContext) => {
    let req: { user: User };

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
    }

    return req.user as User;
  },
);
