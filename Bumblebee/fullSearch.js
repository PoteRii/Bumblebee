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
                                var logic = node.condition.logics[k];
                                if (logic.type == "api_rpc") {
                                    var keys = Object.keys(logic.extra);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        var containingProcess = containingProcesses.filter(process => process.processId == item.obj_id);
                                        if (containingProcess && containingProcess.length > 0) {
                                            containingProcesses.filter(process => process.processId == item.obj_id)[0].inProcessArgument = true;
                                        } else {
                                            containingProcesses.push(
                                                {
                                                    processId: item.obj_id,
                                                    processName: item.title,

                                                    inProcessParam: false,
                                                    inProcessArgument: true
                                                });
                                        }
                                    } 
                                }/* else if (logic.type == "api_copy") {
                            logic.data[lowerCamelCaseParam] = "{{" + lowerCamelCaseParam + "}}";
                            logic.data_type[lowerCamelCaseParam] = "string";
                        } else if (logic.type == "api" && newParameterSendToApis == true) {
                            logic.extra_headers[upperCamelCaseParam] = "{{" + lowerCamelCaseParam + "}}";
                        }*/
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