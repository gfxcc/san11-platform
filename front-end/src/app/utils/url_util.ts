import { ActivatedRouteSnapshot } from "@angular/router";

export function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.url.map((v) => v.toString()).join('/');
}