import { AppsyncService } from './appsync.service';

const appsyncServiceFactory = () => {
  return new AppsyncService();
};

export let appsyncServiceProvider = {
  provide: AppsyncService,
  useFactory: appsyncServiceFactory
};
