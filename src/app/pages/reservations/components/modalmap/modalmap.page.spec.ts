import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalmapPage } from './modalmap.page';

describe('ModalmapPage', () => {
  let component: ModalmapPage;
  let fixture: ComponentFixture<ModalmapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
