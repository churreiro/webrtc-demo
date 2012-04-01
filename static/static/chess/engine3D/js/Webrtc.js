var WEBRTC;
var Webrtc=function() {


    var server=lib_dom.get("server"); //"http://192.168.1.32:8888";
    var myId = -1;
    var myName;
    var remoteId = -1;
    var remoteName;
    var request = null;
    var hangingGet = null;
    var pc = null;
    var localStream = null;
    var disconnecting = false;
    var callState = 0; // 0 - Not started, 1 - Call ongoing



    // General

    /*function setElementValuesFromURL() {
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
          document.getElementById(key).value = unescape(value);
        });
    }*/
    var that={

    peerList: [],
    data: false,
    ajaxR: false,
    afterConnect: lib_dom.get('afterConnect'),
    beforeConnect: lib_dom.get('beforeConnect'),
    inputName: lib_dom.get("name"),
    connectButton: lib_dom.get("connect"),
    
    init: function() {
        window.onbeforeunload = that.disconnect;
        if (navigator.webkitGetUserMedia) {
             that.getUserMedia();
        } else {
            GAME.troubleshooting();
         }
    },

    get_myName: function() {return myName;},

    sendMsg: function(msg) {
        //console.log('remote', remoteId);
        if (remoteId !=-1) that.sendToPeer(remoteId, msg);
    },

    setCallState: function(state) {
      callState = state;
    },

    checkPeerConnection: function() {
      if (!pc) {
        return 0;
      }
      return 1;
    },

    // Local stream generation
    gotStream: function(s) {
      var url = webkitURL.createObjectURL(s);
      document.getElementById("localView").src = url;
      localStream = s;
    },

    gotStreamFailed: function(error) {
      alert("Failed to get access to local media. Error code was " + error.code + ".");
    },

    getUserMedia: function() {
      try {
        navigator.webkitGetUserMedia("video,audio", that.gotStream, that.gotStreamFailed);
      } catch (e) {
        alert("getUserMedia error");
      }
    },

    // Peer list and remote peer handling
    peerExists: function(id) {
      try {
        var peerList = document.getElementById("peers");
        for (var i = 0; i < peerList.length; i++) {
          if (parseInt(peerList.options[i].value) == id)
            return true;
        }
      } catch (e) {
        alert("Error searching for peer");
      }
      return false;
    },

    addPeer: function(id, pname) {
      try {
        var peerList = document.getElementById("peers");
        if (that.peerList.indexOf(id)!==-1) return false;
        that.peerList.push(id);
        var option = document.createElement("option");
        option.text = pname;
        option.value = id;
        peerList.add(option, null);
        return true;
      } catch (e) {
        alert("Error adding peer");
      }
    },

    checkPeer: function(id, pname) {
      that.freeCallback=that.addPeer;
      that.busyCallback=function() {};
      that.sendToPeer(id, "CHESS:ISBUSY");
      //that.addPeer(id, pname);
    },

    removePeer: function(id) {
      try {
        var peerList = document.getElementById("peers");
        for (var i = 0; i < peerList.length; i++) {
          if (parseInt(peerList.options[i].value) == id) {
            peerList.remove(i);
            break;
          }
        }
      } catch (e) {
        alert("Error removing peer");
      }
    },

    clearPeerList: function() {
      that.peerList=[];
      var peerList = document.getElementById("peers");
      while (peerList.length > 0)
        peerList.remove(0);
    },

    setSelectedPeer: function(id) {
      try {
        var peerList = document.getElementById("peers");
        for (var i = 0; i < peerList.length; i++) {
          if (parseInt(peerList.options[i].value) == id) {
            peerList.options[i].selected = true;
            return true;
          }
        }
      } catch (e) {
        alert("Error setting selected peer");
      }
      return false;
    },

    getPeerName: function(id) {
      try {
        var peerList = document.getElementById("peers");
        for (var i = 0; i < peerList.length; i++) {
          if (parseInt(peerList.options[i].value) == id) {
            return peerList.options[i].text;
          }
        }
      } catch (e) {
        alert("Error finding peer name");
        return;
      }
      return;
    },

    storeRemoteInfo: function() {
      try {
        var peerList = document.getElementById("peers");
        if (peerList.selectedIndex < 0) {
          alert("Please select a peer.");
          return false;
        } else
          remoteId = parseInt(peerList.options[peerList.selectedIndex].value);
          remoteName = peerList.options[peerList.selectedIndex].text;
      } catch (e) {
        alert("Error storing remote peer info");
        return false;
      }
      return true;
    },

    // Call control
    createPeerConnection: function() {
      if (pc) {
        alert("PeerConnection object already exists");
      }

      try {
        pc = new webkitPeerConnection("STUN stun.l.google.com:19302",
          that.onSignalingMessage);
      pc.onaddstream = that.onAddStream;
      pc.onremovestream = that.onRemoveStream;
      
      } catch (e) {
        alert("Create PeerConnection error");
      }
    },

    doCallCheck: function() {

      if (!that.storeRemoteInfo())
        return;
      that.freeCallback=that.doCall;
      that.busyCallback=function() { alert("This player has started a game :( . Please try another one ;) ."); };
      that.sendToPeer(remoteId, "CHESS:ISBUSY");

    },

    doCall: function(useless, useless2) {
      document.getElementById("call").disabled = true;
      document.getElementById("peers").disabled = true;
      that.createPeerConnection();
      pc.addStream(localStream);
      that.setCallState(1);

      GAME.setBlack();
    },


    hangUp: function() { //called only by disconnect
      that.sendToPeer(remoteId, "BYE");
      that.closeCall();
    },

    closeCall: function() {
      document.getElementById("remoteView").src = "dummy";
      if (pc) {
        pc.close();
        pc = null;
      } else
      remoteId = -1;
      document.getElementById("call").disabled = false;
      document.getElementById("peers").disabled = false;
      that.setCallState(0);
    },

    // PeerConnection callbacks
    onAddStream: function(e) {
      var stream = e.stream;
      var url = webkitURL.createObjectURL(stream);
      document.getElementById("remoteView").src = url;
      GAME.start();
    },

    onRemoveStream: function(e) {
      // Currently if we get this callback, call has ended.
      document.getElementById("remoteView").src = "";
    },

    onSignalingMessage: function(msg) {
      that.sendToPeer(remoteId, msg);
    },

    // TODO: Add callbacks onconnecting, onopen and onstatechange.

    // Server interaction

    handleServerNotification: function(data) {
      if (GAME.started) return false;
      var parsed = data.split(",");
      if (parseInt(parsed[2]) == 1) { // New peer
        var peerId = parseInt(parsed[1]);
        if (!that.peerExists(peerId)) {
          var peerList = document.getElementById("peers");
          if (peerList.length == 1 && peerList.options[0].value == -1)
            that.clearPeerList();
          that.addPeer(peerId, parsed[0]); //that.addPeer before modif :)
          document.getElementById("peers").disabled = false;
          document.getElementById("call").disabled = false;
        }
      } else if (parseInt(parsed[2]) == 0) { // Removed peer
        that.removePeer(parseInt(parsed[1]));
        if (document.getElementById("peers").length == 0) {
          document.getElementById("peers").disabled = true;
          that.addPeer(-1, "There is no player available");
        }
      }
    },

    handlePeerMessage: function(peer_id, msg) {
      if (GAME.handleMsg(msg, peer_id)) return true;
      var peerName = that.getPeerName(peer_id);
      if (peerName == undefined) {
        //GAME.handleMsg(msg, peer_id);
        return;
      }

      // Assuming we receive the message from the peer we want to communicate with.
      // TODO: Only accept messages from peer we communicate with with if call is
      // ongoing.
      if (msg.search("BYE") == 0) {
        // Other side has hung up.
        that.closeCall()
      } else {        
        if (!pc) {
          // Other side is calling us, startup
          if (!that.setSelectedPeer(peer_id)) {
            //GAME.handleMsg(msg, peer_id);
            return;
          }
          if (!that.storeRemoteInfo())
            return;
          document.getElementById("call").disabled = true;
          document.getElementById("peers").disabled = true;
          that.createPeerConnection();
          try {
            pc.processSignalingMessage(msg);
          } catch (e) {
            console.log("Process signaling message error 1 "+msg);
          }
          pc.addStream(localStream);
        } else {
          try {
            //if (GAME.handleMsg(msg, peer_id)) return true;
            pc.processSignalingMessage(msg);
          } catch (e) {
            console.log("Process signaling message error 2 "+msg);
          }
        }
      }
    },

    getIntHeader: function(r, name) {
      var val = r.getResponseHeader(name);
      return val != null && val.length ? parseInt(val) : -1;
    },

    hangingGetCallback: function() {
      try {
        if (hangingGet.readyState != 4 || disconnecting)
          return;
        if (hangingGet.status != 200) {
            hangingGet.statusText();
          //disconnect();
        } else {
          var peer_id = that.getIntHeader(hangingGet, "Pragma");
          if (peer_id == myId) {
            that.handleServerNotification(hangingGet.responseText);
          } else {
            that.handlePeerMessage(peer_id, hangingGet.responseText);
          }
        }

        if (hangingGet) {
          hangingGet.abort();
          hangingGet = null;
        }

        if (myId != -1)
          window.setTimeout(that.startHangingGet, 0);
      } catch (e) {
        //alert("Hanging get error");
      }
    },

    onHangingGetTimeout: function() {
      hangingGet.abort();
      hangingGet = null;
      if (myId != -1)
        window.setTimeout(that.startHangingGet, 0);
    },

    startHangingGet: function() {
      try {
        hangingGet = new XMLHttpRequest();
        hangingGet.onreadystatechange = that.hangingGetCallback;
        hangingGet.ontimeout = that.onHangingGetTimeout;
        hangingGet.open("GET", server.value + "/wait?peer_id=" + myId, true);
        hangingGet.send();
      } catch (e) {
        alert("Start hanging get error");
      }
    },

    sendToPeer: function(peer_id, data) {
      if (myId == -1) {
        alert("Not connected.");
        return;
      }
      if (peer_id == myId) {
        alert("Can't send a message to oneself.");
        return;
      }
      that.ajaxR = new XMLHttpRequest();
      that.ajaxR.open("POST", server.value + "/message?peer_id=" + myId + "&to=" + peer_id, false);
      that.ajaxR.setRequestHeader("Content-Type", "text/plain");
      that.data=data;
      try {
        that.ajaxR.send(that.data);
        that.ajaxR = null;
      } catch (e) {
          that.data=data;
          //setTimeout(that.resendData, 100);
          //console.log("fail ajax : "+e);
      }
    },

    resendData: function() {
      that.ajaxR.send(that.data);
      that.ajaxR=null;
    },

    signInCallback: function() {
      try {
        if (request.readyState == 4) {
          if (request.status == 200) {
            that.afterConnect.style.opacity="1";
            that.beforeConnect.style.opacity="0.5";
            that.inputName.disabled=true;
            that.connectButton.innerHTML="Disconnect";
            
            var peers = request.responseText.split("\n");
            myId = parseInt(peers[0].split(",")[1]);
            that.clearPeerList();
            var added = 0;
            for (var i = 1; i < peers.length; ++i) {
              if (peers[i].length > 0) {
                var parsed = peers[i].split(",");
                that.checkPeer(parseInt(parsed[1]), parsed[0]); //addPeer before :)
                ++added;
              }
            }
            if (added == 0)
              that.addPeer(-1, "No player available");
            else {
              document.getElementById("peers").disabled = false;
              document.getElementById("call").disabled = false;
            }
            that.startHangingGet();
            request = null;
            //document.getElementById("connect").disabled = true;
          }
        }
      } catch (e) {
        alert("Sign in error");
        //document.getElementById("connect").disabled = false;
      }
    },

    signIn: function() {
      try {
        request = new XMLHttpRequest();
        request.onreadystatechange = that.signInCallback;
        request.open("GET", server.value + "/sign_in?" + myName, true);
        request.send();
      } catch (e) {
        alert("Start sign in error");
        //document.getElementById("connect").disabled = false;
      }
    },

    connect: function() {      
      if (myId!=-1) { //already connected -> disconnect
          that.disconnect();
          return
      }
      myName = that.inputName.value.toLowerCase();
      if (myName.length == 0) {
        alert("Please enter a name");
      } else {
        // TODO: Disable connect button here, but we need a timeout and check if we
        // have connected, if so enable it again.

        that.signIn();
      }
    },

    disconnect: function() {
      if (callState == 1)
        that.hangUp();

      disconnecting = true;
      that.afterConnect.style.opacity="0.5";
      that.beforeConnect.style.opacity="1";
      that.inputName.disabled=false;
      that.connectButton.innerHTML="Connect";

      if (request) {
        request.abort();
        request = null;
      }

      if (hangingGet) {
        hangingGet.abort();
        hangingGet = null;
      }

      if (myId != -1) {
        request = new XMLHttpRequest();
        request.open("GET", server.value + "/sign_out?peer_id=" + myId, false);
        request.send();
        request = null;
        myId = -1;
      }

      that.clearPeerList();
      that.addPeer(-1, "Not connected");
      //document.getElementById("connect").disabled = false;
      document.getElementById("peers").disabled = true;
      document.getElementById("call").disabled = true;

      disconnecting = false;
    }
    }//end that

    that.init();
    WEBRTC=that;
    return that;
}; // end fun webrtc


