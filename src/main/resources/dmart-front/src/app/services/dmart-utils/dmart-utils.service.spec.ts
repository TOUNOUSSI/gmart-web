import { TestBed } from '@angular/core/testing';

import { DmartUtilsService } from './dmart-utils.service';

describe('DmartUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DmartUtilsService = TestBed.get(DmartUtilsService);
    expect(service).toBeTruthy();
  });
});
