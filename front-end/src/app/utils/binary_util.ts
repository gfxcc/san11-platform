
import { Package, Binary, Version } from '../../proto/san11-platform.pb'


export function version2str(version: Version): string {
    return 'v' + version.major.toString() + '-' + version.minor.toString() + '-' + version.patch.toString();
}


export function getBinaryFilename(san11Package: Package, binary: Binary): string {
    const filenameBase = san11Package.name + '-' + version2str(binary.version);

    let extension: string;
    if (san11Package.categoryId === '1') {
        extension = 'scp';
    } else {
        extension = 'zip'
    }
    return filenameBase.replace('/\ /-', 'best') + '.' + extension;
}

