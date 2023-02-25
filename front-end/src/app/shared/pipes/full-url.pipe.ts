import { Pipe, PipeTransform } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
/*
 * Converts a resource uri to its full url
 * E.g. `users/my.img` to `https://xxxxxxx/users/my.img`
*/
@Pipe({
  name: 'fullUrl',
  pure: true,
})
export class FullUrlPipe implements PipeTransform {
  transform(uri: string, img_size?: string): string {
    if (img_size) {
      return GlobalConstants.imgServerUrl + '/' + uri?.replace('.jpeg', `_${img_size}.jpeg`);
    }
    return GlobalConstants.imgServerUrl + '/' + uri;
  }
}