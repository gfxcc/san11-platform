import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from './components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class InteractionService {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      panelClass: 'app-confirm-dialog-panel',
      data,
    }).afterClosed();
  }

  undo(message: string, action = '撤销'): Observable<void> {
    return this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    }).onAction();
  }
}
