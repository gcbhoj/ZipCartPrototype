import { TestBed } from '@angular/core/testing';

import { RetailerServices } from './retailer-services';

describe('RetailerServices', () => {
  let service: RetailerServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
