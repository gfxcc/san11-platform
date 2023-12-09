import { NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { v4 as uuid } from 'uuid';
import { CreateImageRequest, ImageType } from "../../proto/san11-platform.pb";
import { GlobalConstants } from "../common/global-constants";
import { ProgressService } from "../progress.service";
import { getFullUrl } from "../utils/resrouce_util";
import { San11PlatformServiceService } from "./san11-platform-service.service";
import { UploadService } from "./upload.service";

export class MyUploadAdapter {
    uploadSubscription: Subscription;
    constructor(
        private loader,
        private san11pkService: San11PlatformServiceService,
        private uploadService: UploadService,
        private parent: string,
        private progressService: ProgressService,
        private ngZone: NgZone,  // Inject NgZone
    ) {
    }

    upload() {
        const filename = `${this.parent}/images/${uuid()}.jpeg`
        return this.loader.file
            .then((file: File) => new Promise((resolve, reject) => {
                this.uploadSubscription = this.uploadService.upload(file, GlobalConstants.tmpBucket, filename)
                    .subscribe(
                        upload => {
                            // Run the progress update inside Angular's zone
                            // as otherwise the UI won't be updated.
                            this.ngZone.run(() => {
                                this.loader.uploadTotal = upload.total;
                                this.loader.uploaded = upload.loaded;
                                this.progressService.update(upload.progress);

                                if (upload.state === 'DONE') {
                                    this.san11pkService.createImage(new CreateImageRequest({
                                        parent: this.parent,
                                        url: filename,
                                        imageType: ImageType.DESCRIPTION,
                                    })).subscribe({
                                        next: url => {
                                            resolve({
                                                default: getFullUrl(url.url)
                                            });
                                        },
                                        error: error => {
                                            console.warn(`Failed to uploadImage ${filename}: ${error.statusMessage}`)
                                        }
                                    });
                                }
                            });
                        }
                    );
            }));
    }

    abort() {
        this.uploadSubscription.unsubscribe();
    }
}
