import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterfaceactivationPage } from './interfaceactivation.page';

describe('InterfaceactivationPage', () => {
  let component: InterfaceactivationPage;
  let fixture: ComponentFixture<InterfaceactivationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InterfaceactivationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
