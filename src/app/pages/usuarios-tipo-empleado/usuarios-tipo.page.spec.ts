import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosTipoPage } from './usuarios-tipo.page';

describe('UsuariosTipoPage', () => {
  let component: UsuariosTipoPage;
  let fixture: ComponentFixture<UsuariosTipoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosTipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
