import { TestBed } from '@angular/core/testing';

import { Datasharing } from './datasharing';

describe('Datasharing', () => {
  let service: Datasharing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Datasharing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
