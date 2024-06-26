import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { saveAs } from 'file-saver';
import { TextDialogComponent } from "src/app/common/components/text-dialog/text-dialog.component";
import { NotificationService } from "src/app/common/notification.service";
import { DownloadService } from "src/app/service/download.service";
import { San11PlatformServiceService } from "src/app/service/san11-platform-service.service";
import { version2str } from "src/app/utils/binary_util";
import { signedIn } from "src/app/utils/user_util";
import { Binary, DeleteBinaryRequest, DownloadBinaryRequest, FieldMask, Package, UpdateBinaryRequest } from "src/proto/san11-platform.pb";


export interface Branch {
    name: string;
    binaries: Binary[];
    disabled: boolean;
}
@Component({
    selector: 'branch',
    templateUrl: './branch.html',
    styleUrls: ['./branch.css']
})
export class BranchComponent {
    @Input() package: Package;
    @Input() branch: Branch;
    @Input() editorPermission: boolean;
    @Output() updateDownloadProgress = new EventEmitter();
    @Output() reload = new EventEmitter();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['version', 'createTime', 'size', 'downloadCount', 'actions'];
    dataSource: MatTableDataSource<Binary>;

    startTime: any;
    endTime: any;
    currTime: any;
    prevTime: any;
    SPEED_UPDATE_DELTA_RATE = 0.2;
    bytesReceied: number = 0;
    oldbytes: number = 0;
    unit: string = "Mbps";
    speed: number = 0;

    constructor(
        private dialog: MatDialog,
        private san11pkService: San11PlatformServiceService,
        private notificationService: NotificationService,
        private downloads: DownloadService,
    ) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.branch.binaries);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getVersionStr(binary: Binary): string {
        return version2str(binary.version);
    }


    onDescription(binary: Binary) {
        this.dialog.open(TextDialogComponent, {
            data: {
                title: "更新日志",
                content: binary.description,
                editable: this.editorPermission,
            }
        }).afterClosed().subscribe(
            data => {
                if (this.editorPermission && data && data.data != binary.description) {
                    const request = new UpdateBinaryRequest({
                        binary: new Binary({
                            name: binary.name,
                            description: data.data,
                        }),
                        updateMask: new FieldMask({
                            paths: ['description']
                        })
                    });

                    this.san11pkService.updateBinary(request).subscribe(
                        binary => {
                            this.notificationService.success('更新成功');
                        },
                        error => {
                            this.notificationService.warn(`更新失败: ${error.statusMessage}`)
                        }
                    );
                }
            }
        );
    }

    onDownloadRequireSignIn(binary: Binary) {
        if (!signedIn()) {
            this.notificationService.warn('请登录');
            return;
        }

        this.onDownload(binary);
    }

    onDownload(binary: Binary) {
        this.san11pkService.downloadBinary(new DownloadBinaryRequest({
            name: binary.name
        })).subscribe({
            next: (binary: Binary) => {
                if (binary.file) {
                    saveAs(binary.file.url, binary.file.filename);
                } else if (binary.downloadMethod) {
                    this.dialog.open(TextDialogComponent, {
                        data: {
                            title: '下载方式',
                            content: binary.downloadMethod
                        }
                    });
                } else if (binary.cloudDiskFile) {
                    if (binary.cloudDiskFile.code) {
                        confirm(`请复制密钥 ${binary.cloudDiskFile.code}`);
                    }
                    window.open(binary.cloudDiskFile.url, '_blank');
                }
            },
            error: err => {
                this.notificationService.warn('下载失败' + err.statusMessage);
            }
        });
    }

    onDelete(binary: Binary) {
        if (!confirm('确定要删除 ' + version2str(binary.version) + ' 吗?')) {
            return;
        }
        this.san11pkService.deleteBinary(new DeleteBinaryRequest({
            name: binary.name
        })).subscribe(
            empty => {
                this.notificationService.success('删除成功');
                this.reload.emit();
            },
            error => {
                this.notificationService.warn('删除失败:' + error.statusMessage);
            }
        );
    }

    onOffload(binary: Binary) {
        if (!confirm('确定要卸载 ' + version2str(binary.version) + ' 的文件资源吗? (只清除资源，版本将会保留)')) {
            return;
        }
        this.san11pkService.updateBinary(new UpdateBinaryRequest({
            binary: new Binary({
                name: binary.name,
            }),
            updateMask: new FieldMask({
                paths: ['file']
            })
        })).subscribe(
            resp => {
                this.notificationService.success('卸载成功');
                this.reload.emit();
            },
            error => {
                this.notificationService.warn('卸载失败:' + error.statusMessage);
            }
        );
    }
}
