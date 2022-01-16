
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.fileServerUrl + '/' + url;
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