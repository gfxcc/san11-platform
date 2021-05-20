
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.fileServerUrl + '/' + url;
}


export function getAcceptFileType(categoryId: string, tag: string): string {
    if (categoryId === '1') {
        if (tag === 'SIRE 1') {
            return '.scp, .scp-en';
        } else if (tag === 'SIRE 2') {
            return '.sirecm';
        }
    } else {
        return '.rar, .zip, .7z';
    }
    return '';
}