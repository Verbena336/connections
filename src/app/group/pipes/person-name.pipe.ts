import { PeopleService } from 'src/app/connections/services/people.service';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Pipe({
  name: 'personName',
  standalone: true,
})
export class PersonNamePipe implements PipeTransform {
  constructor(
    private peopleService: PeopleService,
    private authService: AuthService,
  ) {}

  transform(uid: string) {
    return this.peopleService.getPersonName(uid);
  }
}
