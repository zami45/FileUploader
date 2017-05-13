var customFileUpload = (function(){

    var main_obj,reader,containers,file_input,form_data,error_log=[];

    reader = new FileReader();
    
    form_data = new FormData();

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
        //
        // //element.addEventListener('dragleave', handleDragLeave, false);
        //
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
         
         var index=0;
    
         var files = event.dataTransfer.files;
         
         readMultipleFile(files,index);
    
     }

    function changeEvent(event,file_input){

        event.stopPropagation();

        event.preventDefault();

        var index=0;

        //document.getElementById(main_obj.drop_container).innerHTML = '';

        var files = event.target.files;

        readMultipleFile(files,index);
 
    }
    
    function showFormData(){
        
        console.log(form_data.getAll('files[]'));
        
        console.log(error_log);
        
    }

    function readMultipleFile(files,index){

        if( index >= files.length )
        {
            showFormData();
            return;
        }

        validate(files,files[index],index);
        
        

    }

    function validate(files,file,index){

        validate_reader.onloadend = function(event){

            var uInt=(new Uint8Array(event.target.result)).subarray(0,4);

            var signeture = "";

            for(var i = 0; i < uInt.length; i++) {

                signeture += uInt[i].toString(16);

            }

            switch (signeture) {

                case "89504e47": 
                    
                    form_data.append('files[]',file);
                    handleFileSelect(files,file,index,'image'); //png
                    break;

                case "47494638":

                    form_data.append('files[]',file);
                    handleFileSelect(files,file,index,'image'); //gif
                    break;

                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffdb":

                    form_data.append('files[]',file);
                    handleFileSelect(files,file,index,'image'); //jpeg
                    break;

                case "25504446":

                    form_data.append('files[]',file);
                    handleFileSelect(files,file,index,'pdf') //pdf
                    break;

                default:

                    var msg = file.name+'is not an acceptable file format';
                    error_log.push(msg);
                    readMultipleFile(files,index+1);
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
        
        var container = document.createElement('div');

        container.className = 'container';

        container.setAttribute('style','width:100px;height:100px;');

        document.getElementById(main_obj.drop_container).appendChild(container);

        container.appendChild(progress_bar);

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
            }

            img.setAttribute('style','position:absolute;left:0px;');

            container.appendChild(img);

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
