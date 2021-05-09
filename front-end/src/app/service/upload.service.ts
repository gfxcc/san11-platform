import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Upload, upload } from './upload';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) { }

  upload(file: File, bucket: string, filename: string): Observable<Upload> {
    const data = new FormData();
    data.append('file', file);
    return this.http
      .post(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${filename}`, data, {
        headers: {
        },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(upload());
  }
}