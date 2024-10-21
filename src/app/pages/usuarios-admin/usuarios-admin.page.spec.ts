import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosAdminPage } from './usuarios-admin.page';

describe('UsuariosAdminPage', () => {
  let component: UsuariosAdminPage;
  let fixture: ComponentFixture<UsuariosAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
