import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost/api';

  constructor(private http: HttpClient) { }

  testConnection(): Observable<string> {
    return this.http.get(`${this.apiUrl}/recuperartodos.php`, { responseType: 'text' });
  }

  alta(usuarioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alta.php`, usuarioData);
  }

  recuperar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recuperartodos.php`);
  }
}
