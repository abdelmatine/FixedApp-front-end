import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailReservationPage } from './detail-reservation.page';

describe('DetailReservationPage', () => {
  let component: DetailReservationPage;
  let fixture: ComponentFixture<DetailReservationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
