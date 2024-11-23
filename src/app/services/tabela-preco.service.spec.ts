import { TestBed } from '@angular/core/testing';

import { TabelaPrecoService } from './tabela-preco.service';

describe('TabelaPrecoService', () => {
  let service: TabelaPrecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabelaPrecoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
