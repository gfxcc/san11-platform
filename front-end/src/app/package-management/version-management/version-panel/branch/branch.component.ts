import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { saveAs } from 'file-saver';
import { TextDialogComponent } from "src/app/common/components/text-dialog/text-dialog.component";
import { NotificationService } from "src/app/common/notification.service";
import { InteractionService } from "src/app/common/interaction.service";
import { DownloadService } from "src/app/service/download.service";
import { San11PlatformServiceService } from "src/app/service/san11-platform-service.service";
import { version2str } from "src/app/utils/binary_util";
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
    @Input() descriptionEditable: boolean;
    @Output() updateDownloadProgress = new EventEmitter();
    @Output() downloadEvent = new EventEmitter<Binary>();
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
        private interactionService: InteractionService,
        private downloads: DownloadService,
    ) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.historicalBinaries);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getVersionStr(binary: Binary): string {
        return version2str(binary.version);
    }

    get recommendedBinary(): Binary | undefined {
        return this.branch?.binaries?.[0];
    }

    get historicalBinaries(): Binary[] {
        return this.branch?.binaries?.slice(1) || [];
    }

    get hasHistory(): boolean {
        return this.historicalBinaries.length > 0;
    }

    getDownloadLabel(binary: Binary): string {
        if (binary?.file) {
            return '下载推荐版本';
        }
        if (binary?.cloudDiskFile) {
            return '打开网盘下载';
        }
        if (binary?.downloadMethod) {
            return '查看下载方式';
        }
        return '查看版本';
    }

    getDownloadIcon(binary: Binary): string {
        if (binary?.cloudDiskFile) {
            return 'cloud_download';
        }
        if (binary?.downloadMethod) {
            return 'info';
        }
        return 'download';
    }


    onDescription(binary: Binary) {
        this.dialog.open(TextDialogComponent, {
            panelClass: 'app-responsive-dialog',
            data: {
                title: "更新日志",
                content: binary.description,
                editable: this.descriptionEditable,
            }
        }).afterClosed().subscribe(
            data => {
                if (this.descriptionEditable && data && data.data != binary.description) {
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

    onDownload(binary: Binary) {
        this.san11pkService.downloadBinary(new DownloadBinaryRequest({
            name: binary.name
        })).subscribe({
            next: (binary: Binary) => {
                this.downloadEvent.emit(binary);
                if (binary.file) {
                    saveAs(binary.file.url, binary.file.filename);
                } else if (binary.downloadMethod) {
                    this.dialog.open(TextDialogComponent, {
                        panelClass: 'app-responsive-dialog',
                        data: {
                            title: '下载方式',
                            content: binary.downloadMethod
                        }
                    });
                } else if (binary.cloudDiskFile) {
                    window.open(binary.cloudDiskFile.url, '_blank');
                }
            },
            error: err => {
                this.notificationService.warn('下载失败' + err.statusMessage);
            }
        });
    }

    copyCloudDiskCode(binary: Binary): void {
        navigator.clipboard.writeText(binary.cloudDiskFile.code).then(() => {
            this.notificationService.success('网盘密码已复制');
        });
    }

    onDelete(binary: Binary) {
        this.interactionService.confirm({
            title: '删除版本',
            message: `确定要删除版本 ${version2str(binary.version)} 吗？此操作不可撤销。`,
            confirmText: '删除版本',
            danger: true,
        }).subscribe(confirmed => confirmed && this.san11pkService.deleteBinary(new DeleteBinaryRequest({
            name: binary.name
        })).subscribe(
            empty => {
                this.notificationService.success('删除成功');
                this.reload.emit();
            },
            error => {
                this.notificationService.warn('删除失败:' + error.statusMessage);
            }
        ));
    }

    onOffload(binary: Binary) {
        this.interactionService.confirm({
            title: '卸载版本文件',
            message: `将清除版本 ${version2str(binary.version)} 的文件，但保留版本记录。`,
            confirmText: '卸载文件',
            danger: true,
        }).subscribe(confirmed => confirmed && this.san11pkService.updateBinary(new UpdateBinaryRequest({
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
        ));
    }
}
