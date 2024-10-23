import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosTipoClientePage } from './usuarios-tipo-cliente.page';

describe('UsuariosTipoClientePage', () => {
  let component: UsuariosTipoClientePage;
  let fixture: ComponentFixture<UsuariosTipoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosTipoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
