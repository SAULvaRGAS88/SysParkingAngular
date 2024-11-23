import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPrecoComponent } from './tabela-preco.component';

describe('TabelaPrecoComponent', () => {
  let component: TabelaPrecoComponent;
  let fixture: ComponentFixture<TabelaPrecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabelaPrecoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabelaPrecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
