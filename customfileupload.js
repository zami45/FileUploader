/**
 * Created by zami on 5/3/2017.
 */

var customFileUpload = (function(){

    var main_obj;

    function initialize(param_obj){

        main_obj = param_obj;

        if(param_obj.hasOwnProperty('dropzone_id')){

            var dropZone = document.getElementById(param_obj.dropzone_id);

            var file_input = document.getElementById(param_obj.file_input);

            dispatchEvents(dropZone,file_input);

        }

    }

    function containsFiles(event) {
        if (event.dataTransfer.types) {
            for (var i=0; i<event.dataTransfer.types.length; i++) {
                if (event.dataTransfer.types[i] == "Files") {
                    return true;
                }
            }
        }

        return false;
    }

    function dispatchEvents(dropZone,file_input){


        dropZone.addEventListener('dragover', handleDragOver, false);

        //element.addEventListener('dragleave', handleDragLeave, false);

        dropZone.addEventListener('drop', function (event) {

            dragEvent(event,file_input);

        }, false);

        file_input.addEventListener('change',function(event) {

            changeEvent(event,file_input);

        },false);

    }
    function dragEvent(event,file_input) {

        event.stopPropagation();

        event.preventDefault();

        var files = event.dataTransfer.files;

        file_input.files = event.dataTransfer.files;

    }

    function changeEvent(event,file_input){
        event.stopPropagation();

        event.preventDefault();

        var files = event.target.files;


        handleFileSelect(event,files);

    }

    function handleFileSelect(event,files){

        event.stopPropagation();

        event.preventDefault();

       // var files = event.dataTransfer.files || event.target.files;

        for(var i=0,file;file=files[i];i++){

            if(i>=files.length){

                break;

            }

            (function(file){

                var reader = new FileReader();

                var container = document.createElement('div');

                container.className = 'container';

                container.setAttribute('style','width:100px;height:100px;');

                var progress_bar = document.createElement('div');

                progress_bar.setAttribute('class','progress_bar');

                var percent = document.createElement('div');



                progress_bar.appendChild(percent);

                container.appendChild(progress_bar);

                reader.onloadstart = function (){

                    progress_bar.className = 'loading';

                    percent.setAttribute('class','percent');

                    document.getElementById(main_obj.drop_container).appendChild(container);


                }

                reader.onprogress = (function(myfile,percent){

                    return function (event){

                        if (event.lengthComputable) {

                            var percentLoaded = Math.round((event.loaded / event.total) * 100);

                            if (percentLoaded < 100) {

                                percent.style.width = percentLoaded + '%';

                            }

                        }
                    }

                })(file,percent);

                reader.onloadend = (function(myfile,percent,container){

                    return  function (event){

                        percent.style.width = '100%';

                        percent.innerHTML = '&#10004;';

                        var img = new Image();

                        img.src = event.target.result;

                        img.width = 98;

                        img.height = 98;

                        img.setAttribute('style','position:absolute;left:0px;');

                        container.style.background = 'white';

                        container.appendChild(img);

                    }

                    })(file,percent,container);


            reader.readAsDataURL(file);

            })(file);

        }

    }

    function handleDragOver(event)
    {
        event.stopPropagation();

        event.preventDefault();

        event.dataTransfer.dropEffect = 'copy';

    }

return {

    initialize : initialize
}
})();