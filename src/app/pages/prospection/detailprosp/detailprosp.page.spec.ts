import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailprospPage } from './detailprosp.page';

describe('DetailprospPage', () => {
  let component: DetailprospPage;
  let fixture: ComponentFixture<DetailprospPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailprospPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
