import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.value;
    const hasUppercase = /[A-ZА-ЯЁ]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#?]/.test(password);

    const errors = [];

    if (!hasUppercase) {
      errors.push('at least 1 capital letter');
    }
    if (!hasNumber) errors.push('at least 1 digit');
    if (!hasSpecialChar) {
      errors.push('at least 1 special symbol, e.g., [! @ # ? ]');
    }
    if (password.length < 8) errors.push('at least 8 characters');

    return errors.length && password.length
      ? { passwordStrength: errors[0] }
      : null;
  };
}
