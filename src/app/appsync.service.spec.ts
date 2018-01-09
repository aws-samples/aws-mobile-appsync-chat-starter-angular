import { TestBed, inject } from '@angular/core/testing';

import { AppsyncService } from './appsync.service';

describe('AppsyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppsyncService]
    });
  });

  it('should be created', inject([AppsyncService], (service: AppsyncService) => {
    expect(service).toBeTruthy();
  }));
});
