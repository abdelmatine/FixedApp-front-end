import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraitementPage } from './traitement.page';

describe('TraitementPage', () => {
  let component: TraitementPage;
  let fixture: ComponentFixture<TraitementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TraitementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
