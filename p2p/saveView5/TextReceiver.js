// TextReceiver.js & TextSender.js
export {TextReceiver}
function TextReceiver(connection) {
    var content = {};

    function receive(data, userid, extra) {
        // uuid is used to uniquely identify sending instance
        var uuid = data.uuid;
        if (!content[uuid]) {
            content[uuid] = [];
        }

        content[uuid].push(data.message);

        if (data.last) {
            var message = content[uuid].join('');
            if (data.isobject) {
                message = JSON.parse(message);
            }

            // latency detection
            var receivingTime = new Date().getTime();
            var latency = receivingTime - data.sendingTime;

            var e = {
                data: message,
                userid: userid,
                extra: extra,
                latency: latency
            };

            if (connection.autoTranslateText) {
                e.original = e.data;
                connection.Translator.TranslateText(e.data, function(translatedText) {
                    e.data = translatedText;
                    connection.onmessage(e);
                });
            } else {
                connection.onmessage(e);
            }

            delete content[uuid];
        }
    }

    return {
        receive: receive
    };
}
