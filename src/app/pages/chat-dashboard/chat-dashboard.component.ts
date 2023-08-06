import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { Message } from 'src/app/model/message';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss'],
})
export class ChatDashboardComponent {
  currentUser!: User | null;
  toUser!: User | null;
  message: string = '';
  chatRefNode: string = '';
  oppChatRefNode: string = '';

  chatSubscription!: Subscription;
  chats: Message[] = [];

  @ViewChild("messageBox",{static:false}) messageBox!:ElementRef; 

  constructor(
    public authService: AuthService,
    private fireAuth: AngularFireAuth,
    private fireDb: AngularFireDatabase,
    private toastr: ToastrService
  ) {
    //get current loggedIn user
    this.fireAuth.authState.subscribe((user) => {
      console.log(user);
      this.authService.getUserByUserId(user?.uid).subscribe((user) => {
        this.currentUser = user;
        console.log(this.currentUser);
      });
    });
  }

  startChatParent(uid: string) {
    console.log(uid);
    if(this.chatSubscription){
      this.chatSubscription.unsubscribe();
    }
    this.chats=[]
    this.chatRefNode = `chats/${this.currentUser?.uid}****${uid}`;
    this.oppChatRefNode = `chats/${uid}****${this.currentUser?.uid}`;
    this.authService.getUserByUserId(uid).subscribe({
      next: (user) => {
        this.toUser = user;
        console.log(this.toUser);
        this.loadMessages();
      },
      error: (error) => {
        this.toastr.error('Error Loading Chat');
      },
    });
  }

  logout() {
    this.authService.logoutFromFirebase();
  }

  sentMessage(event: SubmitEvent) {
    event.preventDefault();
    if (this.message.trim() == '') {
      return;
    }
    const message = new Message();
    message.message = this.message;
    message.from = this.currentUser?.uid || '';
    message.to = this.toUser?.uid || '';

    const chatRef: AngularFireObject<Message> = this.fireDb.object(
      `${this.chatRefNode}/${new Date()}`
    );
    chatRef
      .set(message)
      .then((data) => {
        this.toastr.success('Message Sent Successfully');
        console.log(data);
        // this.scrollBottom();
        this.message = '';
      })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Error Sending Message');
      });
  }

  loadMessages() {
    // this.scrollBottom();
    this.chatSubscription = this.fireDb
      .list(this.chatRefNode)
      .valueChanges()
      .subscribe((chatList: any[]) => {
        this.chats = chatList;
        if (this.chats.length <= 0) {
          this.chatSubscription.unsubscribe();
          this.chatSubscription=this.fireDb
            .list(this.oppChatRefNode)
            .valueChanges()
            .subscribe((chatList: any[]) => {
              this.chats = chatList;
              this.chatRefNode = this.oppChatRefNode;
              this.scrollBottom();
            });
        }
        else{
          this.scrollBottom()
        }
      });
      // this.scrollBottom();
  }

  scrollBottom(){
    this.messageBox.nativeElement.scrollTo({
      left:0,
      top:this.messageBox.nativeElement.scrollHeight,
      behavior:'smooth'
    })
  }
}
