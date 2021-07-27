module.exports = function (callback, content, keyWord) {

    var process = function (content, keyWord) {
        var data = content;
        var containingProcesses = [];

        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (item.conv_type == "process") {
                if (item.params) {
                    if (item.params.filter(param => param.name.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                        containingProcesses.push(
                            {
                                processId: item.obj_id,
                                processName: item.title,

                                inProcessParam: true
                            });
                    }
                }

                if (item.scheme.nodes) {
                    for (var j = 0; j < item.scheme.nodes.length; j++) {
                        var node = item.scheme.nodes[j];
                        if (node.condition && node.condition.logics) {
                            for (var k = 0; k < node.condition.logics.length; k++) {

                                var callProcessArgument = false;
                                var copyTaskArgument = false;
                                var apiCallUrlArgument = false;
                                var apiCallArgument = false;
                                var apiCallHeaderArgument = false;

                                var logic = node.condition.logics[k];
                                if (logic.type == "api_rpc") {
                                    var keys = Object.keys(logic.extra);
                                    var values = Object.values(logic.extra);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        callProcessArgument = true
                                    } 
                                } else if (logic.type == "api_copy") {
                                    var keys = Object.keys(logic.data);
                                    var values = Object.values(logic.data);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        copyTaskArgument = true
                                    }
                                } else if (logic.type == "api") {

                                    if (logic.url.toLowerCase().includes(keyWord.toLowerCase())) {
                                        apiCallUrlArgument = true;
                                    }

                                    var keys = Object.keys(logic.extra);
                                    var values = Object.values(logic.extra);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        apiCallArgument = true
                                    }

                                    var headerKeys = Object.keys(logic.extra_headers);
                                    var headerValues = Object.values(logic.extra_headers);

                                    if (headerKeys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || headerValues.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        apiCallHeaderArgument = true
                                    }
                                }

                                if (callProcessArgument == true ||
                                    copyTaskArgument == true ||
                                    apiCallUrlArgument == true ||
                                    apiCallArgument == true ||
                                    apiCallHeaderArgument == true) {
                                    var containingProcess = containingProcesses.filter(process => process.processId == item.obj_id);
                                    if (containingProcess && containingProcess.length > 0) {
                                        containingProcesses.filter(process => process.processId == item.obj_id)[0].callProcessArgument = callProcessArgument;
                                        containingProcesses.filter(process => process.processId == item.obj_id)[0].copyTaskArgument = copyTaskArgument;
                                        containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallUrlArgument = apiCallUrlArgument;
                                        containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallArgument = apiCallArgument;
                                        containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallHeaderArgument = apiCallHeaderArgument;
                                    } else {
                                        containingProcesses.push(
                                            {
                                                processId: item.obj_id,
                                                processName: item.title,

                                                inProcessParam: false,
                                                callProcessArgument: callProcessArgument,
                                                copyTaskArgument: copyTaskArgument,
                                                apiCallUrlArgument: apiCallUrlArgument,
                                                apiCallArgument: apiCallArgument,
                                                apiCallHeaderArgument: apiCallHeaderArgument
                                            });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        




        return JSON.stringify(containingProcesses);
    }

    callback(null, process(JSON.parse(content), keyWord));
}