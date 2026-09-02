import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';
import { TaskFormPage } from './task-form.page';

describe('TaskFormPage', () => {
  let component: TaskFormPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskFormPage],
      providers: [provideIonicAngular()],
    });
    const fixture = TestBed.createComponent(TaskFormPage);
    component = fixture.componentInstance;
  });

  it('el formulario debería ser inválido sin título', () => {
    component.form.patchValue({ title: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('el formulario debería ser válido con datos correctos', () => {
    component.form.patchValue({
      title: 'Entregar informe',
      dueDate: new Date().toISOString(),
      priority: 'alta',
    });
    expect(component.form.valid).toBeTrue();
  });
});
