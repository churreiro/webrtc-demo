PeerConnection = function(configuration, signaling) {
    var offer_waiting = false;
    var streams = [];
    var sequence = 1;
    
    var caller_session_id = undefined;
    var callee_session_id = undefined;

    var error = function(err) {
	console.log("ERROR: " + err);
	throw ("ERROR: " + err);
    };

    var generate_id = function() {
	return new Date().getTime();
    };

    var send_message = function(msg, type) {
	var extra = {
	    messageType:type,
	    callerSessionId:caller_session_id,
	};
	
	if (callee_session_id) {
	    extra.calleeSessionId = callee_session_id;
	}

	// Write this deferred	
	setTimeout(function(){
		       signaling($.extend(msg, extra))
		   }, 0);
    };

    
    var make_offer = function() {
	if (!caller_session_id) {
	    caller_session_id = generate_id();
	}
	
	return {
	    seq:sequence++,
	    sdp:"Bogus"
	};
    };
    
    var process_offer = function(offer) {
	if (caller_session_id === null) {
	    caller_session_id = offer.callerSessionId;
	}
	
	if (caller_session_id !== offer.callerSessionId){
	    error("Session ID mismatch");
	}

	if (!callee_session_id) {
	    callee_session_id = generate_id();
	}
	
	send_message(
	    {
		sdp:"Bogus"
	    },
	    "ANSWER"
	);
    };

    var addStream = function(mediaStream) {
	if (!offer_waiting) {
	    setTimeout(function() {
			   send_message(make_offer(), "OFFER");
			   offer_waiting = false;
		       },
		       0);

	    offer_waiting = true;
	}
    };


    var removeStream = function(removeStream) {
    };

    
    var processSignalingMessage = function(message) {
	if (message.messageType == "OFFER") {
	    process_offer(message);
	}


    };


    return {
	addStream: addStream,
	removeStream : removeStream
    };
};