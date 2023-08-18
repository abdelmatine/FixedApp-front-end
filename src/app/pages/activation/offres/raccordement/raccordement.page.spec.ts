import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaccordementPage } from './raccordement.page';

describe('RaccordementPage', () => {
  let component: RaccordementPage;
  let fixture: ComponentFixture<RaccordementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RaccordementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
