import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FixeJdidPage } from './fixe-jdid.page';

describe('FixeJdidPage', () => {
  let component: FixeJdidPage;
  let fixture: ComponentFixture<FixeJdidPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FixeJdidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
