import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeStPage } from './home-st.page';

describe('HomeStPage', () => {
  let component: HomeStPage;
  let fixture: ComponentFixture<HomeStPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeStPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
