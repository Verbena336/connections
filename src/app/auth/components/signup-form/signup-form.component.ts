import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/loading.service';
import { passwordValidator } from '../../helpers/PasswordValidator';
import { AuthService } from '../../services/auth.service';
import { MyErrorStateMatcher } from '../../helpers/ErrorStateMatcher';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit, OnDestroy {
  private destroySubject$ = new Subject<void>();

  private errorEmailsSubject$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  form = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\p{L} ]+$/u),
        Validators.maxLength(40),
      ],
    ],
    email: ['', [Validators.required, Validators.email, this.emailValidator()]],
    password: ['', [Validators.required, passwordValidator()]],
  });

  public matcher = new MyErrorStateMatcher();

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
    this.errorEmailsSubject$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(() => {
        this.email?.updateValueAndValidity();
      });
  }

  get password() {
    return this.form.get('password');
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let error = null;
      this.errorEmailsSubject$.pipe(take(1)).subscribe((emails: string[]) => {
        if (emails.includes(control.value)) {
          error = { taken: true };
        }
      });
      return error;
    };
  }

  handleSignInNavigation() {
    this.zone.run(() => {
      this.router.navigate(['/signin']);
    });
  }

  onSubmit() {
    const { name, email, password } = this.form.value;
    if (this.form.valid && name && password && email) {
      this.authService
        .registration({ name, email, password })
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.snackBar.open(`Welcome, ${name}`, 'Close');
            this.handleSignInNavigation();
          },
          error: (error) => {
            if (error.type === 'PrimaryDuplicationException') {
              this.errorEmailsSubject$.next([
                ...this.errorEmailsSubject$.value,
                email,
              ]);
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
