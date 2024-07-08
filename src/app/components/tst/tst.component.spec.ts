import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TstComponent } from './tst.component';

describe('TstComponent', () => {
  let component: TstComponent;
  let fixture: ComponentFixture<TstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
