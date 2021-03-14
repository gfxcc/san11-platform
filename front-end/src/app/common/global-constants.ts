export class GlobalConstants {
    public static serverIp: string = "http://0.0.0.0";
    public static san11ServerUrl: string = GlobalConstants.serverIp+':8090';
    public static fileServerUrl: string = GlobalConstants.serverIp+':8080';

    public static maxBinarySize: number = 30 * 1024 * 1024;
    public static maxImageSize: number = 3 * 1024 * 1024;
}