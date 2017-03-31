import { Component, ChangeDetectorRef } from '@angular/core';
declare var easyrtc: any;
@Component({
  selector: 'my-app',
  template: `
  <div class="wrapper-app">
  <header><h1>EasyRTC TypeScript with Angular 2</h1></header>
  <div class="wrapper-content">
    <h2>Simple Audio/Video Demo</h2>
    <div><strong>I am:</strong> {{myId}}</div>
    <div class="connect-caller-buttons">
      <h3>Connected Clients:</h3>
      <div id="otherClients"><button *ngFor="let easyrtcId of (connectedClientsList)" (click)="performCall(easyrtcId)">{{easyrtcId}}</button></div>
    </div>
    <div class="video-frames">
      <div class="video-self"><video id="videoSelf"></video></div>
      <div class="video-caller"><video id="videoCaller"></video></div>
    </div>
  </div>
  <footer><div>Copyright &copy; 2016 Skedans Systems Inc.</div></footer>
</div>
              `,
})
export class AppComponent  {

 constructor(private cdr:ChangeDetectorRef) { }

 myId:string = '';
 connectedClientsList:Array<string> = [];

 clearConnectList():void {
   this.connectedClientsList = [];
   this.cdr.detectChanges();
 }

 performCall(clientEasyrtcId:string):void {
   let successCB = function(a:string, b:string):void {};
   let failureCB = function(a:string, b:string):void {};
   easyrtc.call(clientEasyrtcId, successCB, failureCB, undefined, undefined);
 }

 buildCaller(easyrtcid:string):(()=>void) {
   return ():void => {
     this.performCall(easyrtcid);
   };
 }

 convertListToButtons (roomName:string, data:any, isPrimary:boolean):void {
   this.clearConnectList();
   for(let easyrtcid in data) {
     this.connectedClientsList.push(easyrtc.idToName(easyrtcid));
   }
   this.cdr.detectChanges();
 }

 updateMyEasyRTCId(myEasyRTCId:string):void {
   this.myId = myEasyRTCId;
   this.cdr.detectChanges();
 }

 loginSuccess(easyrtcid:string):void {
   this.updateMyEasyRTCId(easyrtc.cleanId(easyrtcid));
 }

 loginFailure(errorCode:string, message:string):void {
   this.updateMyEasyRTCId('Login failed. Reason: '+ message);
 }

 connect():void {
   easyrtc.setVideoDims(320,240,undefined);
   let convertListToButtonShim = (roomName:string, data:any, isPrimary:boolean):void => {
     this.convertListToButtons(roomName, data, isPrimary);
   }
   easyrtc.setRoomOccupantListener(convertListToButtonShim);
   easyrtc.easyApp("easyrtc.audioVideoSimple", "videoSelf", ["videoCaller"], this.loginSuccess.bind(this), this.loginFailure.bind(this));
 }

 ngAfterViewInit() {
   this.connect();
 }
}
