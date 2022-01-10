import { ActivatedRouteSnapshot, Router } from "@angular/router";

export function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.url.map((v) => v.toString()).join('/');
}


export function openInNewTab(router: Router, namedRoute) {
    let newRelativeUrl = router.createUrlTree([namedRoute]);
    let baseUrl = window.location.href.replace(router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
}