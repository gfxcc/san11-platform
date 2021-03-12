
import { Package } from '../../proto/san11-platform.pb'



export function getPackageUrl(san11Package: Package): string {
    return 'categories/' + san11Package.categoryId + '/packages/' + san11Package.packageId;
}

