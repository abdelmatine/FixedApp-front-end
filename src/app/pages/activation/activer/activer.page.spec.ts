import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiverPage } from './activer.page';

describe('ActiverPage', () => {
  let component: ActiverPage;
  let fixture: ComponentFixture<ActiverPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActiverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
