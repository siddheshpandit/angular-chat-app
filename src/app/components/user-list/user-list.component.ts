import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Component, EventEmitter, Output } from '@angular/core';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  public userList:User[]=[]
  @Output() startChatEmitter:EventEmitter<string>=new EventEmitter();

  constructor(private fireDb:AngularFireDatabase){
    const userListRef:AngularFireList<User> = this.fireDb.list('users');
    userListRef.valueChanges().subscribe((users)=>{
      this.userList=users;
    })
  }

  startChatChild(uid:string){
    this.startChatEmitter.next(uid);
  }
}
