import { TestBed } from '@angular/core/testing';

import { EstacionamentoSelecionadoService } from './estacionamento-selecionado.service';

describe('EstacionamentoSelecionadoService', () => {
  let service: EstacionamentoSelecionadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionamentoSelecionadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
