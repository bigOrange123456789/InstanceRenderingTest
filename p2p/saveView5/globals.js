// globals.js
export{getRandomString,removeNullEntries,
    isData,isNull,isString,getTracks,isUnifiedPlanSupportedDefault}

function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function removeNullEntries(array) {
    var newArray = [];
    array.forEach(function(item) {
        if (item) {
            newArray.push(item);
        }
    });
    return newArray;
}


function isData(session) {
    return !session.audio && !session.video && !session.screen && session.data;
}

function isNull(obj) {
    return typeof obj === 'undefined';
}

function isString(obj) {
    return typeof obj === 'string';
}

//
function getTracks(stream, kind) {
    if (!stream || !stream.getTracks) {
        return [];
    }

    return stream.getTracks().filter(function(t) {
        return t.kind === (kind || 'audio');
    });
}

//
function isUnifiedPlanSupportedDefault() {
    var canAddTransceiver = false;

    try {
        if (typeof RTCRtpTransceiver === 'undefined') return false;
        if (!('currentDirection' in RTCRtpTransceiver.prototype)) return false;

        var tempPc = new RTCPeerConnection();

        try {
            tempPc.addTransceiver('audio');
            canAddTransceiver = true;
        } catch (e) {}

        tempPc.close();
    } catch (e) {
        canAddTransceiver = false;
    }

    return canAddTransceiver && isUnifiedPlanSuppored();
}

function isUnifiedPlanSuppored() {
    var isUnifiedPlanSupported = false;

    try {
        var pc = new RTCPeerConnection({
            sdpSemantics: 'unified-plan'
        });

        try {
            var config = pc.getConfiguration();
            if (config.sdpSemantics == 'unified-plan')
                isUnifiedPlanSupported = true;
            else if (config.sdpSemantics == 'plan-b')
                isUnifiedPlanSupported = false;
            else
                isUnifiedPlanSupported = false;
        } catch (e) {
            isUnifiedPlanSupported = false;
        }
    } catch (e) {
        isUnifiedPlanSupported = false;
    }

    return isUnifiedPlanSupported;
}
