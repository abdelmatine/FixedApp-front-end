import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FastBoxPage } from './fast-box.page';

describe('FastBoxPage', () => {
  let component: FastBoxPage;
  let fixture: ComponentFixture<FastBoxPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FastBoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
