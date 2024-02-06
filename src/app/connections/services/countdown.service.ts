import { Injectable } from '@angular/core';
import { skip, takeWhile, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  public timers = new Map<string, number>();

  startTimer(id: string) {
    if (!this.timers.has(id)) {
      this.timers.set(id, 60);
      timer(0, 1000)
        .pipe(
          skip(1),
          takeWhile(() => this.timers.get(id)! > 1),
        )
        .subscribe({
          next: () => {
            if (this.timers.has(id)) {
              this.timers.set(id, this.timers.get(id)! - 1);
            }
          },
          complete: () => {
            this.timers.delete(id);
          },
        });
    }
  }

  // Second variant
  // private startTime = new Map<string, number>();

  // startTimer(id: string) {
  //   if (!this.timers.has(id)) {
  //     const duration = 10;
  //     this.timers.set(id, duration);
  //     this.startTime.set(id, Date.now());

  //     timer(0, 1000)
  //       .pipe(
  //         map(() => {
  //           const now = Date.now();
  //           const start = this.startTime.get(id);
  //           const elapsed = (now - start!) / 1000;
  //           return duration - elapsed;
  //         }),
  //         takeWhile((timeLeft) => timeLeft > 0),
  //       )
  //       .subscribe({
  //         next: (timeLeft) => {
  //           this.timers.set(id, Math.ceil(timeLeft));
  //         },
  //         complete: () => {
  //           this.timers.delete(id);
  //           this.startTime.delete(id);
  //         },
  //       });
  //   }
  // }
}
