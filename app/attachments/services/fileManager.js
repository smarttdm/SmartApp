'use strict';

angular.module('app.attachments').factory('fileManager', function ($q, fileManagerClient, $http, loadingInfo) {

    var service = {
        files: [],
        load: load,
        upload: upload,
        remove: remove,
        download: download,
        performDownload: performDownload,
        fileExists: fileExists,
        status: {
            uploading: false
        },
        params: {
            serviceBase: "",
            schema: "",
            cls: "",
            oid: "",
            api: "",
            path: ""
        }
    };

    return service;

    function load() {

        loadingInfo.setInfo({ busy: true, message: "loading files" })

        service.files.length = 0;

        if (!service.params.oid)
            return [];
        else
            return fileManagerClient.query({api: service.params.api, schema: service.params.schema, cls: service.params.cls, oid: service.params.oid, path: service.params.path })
                                .$promise
                                .then(function (result) {
                                    result.files
                                            .forEach(function (file) {
                                                service.files.push(file);
                                            });

                                    loadingInfo.setInfo({ message: "files loaded successfully" });

                                    return result.$promise;
                                },
                                function (result) {
                                    if (result.data) {
                                        loadingInfo.setInfo({ message: "something went wrong: " + result.data.message });
                                    }
                                    else
                                    {
                                        loadingInfo.setInfo({ message: "something went wrong: "});
                                    }
                                    return $q.reject(result);
                                })
                                ['finally'](
                                function () {
                                    loadingInfo.setInfo({ busy: false });
                                });
    }

    function upload(files) {
        
        service.status.uploading = true;
        loadingInfo.setInfo({ busy: true, message: "uploading files" });

        var formData = new FormData();

        angular.forEach(files, function (file) {
            console.debug("upload file name =" + file.name);
            formData.append(file.name, file);
        });

        return fileManagerClient.save({ api: service.params.api, schema: service.params.schema, cls: service.params.cls, oid: service.params.oid, path: service.params.path }, formData)
                                    .$promise
                                    .then(function (result) {
                                        if (result && result.files) {
                                            result.files.forEach(function (file) {
                                                if (!fileExists(file.name)) {
                                                    service.files.push(file);
                                                }
                                            });
                                        }

                                        loadingInfo.setInfo({ message: "files uploaded successfully" });

                                        return result.$promise;
                                    },
                                    function (result) {
                                        loadingInfo.setInfo({ message: "something went wrong: " + result.data.message });
                                        return $q.reject(result);
                                    })
                                    ['finally'](
                                    function () {
                                        loadingInfo.setInfo({ busy: false });
                                        service.status.uploading = false;
                                    });
    }

    function remove(file) {
        loadingInfo.setInfo({ busy: true, message: "deleting file " + file.name });
      
        return fileManagerClient.remove({ api: service.params.api, schema: service.params.schema, cls: service.params.cls, oid: service.params.oid, fileId: file.id, path: service.params.path })
                                    .$promise
                                    .then(function (result) {
                                        //if the file was deleted successfully remove it from the files array
                                        var i = service.files.indexOf(file);
                                        service.files.splice(i, 1);

                                        loadingInfo.setInfo({ message: "files deleted" });

                                        return result.$promise;
                                    },
                                    function (result) {
                                        loadingInfo.setInfo({ message: "something went wrong: " + result.data.message });
                                        return $q.reject(result);
                                    })
                                    ['finally'](
                                    function () {
                                        loadingInfo.setInfo({ busy: false });
                                    });
    }

    function download(file)
    {
        var getFileUrl = service.params.serviceBase + "/" + service.params.api + "/" + service.params.schema + "/" + service.params.cls + "/" + service.params.oid + "/" + file.id;
        if (service.params.path)
        {
            getFileUrl += "?path=" + service.params.path;
        }

        performDownload(getFileUrl, null);
    }

    function performDownload(url, callback) {
    
        // Use an arraybuffer
        $http.get(url, { responseType: 'arraybuffer' })
            .success(function (data, status, headers) {

                var octetStreamMime = 'application/octet-stream';
                var success = false;

                // Get the headers
                headers = headers();

                // Get the filename from the x-filename header or default to "download.bin"
                var filename = headers['x-filename'] || 'download.bin';

                // Determine the content type from the header or default to "application/octet-stream"
                var contentType = headers['content-type'] || octetStreamMime;

                try {
                    // Try using msSaveBlob if supported
                    console.log("Trying saveBlob method ...");
                    var blob = new Blob([data], { type: contentType });
                    if (navigator.msSaveBlob)
                        navigator.msSaveBlob(blob, filename);
                    else {
                        // Try using other saveBlob implementations, if available
                        var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                        if (saveBlob === undefined) throw "Not supported";
                        saveBlob(blob, filename);
                    }
                    console.log("saveBlob succeeded");
                    success = true;
                } catch (ex) {
                    console.log("saveBlob method failed with the following exception:");
                    console.log(ex);
                }

                if (!success) {
                    // Get the blob url creator
                    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    if (urlCreator) {
                        // Try to use a download link
                        var link = document.createElement('a');
                        if ('download' in link) {
                            // Try to simulate a click
                            try {
                                // Prepare a blob URL
                                console.log("Trying download link method with simulated click ...");
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                link.setAttribute('href', url);

                                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                link.setAttribute("download", filename);

                                // Simulate clicking the download link
                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                console.log("Download link method with simulated click succeeded");
                                success = true;

                            } catch (ex) {
                                console.log("Download link method with simulated click failed with the following exception:");
                                console.log(ex);
                            }
                        }

                        if (!success) {
                            // Fallback to window.location method
                            try {
                                // Prepare a blob URL
                                // Use application/octet-stream when using window.location to force download
                                console.log("Trying download link method with window.location ...");
                                var blob = new Blob([data], { type: octetStreamMime });
                                var url = urlCreator.createObjectURL(blob);
                                window.location = url;
                                console.log("Download link method with window.location succeeded");
                                success = true;
                            } catch (ex) {
                                console.log("Download link method with window.location failed with the following exception:");
                                console.log(ex);
                            }
                        }

                    }
                }

                if (!success) {
                    // Fallback to window.open method
                    console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                    window.open(httpPath, '_blank', '');
                }

                if (callback)
                {
                    callback();
                }
            })
        .error(function (data, status) {
            console.log("Request failed with status: " + status);

            // Optionally write the error out to scope
            //$scope.errorDetails = "Request failed with status: " + status;

            if (callback) {
                callback();
            }
        });
    }

    function fileExists(fileName) {
        var res = false
        service.files.forEach(function (file) {
            if (file.name === fileName) {
                res = true;
            }
        });

        return res;
    }
});