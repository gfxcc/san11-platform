
import { Package } from '../../proto/san11-platform.pb';
import { parseName } from './resrouce_util';

const DEFAULT_SCREENSHOTS_BY_CATEGORY: Record<number, string> = {
    1: 'static/images/sire2.jpg',
    4: 'static/images/pk2_2.jpeg',
};


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

export function getDefaultPackageScreenshot(san11Package: Package): string | undefined {
    return DEFAULT_SCREENSHOTS_BY_CATEGORY[getCategoryId(san11Package.name)];
}
