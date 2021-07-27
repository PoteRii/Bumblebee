module.exports = function (callback, content, processId) {

    var process = function (content, processId) {
        var data = content;

        var responseData = {
            referredProcessId: processId,
            referredProcessName: "",
            referrerProcessCount: 0,
            referrerProcesses: []
        };

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (item.conv_type == "process") {
                if (item.obj_id == processId) {
                    responseData.referredProcessName = item.title
                }

                if (item.scheme.nodes) {
                    for (var j = 0; j < item.scheme.nodes.length; j++) {
                        var node = item.scheme.nodes[j];
                        if (node.condition && node.condition.logics) {
                            for (var k = 0; k < node.condition.logics.length; k++) {
                                var logic = node.condition.logics[k];
                                if (logic.type == "api_rpc" || logic.type == "api_copy") {
                                    if (logic.conv_id == processId) {
                                        if (responseData.referrerProcesses.filter(proc => proc.processId == item.obj_id).length == 0) {
                                            responseData.referrerProcesses.push({
                                                processId: item.obj_id,
                                                processName: item.title
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        responseData.referrerProcessCount = responseData.referrerProcesses.length;

        return JSON.stringify(responseData);
    }

    callback(null, process(JSON.parse(content), processId));
}