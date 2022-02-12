
import { Binary, Package, Version } from '../../proto/san11-platform.pb';
import { getCategoryId } from './package_util';


export function version2str(version: Version): string {
    return 'v' + version.major.toString() + '-' + version.minor.toString() + '-' + version.patch.toString();
}


export function getBinaryFilename(san11Package: Package, binary: Binary): string {
    const filenameBase = san11Package.name + '-' + version2str(binary.version);
    return filenameBase.replace('/\ /-', 'best') + getExt(san11Package, binary);
}

export function getBinaryDisplayName(san11Package: Package, binary: Binary): string {
    const filenameBase = san11Package.packageName + '-' + version2str(binary.version);

    return filenameBase.replace('/\ /-', 'best') + getExt(san11Package, binary);
}

function getExt(san11Package: Package, binary: Binary) {
    let extension: string;
    if (binary.file && binary.file.ext) {
        extension = binary.file.ext;
    } else if (getCategoryId(san11Package.name) === 1) {
        if (binary.tag === 'sire2') {
            extension = '.scp';
        } else if (binary.tag === 'sire1') {
            extension = '.sirecm';
        } else {
            console.log('unknow tag for sire plugin');
            extension = '.scp';
        }
    } else {
        extension = '.zip'
    }
    return extension;
}