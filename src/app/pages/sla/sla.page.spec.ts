import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlaPage } from './sla.page';

describe('SlaPage', () => {
  let component: SlaPage;
  let fixture: ComponentFixture<SlaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SlaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
