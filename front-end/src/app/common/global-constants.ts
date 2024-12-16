import { environment } from "src/environments/environment";

export class GlobalConstants {
    public static domain: string = 'san11pk';
    // public static san11ServerUrl: string = environment.serverAddress + ':8090';
    public static san11ServerUrl: string = `${environment.schema}://${environment.domain}:8090`;
    public static imgServerUrl: string = 'https://storage.googleapis.com/san11-resources';

    public static maxBinarySize: number = 10 * 1024 * 1024; // 10MB
    public static maxImageSize: number = 10 * 1024 * 1024; // 10MB

    public static tmpBucket = 'san11-tmp';
    public static resourceBucket = 'san11-resources';

    public static defaultUserImage: string = 'static/images/avatars/zhuge.jpg';

    public static categories = [
        { value: '1', text: 'SIRE 插件', link: ['/categories', 1], icon: 'extension' },
        { value: '2', text: '修改工具', link: ['/categories', 2], icon: 'handyman' },
        { value: '3', text: 'MOD', link: ['/categories', 3], icon: 'auto_fix_high' },
        { value: '4', text: 'PK2 插件', link: ['/categories', 4], icon: 'superscript' },
    ];

    public static usernameFeedPageSize: number = 10;

}