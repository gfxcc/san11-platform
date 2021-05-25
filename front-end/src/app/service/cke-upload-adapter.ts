import { GlobalConstants } from "../common/global-constants";
import { San11PlatformServiceService } from "./san11-platform-service.service";
import { UploadService } from "./upload.service";
import { v4 as uuid } from 'uuid'
import { CreateImageRequest } from "../../proto/san11-platform.pb";
import { Observable, Subscription } from "rxjs";
import { getFullUrl } from "../utils/resrouce_util";

export class MyUploadAdapter {
    uploadSubscription: Subscription;
    constructor(
        private loader,
        private san11pkService: San11PlatformServiceService,
        private uploadService: UploadService,
        private parent: string,
    ) {
    }

    upload() {
        const filename = `${this.parent}/images/${uuid()}.jpeg`
        return this.loader.file
            .then((file: File) => new Promise((resolve, reject) => {
                this.uploadSubscription = this.uploadService.upload(file, GlobalConstants.tmpBucket, filename).subscribe(
                    upload => {
                        this.loader.uploadTotal = upload.total;
                        this.loader.uploaded = upload.loaded;

                        if (upload.state === 'DONE') {
                            this.san11pkService.createImage(new CreateImageRequest({
                                parent: this.parent,
                                url: filename,
                                inDescription: true
                            })).subscribe(
                                url => {
                                    resolve({
                                        default: getFullUrl(url.url)
                                    });
                                },
                                error => {
                                    console.log(`Failed to uploadImage ${filename}: ${error.statusMessage}`)
                                }
                            );
                        }
                    }
                );
            }));
    }

    abort() {
        this.uploadSubscription.unsubscribe();
    }
}
