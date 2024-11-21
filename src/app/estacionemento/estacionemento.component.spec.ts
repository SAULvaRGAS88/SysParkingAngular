import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionamentoComponent } from './estacionemento.component';

describe('EstacionementoComponent', () => {
  let component: EstacionamentoComponent;
  let fixture: ComponentFixture<EstacionamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstacionamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstacionamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
