import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonToggle, IonButton,
  IonNote, IonIcon, IonThumbnail,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, location } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime,
    IonToggle, IonButton, IonNote, IonIcon, IonThumbnail,
  ],
  templateUrl: './task-form.page.html',
})
export class TaskFormPage {
  private fb = inject(FormBuilder);

  photoUrl = signal<string | null>(null);
  ubicacion = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [new Date().toISOString(), Validators.required],
    priority: ['media', Validators.required],
    done: [false],
    lat: [null as number | null],
    lng: [null as number | null],
  });

  constructor() {
    addIcons({ camera, location });
  }

  get title() {
    return this.form.controls.title;
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 80,
    });
    const fileName = `task-${Date.now()}.jpeg`;
    await Filesystem.writeFile({ path: fileName, data: photo.base64String!, directory: Directory.Data });
    const saved = await Filesystem.getUri({ path: fileName, directory: Directory.Data });
    this.photoUrl.set(Capacitor.convertFileSrc(saved.uri));
  }

  async guardarUbicacion() {
    const permiso = await Geolocation.requestPermissions();
    if (permiso.location !== 'granted') return;
    const pos = await Geolocation.getCurrentPosition();
    this.form.patchValue({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    this.ubicacion.set(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
  }

  private async programarNotificacion() {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title: 'Tarea próxima a vencer',
        body: this.form.value.title ?? 'Tarea',
        schedule: { at: new Date(this.form.value.dueDate!) },
      }],
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.programarNotificacion();
    console.log('Nueva tarea:', this.form.value, 'foto:', this.photoUrl());
  }
}
