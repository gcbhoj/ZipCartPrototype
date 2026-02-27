import { TestBed } from '@angular/core/testing';

import { Testservices } from './testservices';

describe('Testservices', () => {
  let service: Testservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Testservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
