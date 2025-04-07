import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { OS } from 'src/app/models/os.models';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OsService {
  private http: HttpClient = inject(HttpClient);
  private API_URL: string = environment.apiUrl;
  private user: any;

  getOSByUSer(idColaborador: string):Observable<OS[]> {
    return this.http.get<OS[]>(`${this.API_URL}/api/ordens-servico/${idColaborador}/`).pipe(take(1));
  }

  postFinishOS(data: any) {
    return this.http.post(`${this.API_URL}/api/inserir-finalizacao-os/`, data).pipe(take(1));
  }
}
