
import { Package } from '../../proto/san11-platform.pb';
import { parseName } from './resrouce_util';



export function getPackageUrl(san11Package: Package): string {
    return san11Package.name;
}

export function getPackageId(name: string): number {
    const [parent, c, packageId] = parseName(name)
    return Number(packageId)
}

export function getCategoryId(name: string): number {
    const [parent, c, packageId] = parseName(name)
    const [p, cc, categoryId] = parseName(parent)
    return Number(categoryId)
}