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
                                processParam: true
                            });
                    }
                }

                if (item.scheme.nodes) {
                    for (var j = 0; j < item.scheme.nodes.length; j++) {
                        var node = item.scheme.nodes[j];
                        if (node.condition && node.condition.logics) {
                            var callProcessArgument = false;
                            var copyTaskArgument = false;
                            var apiCallUrlArgument = false;
                            var apiCallBodyArgument = false;
                            var apiCallHeaderArgument = false;
                            var apiCode = false;
                            var condition = false;
                            var setParameter = false;
                            var replyToProcess = false;

                            for (var k = 0; k < node.condition.logics.length; k++) {
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
                                        apiCallBodyArgument = true
                                    }

                                    var headerKeys = Object.keys(logic.extra_headers);
                                    var headerValues = Object.values(logic.extra_headers);

                                    if (headerKeys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || headerValues.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        apiCallHeaderArgument = true
                                    }
                                } else if (logic.type == "api_code") {

                                    if (logic.src.toLowerCase().includes(keyWord.toLowerCase())) {
                                        apiCode = true;
                                    }
                                } else if (logic.type == "go_if_const") {
                                    for (var m = 0; m < logic.conditions.length; m++) {
                                        var goIfCondition = logic.conditions[m];
                                        if (goIfCondition) {
                                            var values = Object.values(goIfCondition);

                                            if (values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                                condition = true
                                            }
                                        }
                                    }
                                } else if (logic.type == "set_param") {
                                    var keys = Object.keys(logic.extra);
                                    var values = Object.values(logic.extra);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        setParameter = true
                                    } 
                                } else if (logic.type == "api_rpc_reply") {
                                    var keys = Object.keys(logic.res_data);
                                    var values = Object.values(logic.res_data);

                                    if (keys.filter(key => key.toLowerCase().includes(keyWord.toLowerCase())).length > 0 || values.filter(value => value.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                                        replyToProcess = true
                                    }
                                }
                            }

                            if (callProcessArgument == true ||
                                copyTaskArgument == true ||
                                apiCallUrlArgument == true ||
                                apiCallBodyArgument == true ||
                                apiCallHeaderArgument == true ||
                                apiCode == true ||
                                condition == true ||
                                setParameter == true ||
                                replyToProcess == true) {
                                var containingProcess = containingProcesses.filter(process => process.processId == item.obj_id);
                                if (containingProcess && containingProcess.length > 0) {
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].callProcessArgument = callProcessArgument;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].copyTaskArgument = copyTaskArgument;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallUrlArgument = apiCallUrlArgument;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallArgument = apiCallBodyArgument;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCallHeaderArgument = apiCallHeaderArgument;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].apiCode = apiCode;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].condition = condition;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].setParameter = setParameter;
                                    containingProcesses.filter(process => process.processId == item.obj_id)[0].replyToProcess = replyToProcess;
                                } else {
                                    containingProcesses.push(
                                        {
                                            processId: item.obj_id,
                                            processName: item.title,
                                            processParam: false,

                                            callProcessArgument: callProcessArgument,
                                            copyTaskArgument: copyTaskArgument,
                                            apiCallUrlArgument: apiCallUrlArgument,
                                            apiCallArgument: apiCallBodyArgument,
                                            apiCallHeaderArgument: apiCallHeaderArgument,
                                            apiCode: apiCode,
                                            condition: condition,
                                            setParameter: setParameter,
                                            replyToProcess: replyToProcess
                                        });
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