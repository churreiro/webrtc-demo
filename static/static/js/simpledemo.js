
var generic_log = function(window,msg) {
  //will only auto-scroll if scroll position is already at bottom 
  //var doAutoscroll = ($(window).scrollTop()==$(window)[0].scrollHeight);

  var t = document.createTextNode(msg);
  var d = document.createElement("div");
  $(d).append(t);

  $(window).append(d);

  //if (doAutoscroll) $(window).scrollTop($(window)[0].scrollHeight);
};
var fancy_log = function(msg) {
  //will only auto-scroll if scroll position is already at bottom 
  //var doAutoscroll = ($(window).scrollTop()==$(window)[0].scrollHeight);

  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = msg;
  datawindow.appendChild(pre); // $(window).* here doesn't work right

  //if (doAutoscroll) $(window).scrollTop($(window)[0].scrollHeight);
};
var ui_log   = function(msg) { generic_log("#logwindow",msg); };
var data_log = function(msg) { fancy_log(msg); };

// simple wrapper around XHR. The cool kids use JQuery here, but
// we want a self-contained example
var ajax = function (params) {
  var xhr = new XMLHttpRequest();
  xhr.open(
  params.type || "GET", params.url, true);
  if (params.contentType) {
    xhr.setRequestHeader("Content-Type", params.contentType)
  }
  if (params.data) {
    xhr.send(params.data);
  } else {
    xhr.send();
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (params.success) {
          params.success(xhr.responseText);
        }
      } else {
        if (params.error) {
          params.error(xhr.responseText);
        }
      }
    }
  }
};


var CallingClient = function(config_, username, peer, local, remote, start_call, ip) {
  console.log("Calling client constructor");
  var poll_timeout = 500; // ms
  var config = $.extend({}, config_);
  var state = "INIT";
  var local_ = local;
  var remote_ = remote;

  var log = function(msg) {
    console.log("LOG (" + username + "): " + msg);
    ui_log("LOG (" + username + "): " + msg);
  };

  var HangUp = function() {
    webrtc.hangup();
  }

  var StartCall = function() {
    webrtc.startCall();
    local_.play();
    remote_.play();
  }

  log("Calling client: user=" + username + " peer = " + peer);
  log(" config = " +JSON.stringify(config));
  var webrtc = navigator.getWebrtcContext(JSON.stringify(config), function(msg, arg, localStream, remoteStream) {
    switch (msg) {
    case "STREAM":
	//alert(" local stream " + localStream  +" remote stream " + remoteStream);
	local.src = localStream;
	remote.src = remoteStream;
	break;
    case "RINGING":
      var answer = confirm("Incoming call! Accept?");
      if (answer) {
		webrtc.accept();
		local.play();
		remote.play();
      }
      else webrtc.hangup();
      break;
    case "IPFOUND":
	  log(" ip found " );
      if (!start_call) {
        var link = document.getElementById("callme");
        link.href += "/" + arg;
        link.style.display = "block";
      }
      break;
    }
  });

  var poll_success = function(msg) {
    var js = JSON.parse(msg);
    log("Received message " + JSON.stringify(js));

    webrtc.processMessage(js.body);
    setTimeout(poll, poll_timeout);
  };

  var poll_error = function (msg) {
    setTimeout(poll, poll_timeout);
  };

  var poll = function () {
    ajax({
      url: "/msg/" + username + "/",
      success: poll_success,
      error: poll_error
    });
  };

  var internal_poll = function () {
    msg = webrtc.messagePoll();

    if (msg !== "") {
      log("Received message from webrtc subsystem");
      log(msg);


      var msg2 = {
        dest: peer,
        body: msg
      };

      log("Sending: " + JSON.stringify(msg2));

      ajax({
        url: "/msg/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(msg2)
      });
    }

    setTimeout(internal_poll, 1000);
  };

  var startit = function () {
      channel = webrtc.getDataChannel();
      channel.onopen = function() {
	  data_log('<span style="color: red;">onopen fired</span>');
      };
      channel.onmessage = function(evt) {
	  data_log('<span style="color: red;">RESPONSE: ' + evt.data  + "state = " + channel.readyState + '</span>');
      };
      iter = 0;
      sendit();
  };

  var sendit = function () {
      iter = iter + 1;
      channel.send("Hi there! #" + iter);
      setTimeout(sendit, 3000);
  };

    webrtc.ondatachannel = function(evt) {
      var remote = evt.data;
      remote.onopen = function() {
	data_log('<span style="color: blue;">onopen fired</span>');
      };
      remote.onmessage = function(evt) {
	  data_log('<span style="color: blue;">RESPONSE: ' + evt.data  + "state = " + remote.readyState + '</span>');
	  remote.send("yes, I heard you say " + evt.data);
      };
      remote.send("Hey, you opened a channel!");
    };

  if (start_call) {
      log("Making call to " + peer);
      webrtc.startCall();
      local.play();
      remote.play();
      data_log(" I an going to connect to the datachannel ip " + ip);;
      webrtc.Connect(ip,"9999");
  } else {
      log("Waiting for call as " + username);
      data_log(" doing datachannel listen on port 9999" );
      webrtc.onconnection = function() {
	  // Use onconnection to avoid receive callback race condition
	  startit();
      };
      webrtc.Listen("9999");
  }

  // Start polling
  poll();
  internal_poll();

  return { 
    HangUp : HangUp,
    StartCall : StartCall
  }

};


default_config = {
  stun: 'stun.l.google.com:19302'
};

//new CallingClient(config, "abc", "def", video, true);
