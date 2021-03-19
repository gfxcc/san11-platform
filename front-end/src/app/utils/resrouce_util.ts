
import { GlobalConstants } from "../common/global-constants";


export function getFullUrl(url: string): string {
    return GlobalConstants.fileServerUrl + '/' + url;
}

