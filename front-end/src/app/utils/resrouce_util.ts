
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.fileServerUrl + '/' + url;
}


export function getAcceptFileType(categoryId: string): string {
    if (categoryId === '1') {
        return '.scp, .scp-en';
    } else {
        return '.rar, .zip, .7z';
    }
    return '';
}