import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceselectPage } from './placeselect.page';

describe('PlaceselectPage', () => {
  let component: PlaceselectPage;
  let fixture: ComponentFixture<PlaceselectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlaceselectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
