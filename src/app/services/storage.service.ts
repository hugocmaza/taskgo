import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEY = 'tasks_cache';

  async saveTasks(tasks: Task[]) {
    await Preferences.set({ key: this.KEY, value: JSON.stringify(tasks) });
  }

  async loadTasks(): Promise<Task[]> {
    const { value } = await Preferences.get({ key: this.KEY });
    return value ? (JSON.parse(value) as Task[]) : [];
  }

  async isOnline(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }
}
