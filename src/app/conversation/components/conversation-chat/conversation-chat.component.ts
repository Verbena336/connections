import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ConversationActions } from 'src/app/redux/actions/conversation.actions';
import { selectConversationsMessagesData } from 'src/app/redux/selectors/conversation.selectors';
import { ItemMessage, MessagesData } from 'src/app/redux/state.model';

@Component({
  selector: 'app-conversation-chat',
  templateUrl: './conversation-chat.component.html',
  styleUrls: ['./conversation-chat.component.scss'],
})
export class ConversationChatComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() id!: string | null;

  @ViewChild('chatWrapper')
  private chatWrapper!: ElementRef<HTMLElement>;

  private destroySubject$ = new Subject<void>();

  public conversationMessages$: Observable<MessagesData> = this.store.select(
    selectConversationsMessagesData,
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
        ConversationActions.addConversationNewMessage({
          conversationID: this.id,
          message,
        }),
      );
      this.form.reset();
    }
  }

  ngOnInit(): void {
    this.conversationMessages$
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
