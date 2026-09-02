import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  user: { id: number; email: string };
}

/**
 * Servicio de autenticación (Módulo opcional).
 * Usa json-server-auth: POST /register y POST /login devuelven { accessToken, user }.
 *
 * NOTA DE SEGURIDAD: guardamos el token en @capacitor/preferences por simplicidad.
 * Para producción, usar almacenamiento seguro (@capacitor-community/secure-storage).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'auth_token';

  private _token = signal<string | null>(null);
  isAuthenticated = computed(() => !!this._token());

  /** Se llama al arrancar la app (provideAppInitializer) para restaurar la sesión. */
  async init() {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    this._token.set(value);
  }

  token() {
    return this._token();
  }

  async register(email: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/register`, { email, password }),
    );
    await this.persist(res.accessToken);
  }

  async login(email: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.base}/login`, { email, password }),
    );
    await this.persist(res.accessToken);
  }

  async logout() {
    this._token.set(null);
    await Preferences.remove({ key: this.TOKEN_KEY });
  }

  private async persist(token: string) {
    this._token.set(token);
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }
}
