import { AuthService } from './auth.service';
import { AppsyncService } from './appsync.service';

const appsyncServiceFactory = (authService: AuthService) => {
  return new AppsyncService(authService.jwtToken);
};

export let appsyncServiceProvider = {
  provide: AppsyncService,
  useFactory: appsyncServiceFactory,
  deps: [AuthService]
};
