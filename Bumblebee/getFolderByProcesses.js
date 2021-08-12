module.exports = function (callback, content, processIds) {

    var process = function (content, processIds) {
        var data = content;
        var keys = Object.keys(processIds);

        var containingProcesses = [];

        for (var i = 0; i < keys.length; i++) {
            var processRoute = keys[i];
            var processId = processIds[processRoute];

            var processItems = data.filter(item => item.obj_id == processId);
            if (processItems.length > 0) {
                var path = processItems[0].title;
                var processParentId = processItems[0].parent_id;

                while (processParentId > 0) {
                    var container = containingProcess(data, processParentId);
                    if (container != null) {
                        path = container.title + "/" + path;

                        processParentId = container.obj_id;
                    } else {
                        processParentId = 0;
                    }
                }

                if (path) {
                    containingProcesses.push({
                        "ProcessId": processId,
                        "ProcessRoute": processRoute,
                        "FolderPath": "/" + path
                    });
                }
            }
        }

        return JSON.stringify(containingProcesses);
    }

    var containingProcess = function (content, itemId) {
        var data = content;

        var parentItems = data.filter(item => item.obj_id == itemId);
        if (parentItems.length > 0) {
            return {
                title: parentItems[0].title,
                obj_id: parentItems[0].parent_id
            }
            
        }

        return null;
    }

    callback(null, process(JSON.parse(content), JSON.parse(processIds)));
}