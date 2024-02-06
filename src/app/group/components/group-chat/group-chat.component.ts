import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { selectGroupsMessagesData } from 'src/app/redux/selectors/group-dialog.selectors';
import { ItemMessage, MessagesData } from 'src/app/redux/state.model';
import { PeopleService } from 'src/app/connections/services/people.service';
import { GroupDialogActions } from 'src/app/redux/actions/group-dialog.actions';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
})
export class GroupChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id!: string | null;

  @ViewChild('chatWrapper')
  private chatWrapper!: ElementRef<HTMLElement>;

  private destroySubject$ = new Subject<void>();

  private groupMessages$: Observable<MessagesData> = this.store.select(
    selectGroupsMessagesData,
  );

  public messages: ItemMessage[] = [];

  form = this.formBuilder.group({
    message: ['', [Validators.required]],
  });

  constructor(
    private store: Store,
    public authService: AuthService,
    public loadingService: LoadingService,
    public formBuilder: FormBuilder,
    public peopleService: PeopleService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.cdr.detectChanges();
    if (this.chatWrapper) {
      this.chatWrapper.nativeElement.scrollTop =
        this.chatWrapper.nativeElement.scrollHeight;
    }
  }

  onSubmit() {
    const { message } = this.form.value;

    if (this.form.valid && message && this.id) {
      this.store.dispatch(
        GroupDialogActions.addGroupNewMessage({
          groupID: this.id,
          message,
        }),
      );
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.groupMessages$
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res) => {
        if (this.id && this.id in res) {
          this.messages = [...res[this.id]];
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}
