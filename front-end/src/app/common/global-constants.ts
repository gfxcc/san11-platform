export class GlobalConstants {
    public static serverIp: string = "http://0.0.0.0";
    public static domain: string = 'san11pk';
    public static san11ServerUrl: string = GlobalConstants.serverIp + ':8090';
    public static fileServerUrl: string = GlobalConstants.serverIp + ':8080';

    public static maxBinarySize: number = 30 * 1024 * 1024;
    public static maxImageSize: number = 5 * 1024 * 1024;


    public static defaultUserImage: string = '../../../assets/images/zhuge.jpg';

    public static categories = [
        { value: '1', text: 'SIRE 插件', link: ['/categories', 1], icon: 'extension' },
        { value: '2', text: '修改工具', link: ['/categories', 2], icon: 'handyman' },
        { value: '3', text: 'MOD', link: ['/categories', 3], icon: 'auto_fix_high' },
    ];

    public static webModules = [
        { value: '4', text: '留言板', link: ['/message-board'], icon: 'sticky_note_2' },
    ]
}