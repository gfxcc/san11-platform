import {
    HttpEvent,
    HttpEventType,
    HttpProgressEvent,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, scan } from 'rxjs/operators';

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
    event: HttpEvent<unknown>
): event is HttpProgressEvent {
    return (
        event.type === HttpEventType.DownloadProgress ||
        event.type === HttpEventType.UploadProgress
    );
}

export interface Upload {
    progress: number;
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    loaded: number;
    total: number;
}

export function upload(): (
    source: Observable<HttpEvent<unknown>>
) => Observable<Upload> {
    const initialState: Upload = { state: 'PENDING', progress: 0, loaded: 1, total: 1 };
    const reduceState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
        if (isHttpProgressEvent(event)) {
            return {
                progress: event.total
                    ? Math.round((100 * event.loaded) / event.total)
                    : upload.progress,
                state: 'IN_PROGRESS',
                loaded: event.loaded,
                total: event.total
            };
        }
        // TODO: this is a workaround while GCS return 401 due to non-authenticated request
        if (isHttpResponse(event) || event.type === 3) {
            return {
                progress: 100,
                state: 'DONE',
                loaded: 1,
                total: 1
            };
        }
        return upload;
    };
    return (source) =>
        source.pipe(
            scan(reduceState, initialState),
            distinctUntilChanged(
                (a, b) => a.state === b.state && a.progress === b.progress
            )
        );
}