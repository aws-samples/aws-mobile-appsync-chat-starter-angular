import { TestBed, inject } from '@angular/core/testing';

import { Auth.ServiceService } from './auth.service.service';

describe('Auth.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth.ServiceService]
    });
  });

  it('should be created', inject([Auth.ServiceService], (service: Auth.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
