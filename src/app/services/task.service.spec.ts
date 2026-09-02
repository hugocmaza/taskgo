import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería obtener la lista de tareas (GET)', () => {
    const mock = [{ id: 1, title: 'Test', priority: 'alta' as const, dueDate: '2026-01-01', done: false }];
    service.getTasks().subscribe((tasks) => expect(tasks.length).toBe(1));
    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('debería enviar el body al crear (POST)', () => {
    const nueva = { title: 'X', priority: 'baja' as const, dueDate: '2026-09-01', done: false };
    service.createTask(nueva).subscribe();
    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('X');
    req.flush({ id: 99, ...nueva });
  });

  it('debería eliminar por id (DELETE)', () => {
    service.deleteTask(5).subscribe();
    const req = httpMock.expectOne('http://localhost:3000/tasks/5');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
