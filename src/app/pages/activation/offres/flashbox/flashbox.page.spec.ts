import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashboxPage } from './flashbox.page';

describe('FlashboxPage', () => {
  let component: FlashboxPage;
  let fixture: ComponentFixture<FlashboxPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FlashboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
