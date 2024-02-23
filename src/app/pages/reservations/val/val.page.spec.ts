import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValPage } from './val.page';

describe('ValPage', () => {
  let component: ValPage;
  let fixture: ComponentFixture<ValPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ValPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
