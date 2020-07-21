import { TestBed } from '@angular/core/testing';

import { SocialAuthInterceptor } from './social-auth.interceptor';

describe('SocialAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SocialAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SocialAuthInterceptor = TestBed.inject(SocialAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
