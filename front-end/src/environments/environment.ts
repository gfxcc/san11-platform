// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'localhost',
  schema: 'http',
  serverPort: 8091,
  devAccounts: [
    {
      label: '管理员',
      identity: 'dev_admin',
      password: 'devpass',
      note: '审核、隐藏、恢复和管理后台',
    },
    {
      label: '作者',
      identity: 'dev_author',
      password: 'devpass',
      note: '资源编辑、截图、版本和作者工具',
    },
    {
      label: '普通用户',
      identity: 'dev_user',
      password: 'devpass',
      note: '收藏、评论和普通浏览',
    },
  ],
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
