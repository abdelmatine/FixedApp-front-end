import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacFastBoxPage } from './rac-fast-box.page';

describe('RacFastBoxPage', () => {
  let component: RacFastBoxPage;
  let fixture: ComponentFixture<RacFastBoxPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RacFastBoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
