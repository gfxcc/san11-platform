export class GlobalConstants {
    public static serverIp: string = "http://0.0.0.0";
    public static san11ServerUrl: string = GlobalConstants.serverIp + ':8090';
    public static fileServerUrl: string = GlobalConstants.serverIp + ':8080';

    public static maxBinarySize: number = 30 * 1024 * 1024;
    public static maxImageSize: number = 3 * 1024 * 1024;


    public static defaultUserImage: string = '../../../assets/images/zhuge.jpg';

    public static categories = [
        { value: '1', text: 'SIRE2 插件', link: ['/categories', 1], icon: 'extension', disabled: false, isDefault: true },
        { value: '2', text: '修改工具', link: ['/categories', 2], icon: 'handyman', disabled: false },
        { value: '3', text: 'MOD', link: ['/categories', 3], icon: 'auto_fix_high', disabled: false }
    ];
}