import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context)
      const request = context.switchToHttp().getRequest<Request>()
      const { user } = <any>request

      if (!user.role || !roles.some((role) => user?.role.includes(role)))
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          description: {
            code: 'UNAUTHORIZED_ACCESS',
            message: 'unauthorized access',
          },
        })

      return true
    }
  }

  return mixin(RoleGuardMixin)
}

export default RoleGuard
