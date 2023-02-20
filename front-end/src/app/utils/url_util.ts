import { ActivatedRouteSnapshot, Router } from "@angular/router";

export function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.url.map((v) => v.toString()).join('/');
}


export function openInNewTab(router: Router, uri: string) {
    let baseUrl = window.location.href.replace(router.url, '');
    window.open(baseUrl.toString() + "/" + uri, '_blank');
}
