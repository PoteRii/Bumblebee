module.exports = function (callback, content, keyWord, searchInProcessParams) {

    var process = function (content, keyWord, searchInProcessParams) {
        var data = content;
        var containingProcesses = [];

        if (searchInProcessParams) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                if (item.conv_type == "process") {
                    if (item.params) {
                        if (item.params.filter(param => param.name.toLowerCase().includes(keyWord.toLowerCase())).length > 0) {
                            containingProcesses.push(
                                {
                                    processId: item.obj_id,
                                    processName: item.title
                                });
                        }
                    }
                }
            }
        }


      
        

        return JSON.stringify(containingProcesses);
    }

    callback(null, process(JSON.parse(content), keyWord, searchInProcessParams));
}