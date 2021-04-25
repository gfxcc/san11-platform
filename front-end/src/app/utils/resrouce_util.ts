
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.fileServerUrl + '/' + url;
}


export function getAcceptFileType(categoryId: string, tag: string): string {
    if (categoryId === '1') {
        if (tag === 'sire2.0') {
            return '.scp, .scp-en';
        } else if (tag === 'sire1.30') {
            return '.sirecm';
        }
    } else {
        return '.rar, .zip, .7z';
    }
    return '';
}