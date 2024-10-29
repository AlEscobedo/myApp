import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditModalAjusteAdminComponent } from './edit-modal-ajuste-admin.component';

describe('EditModalAjusteAdminComponent', () => {
  let component: EditModalAjusteAdminComponent;
  let fixture: ComponentFixture<EditModalAjusteAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModalAjusteAdminComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditModalAjusteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
