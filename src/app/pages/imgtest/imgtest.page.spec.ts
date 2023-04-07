import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgtestPage } from './imgtest.page';

describe('ImgtestPage', () => {
  let component: ImgtestPage;
  let fixture: ComponentFixture<ImgtestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImgtestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
