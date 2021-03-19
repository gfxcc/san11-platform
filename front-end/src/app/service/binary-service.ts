import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { RouteGuideClient } from '../../proto/san11-platform.pbsc';
import { GrpcEvent, GrpcMetadata, GrpcStatusEvent } from '@ngx-grpc/common';

import { Binary } from "../../proto/san11-platform.pb";
import { ListBinariesRequest, ListBinariesResponse } from "../../proto/san11-platform.pb";


@Injectable({
    providedIn: 'root'
})

export class BinaryService {


    constructor(private severClient: RouteGuideClient) {

    }

    listBinaries(packageId: string) : Observable<ListBinariesResponse> {
        const request = new ListBinariesRequest({packageId: packageId});
        return this.severClient.listBinaries(request, this.getMetadata());
    }


    // UTILS

    getMetadata() {
        return new GrpcMetadata({ sid: localStorage.getItem('sid') });
    }
}