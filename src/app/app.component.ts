import { Component, OnInit, ViewChild} from '@angular/core';
declare var Peer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  @ViewChild('myvideo') myVideo: any;
  title = 'app';
  remote_peer_id;
  my_peer_id;
  my_message = "Say Hi";
  peer;
  conn;


  constructor(){
  }

  ngOnInit(){

    this.peer = new Peer();

    let that = this;
    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      that.my_peer_id = id;

      that  .peer.on('connection', function(conn) {
        conn.on('data', function(data){
          // Will print 'hi!'
          console.log("Remote Data",data);
        });
      });
    });

    var video = this.myVideo.nativeElement;
    let n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    this.peer.on('call', function(call) {
      n.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
          video.src = URL.createObjectURL(remoteStream);
          video.play();
          console.log("listening for video ");

        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });



  }

  makeConnection(){

   this.conn = this.peer.connect(this.remote_peer_id);
   let that = this;
// on open will be launch when you successfully connect to PeerServer
    this.conn.on('open', function(){
      // here you have conn.id
      that.conn.send(that.my_message);
    });
  }


  videoConnection(){

    var video = this.myVideo.nativeElement;


    let n = <any>navigator;
    let that = this;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    n.getUserMedia({video: true, audio: true}, function(stream) {
      var call = that.peer.call(that.remote_peer_id, stream);
      call.on('stream', function(remoteStream) {
         video.src = URL.createObjectURL(remoteStream);
         video.play();
         console.log("calling for video ");
      });
    }, function(err) {
      console.log('Failed to get local stream' ,err);
    });
  }
}
