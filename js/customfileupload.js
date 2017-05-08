var customFileUpload = (function(){

    var main_obj,reader,containers,container_arr=[],file_input;

    reader = new FileReader();

    validate_reader = new FileReader();

    function initialize(param_obj){

        main_obj = param_obj;

        if(param_obj.hasOwnProperty('dropzone_id')){

            var dropZone = document.getElementById(param_obj.dropzone_id);

            file_input = document.getElementById(param_obj.file_input);

            dispatchEvents(dropZone,file_input);

        }

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

        file_input.files = event.dataTransfer.files;

    }

    function changeEvent(event,file_input){

        event.stopPropagation();

        event.preventDefault();

        var index=0;

        document.getElementById(main_obj.drop_container).innerHTML = '';

        container_arr = [];



        var files = event.target.files;

        for(i=0;i<files.length;i++){

            var container = document.createElement('div');

            container.className = 'container';

            container.setAttribute('style','width:100px;height:100px;');

            document.getElementById(main_obj.drop_container).appendChild(container);

            container_arr.push(container);


        }


        readMultipleFile(files,index);

    }

    function readMultipleFile(files,index){

        //event.stopPropagation();

        //event.preventDefault();

        if( index >= files.length ) return;

        //handleFileSelect(event,file,file[index],index);
        validate(event,files,files[index],index);


    }

    function validate(event,files,file,index){

        event.stopPropagation();

        event.preventDefault();

        validate_reader.onloadend = function(event){

            var uInt=(new Uint8Array(event.target.result)).subarray(0,4);

            var signeture = "";

            for(var i = 0; i < uInt.length; i++) {

                signeture += uInt[i].toString(16);

            }

            switch (signeture) {

                case "89504e47":

                    console.log('png');
                    handleFileSelect(files,file,index,'image'); //png
                    break;

                case "47494638":

                    console.log('gif');
                    handleFileSelect(files,file,index,'image'); //gif
                    break;

                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffdb":

                    console.log('jpeg');
                    handleFileSelect(files,file,index,'image'); //jpeg
                    break;

                case "25504446":


                    handleFileSelect(files,file,index,'pdf') //pdf
                    break;

                default:

                    file_input.value = "";
                    document.getElementById(main_obj.drop_container).innerHTML="<span style='color:red;'>* some files couldn't pass validation !";
                    break;

            }



        }

        validate_reader.readAsArrayBuffer(file);


    }

    function handleFileSelect(files,file,index,type){


        var progress_bar = document.createElement('div');

        progress_bar.setAttribute('class','progress_bar');

        var percent = document.createElement('div');

        progress_bar.appendChild(percent);

        container_arr[index].appendChild(progress_bar);

        reader.onloadstart = function (){

            progress_bar.className = 'loading';

            percent.setAttribute('class','percent');

        }

        reader.onprogress = function (event){

            if (event.lengthComputable) {

                var percentLoaded = Math.round((event.loaded / event.total) * 100);

                if (percentLoaded < 100) {

                    percent.style.width = percentLoaded + '%';

                }

            }
        }


        reader.onloadend= function (event){

            percent.style.width = '100%';

            percent.innerHTML = '&#10004;';



            var img = new Image();

            img.width = 98;

            img.height = 98;

            if(type == 'image'){

                img.src = event.target.result;

            }else if(type == 'pdf'){

                img.src = 'icon/pdf.png';
                img.src = 'icon/pdf.png';
            }




            img.setAttribute('style','position:absolute;left:0px;');

            container_arr[index].appendChild(img);

            reader.readyState = 0;

            readMultipleFile(files,index+1);



        }




        reader.readAsDataURL(file);


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
