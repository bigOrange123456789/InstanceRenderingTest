//setup a peer connection with another user
connectToOtherUsernameBtn.addEventListener("click", function () {

    var otherUsername = otherUsernameInput.value;
    connectedUser = otherUsername;

    if (otherUsername.length > 0) {
        //make an offer
        myConnection.createOffer(function (offer) {
            console.log();
            send({
                type: "offer",
                offer: offer
            });

            myConnection.setLocalDescription(offer);
        }, function (error) {
            alert("An error has occurred.");
        });
    }
});

//when somebody wants to call us
function onOffer(offer, name) {
    connectedUser = name;
    myConnection.setRemoteDescription(new RTCSessionDescription(offer));

    myConnection.createAnswer(function (answer) {
        myConnection.setLocalDescription(answer);

        send({
            type: "answer",
            answer: answer
        });

    }, function (error) {
        alert("oops...error");
    });
}

//when another user answers to our offer
function onAnswer(answer) {
    myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

//when we got ice candidate from another user
function onCandidate(candidate) {
    myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}


//setup a peer connection with another user

connectToOtherUsernameBtn.addEventListener("click", function () {



    var otherUsername = otherUsernameInput.value;

    connectedUser = otherUsername;


    if (otherUsername.length > 0) {

        //make an offer

        myConnection.createOffer(function (offer) {

            console.log();

            send({

                type: "offer",

                offer: offer

            });


            myConnection.setLocalDescription(offer);

        }, function (error) {

            alert("An error has occurred.");

        });

    }

});



//when somebody wants to call us

function onOffer(offer, name) {

    connectedUser = name;

    myConnection.setRemoteDescription(new RTCSessionDescription(offer));


    myConnection.createAnswer(function (answer) {

        myConnection.setLocalDescription(answer);


        send({

            type: "answer",

            answer: answer

        });


    }, function (error) {

        alert("oops...error");

    });

}



//when another user answers to our offer

function onAnswer(answer) {

    myConnection.setRemoteDescription(new RTCSessionDescription(answer));

}



//when we got ice candidate from another user

function onCandidate(candidate) {

    myConnection.addIceCandidate(new RTCIceCandidate(candidate));

}


