import { TestBed } from '@angular/core/testing';

import { WebRequestInterceptorService } from './web-request-interceptor.service';

describe('WebRequestInterceptorService', () => {
  let service: WebRequestInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRequestInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
