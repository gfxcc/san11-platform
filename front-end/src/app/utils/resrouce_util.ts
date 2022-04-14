
import { File } from "src/proto/san11-platform.pb";
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.imgServerUrl + '/' + url;
}

export function getFileUrl(file: File): string {
    let serverUrl: string;
    switch (file.server) {
        case File.Server.GCS:
            serverUrl = 'https://storage.googleapis.com/san11-resources';
            break;
        case File.Server.AWS_S3:
            serverUrl = 'https://san11-resources.s3.ap-east-1.amazonaws.com';
            break;
        default:
            console.log(`ERROR: unsupported File.Server: ${file.server}`);
            break;
    }
    return `${serverUrl}/${file.uri}`;
}


export function getAcceptFileType(categoryId: string, tag: string): string {
    if (categoryId === '1') {
        if (tag === 'SIRE 2') {
            return '.scp, .scp-en';
        } else if (tag === 'SIRE 1') {
            return '.sirecm';
        }
    } else {
        return '.rar, .zip, .7z';
    }
    return '';
}

export function parseName(name: string): [string, string, number] {
    const { groups: { parent, collection, resource_id } } = /((?<parent>.+)\/)?(?<collection>[a-zA-Z0-9]+)\/(?<resource_id>[0-9]+)/.exec(name)
    return [parent, collection, Number(resource_id)]
}