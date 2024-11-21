import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionamentoSelecionadoComponent } from './estacionamento-selecionado.component';

describe('EstacionamentoSelecionadoComponent', () => {
  let component: EstacionamentoSelecionadoComponent;
  let fixture: ComponentFixture<EstacionamentoSelecionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstacionamentoSelecionadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstacionamentoSelecionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
