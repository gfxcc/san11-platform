import { ActivatedRouteSnapshot, Router } from "@angular/router";

export function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.url.map((v) => v.toString()).join('/');
}


export function openInNewTab(router: Router, uri: string) {
    console.debug("openInNewTab: uri=" + uri)
    let baseUrl = window.location.href.replace(router.url, '');
    let url = baseUrl.toString() + "/" + uri;

    console.debug("openInNewTab: " + url)
    window.open(url, '_blank');
}

export function isValidUrl(input: string): boolean {
    try {
        new URL(input);
        return true;
    } catch (e) {
        return false;
    }
}