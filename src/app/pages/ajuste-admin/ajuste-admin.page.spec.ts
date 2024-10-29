import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjusteAdminPage } from './ajuste-admin.page';

describe('AjusteAdminPage', () => {
  let component: AjusteAdminPage;
  let fixture: ComponentFixture<AjusteAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusteAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
