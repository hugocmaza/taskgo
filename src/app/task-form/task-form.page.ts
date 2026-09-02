import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonToggle, IonButton, IonNote,
} from '@ionic/angular';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime,
    IonToggle, IonButton, IonNote,
  ],
  templateUrl: './task-form.page.html',
})
export class TaskFormPage {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [new Date().toISOString(), Validators.required],
    priority: ['media', Validators.required],
    done: [false],
  });

  get title() {
    return this.form.controls.title;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Nueva tarea:', this.form.value);
  }
}
