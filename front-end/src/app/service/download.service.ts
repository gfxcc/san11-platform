import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpRequest } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { saveAs } from 'file-saver'

@Injectable({providedIn: 'root'})
export class DownloadService {

  constructor(
    private http: HttpClient,
  ) {
  }

  download(url: string, filename?: string) {
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }

}