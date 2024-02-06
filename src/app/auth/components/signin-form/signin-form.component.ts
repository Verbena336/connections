import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MyErrorStateMatcher } from '../../helpers/ErrorStateMatcher';
import { UserData } from '../../models/userData.model';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.scss'],
})
export class SigninFormComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<void>();

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public matcher = new MyErrorStateMatcher();

  public isWrongValues = false;

  public isLoading$ = this.loadingService.isLoading$;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private zone: NgZone,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(() => {
        if (this.isWrongValues) {
          this.isWrongValues = false;
        }
      });
  }

  get password() {
    return this.form.get('password');
  }

  get email() {
    return this.form.get('email');
  }

  handleSignUpNavigation() {
    this.zone.run(() => {
      this.router.navigate(['/signup']);
    });
  }

  handleMainNavigation() {
    this.zone.run(() => {
      this.router.navigate(['/']);
    });
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (this.form.valid && password && email) {
      this.authService
        .login({ email, password })
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.authService.saveData({ email, ...res } as UserData);
            this.snackBar.open('Login success', 'Close');
          },
          error: (error) => {
            if (error.type === 'NotFoundException') {
              this.isWrongValues = true;
            }
            this.snackBar.open(error.message, 'Close');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
