import { Injectable } from '@angular/core';
import { userModel } from './models/usermodel'
import { HttpClient } from '@angular/common/http';
import { Signup } from './models/SignupModel';
import { Router } from '@angular/router';
import { friendRequest } from './models/friend-request';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';





@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  socket;
  myName: String;
  friendName: String;
  array1: String[] = []
  array2: String[] = []
  str: String;
  type: string;
  i=0;
  newRequest : string;
  messagearray: string[]=[]
  message : any;
  friendrequestModel : friendRequest;



  constructor(private http: HttpClient,
    private router: Router) { }

  public saveUser(userModel) {
    console.log(userModel)
    return this.http.post<userModel>('http://localhost:3000/userlogin', userModel);
  }

  public signup(signupmodel) {

    // calls api on backend to save the signup data in mongoDB
    return this.http.post<Signup>('http://localhost:3000/signup', signupmodel);
    this.router.navigate(['login'])
  }

  // returns a single user with the matching username
  public getUsers(userName) {

    return this.http.get<Signup>('http://localhost:3000/getUsers' + userName)
  }

  // returns all the users from the db
  public getAllUsers() {

    return this.http.get<Signup>('http://localhost:3000/getAllUsers');
  }

  public addFriendRequest(friendRequestModel) {

    console.log('Model is' + friendRequestModel)
    return this.http.post<friendRequest>('http://localhost:3000/addFriendRequest', friendRequestModel);
  }

  public getIncomingRequests(username) {
    return this.http.get<Signup>('http://localhost:3000/incomingRequests' + username)
  }

  public confirmRequest(friendRequestModel) {
    return this.http.post<friendRequest>('http://localhost:3000/confirmRequest', friendRequestModel)
  }
  
  // code for event emitter 
  private subject = new Subject<any>();
  sendClickEvent() {
    this.subject.next();
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  getClickEventforConnection(){
    return this.subject.asObservable();
  }

  setupsocket(){
    this.socket = io('localhost:3000')
  }
  setupConnection(){
   // this.socket = io('localhost:3000')
   
    //check if there is an incoming message
    this.socket.on('incomingmessage', (msg) => {
  
      if (msg.includes(localStorage.getItem('name'))) {


        this.socket.emit('readyToJoin', this.str)
        console.log(this.str, "service")

      }

      if ((msg.includes(localStorage.getItem('friendname')))) {

        this.socket.emit('readyToJoin', this.str)

      }


    })
  
  }

  listenMessages(){
    this.socket.on('message-broadcast', (msg) => {
      console.log(msg)
      if (msg) {
        if ((<HTMLInputElement>document.getElementById("textarea")).value.includes(this.type)) {
          (<HTMLInputElement>document.getElementById("textarea")).value = (<HTMLInputElement>document.getElementById("textarea")).value.replace(this.type, "");
          (<HTMLInputElement>document.getElementById("textarea")).value = (<HTMLInputElement>document.getElementById("textarea")).value.trim();
        }
      }
      if (msg.includes(localStorage.getItem('name'))) {
        msg = msg.replace(localStorage.getItem('name'), "You")
      }
      //here added if statement
   
      (<HTMLInputElement>document.getElementById("textarea")).value = (<HTMLInputElement>document.getElementById("textarea")).value + '\n' + msg;
      
    })
    this.socket.on('user-typing', (msg) => {
      this.type = msg;
  
      if (!(msg.includes(localStorage.getItem('name'))) && !((<HTMLInputElement>document.getElementById("textarea")).value.includes('typing....'))) {
        (<HTMLInputElement>document.getElementById("textarea")).value = (<HTMLInputElement>document.getElementById("textarea")).value + '\n' + msg;
      }
    })
  }

  newMessage(message_alert){
   
    this.myName = localStorage.getItem('name');
    this.friendName = localStorage.getItem('friendname');
    this.array1 = Array.from(this.myName);
    this.array2 = Array.from(this.friendName);
    this.array1 = this.array1.concat(this.array2)
    this.array1.sort();
    this.str = this.array1.join('')

      //notify the users for the incoming message
      this.socket.emit('newmessage', message_alert)

      //join a room 
    
     
    
  }

  sendMessage(message){
    this.socket.emit('joinRoom', this.str)

    this.socket.emit('message', message)
    console.log("my message")
  
    message = ""
  }


  handleRequest(){
  
    this.socket.on('fromrequest', (msg)=>{

      var from = msg.substr(0, msg.indexOf(' '));
      var to = msg.substr(msg.indexOf(' ')+1);

     
      if(to == localStorage.getItem('name')){
        this.messagearray.push(from)
       
      }
     
    })
    
    console.log('I am outside')
  }

  addFriend(username){

    var message = localStorage.getItem('name') + " "+ username;
    this.socket.emit('fromto', message)
   // this.socket.emit('to', username)
  }

  unfriend(friendRequestModel){
    console.log('In service', friendRequestModel)
    return this.http.post<String>('http://localhost:3000/unfriend', friendRequestModel)
  }

  disconnect(){
   this.socket.emit('disconnecting', 'disconnect_message')
  }

  showstatus(msg){
    this.socket.emit('online', msg);
  }

  pageRefreshed(msg){
    this.socket.emit('refreshed',msg);
  }

  showoffline(msg){
    this.socket.emit('offline', msg)
  }

  wanttoChat(msg){
    this.socket.emit('wantchat', msg);
  }

  sendUnfriendMessage(msg)
  {
    this.socket.emit('unfriend', msg);
  }
}
