import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/auth/helpers/ErrorStateMatcher';
import { GroupDialogService } from 'src/app/group/services/group-dialog.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-create-group-modal',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateGroupModalComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateGroupModalComponent>,
    private formBuilder: FormBuilder,
    private groupService: GroupDialogService,
    private snackBar: MatSnackBar,
  ) {}

  public isLoading = false;

  form = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[\p{L}\d ]+$/u),
      ],
    ],
  });

  matcher = new MyErrorStateMatcher();

  get name() {
    return this.form.get('name');
  }

  onSubmit() {
    if (this.form.valid && this.name?.value) {
      this.isLoading = true;
      this.dialogRef.disableClose = true;
      return this.groupService
        .createGroup(this.name?.value)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.dialogRef.disableClose = false;
            this.snackBar.open(
              `Group ${this.name?.value} was created`,
              'Close',
            );
            return this.dialogRef.close();
          },
          error: (error) => {
            this.isLoading = false;
            this.dialogRef.disableClose = false;
            this.snackBar.open(error.message, 'Close');
          },
        });
    }
    return null;
  }
}
