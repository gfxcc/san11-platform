import { Component, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { version2str } from "src/app/utils/binary_util";
import { Binary } from "src/proto/san11-platform.pb";


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
    @Input() branch: Branch;
    @Input() editorPermission: boolean;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['version', 'createTime', 'size', 'downloadCount', 'actions'];
    dataSource: MatTableDataSource<Binary>;

    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.branch.binaries);
        // this.dataSource.paginator = this.paginator;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getVersionStr(binary: Binary): string {
        return version2str(binary.version);
    }
}
