import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Upload, upload } from './upload';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) { }

  upload(file: File, bucket: string, filename: string): Observable<Upload> {
    return this.http
      .post(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${filename}`, file, {
        headers: {
          // "Content-Type": "application/octet-stream"
        },
        reportProgress: true,
        observe: 'events',
      })
      .pipe(upload());
  }
}
