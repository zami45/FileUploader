/**
 * Created by zami on 5/3/2017.
 */

var customFileUpload = (function(){

    var main_obj,reader,containers,container_arr=[],prev_length;
    
    reader = new FileReader();

    function initialize(param_obj){

        main_obj = param_obj;

        if(param_obj.hasOwnProperty('dropzone_id')){

            var dropZone = document.getElementById(param_obj.dropzone_id);

            var file_input = document.getElementById(param_obj.file_input);

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

        //var files = event.dataTransfer.files;

        file_input.files = event.dataTransfer.files;
        
        console.log(file_input.files);

    }

    function changeEvent(event,file_input){
        
        var indexContainer,index=0;
        
        event.stopPropagation();

        event.preventDefault();

        var files = event.target.files;
        
        prev_length = container_arr.length;
        
        for(i=0;i<files.length;i++){
            
                var container = document.createElement('div');

                container.className = 'container';

                container.setAttribute('style','width:100px;height:100px;background:white;');
            
                document.getElementById(main_obj.drop_container).appendChild(container);
            
                container_arr.push(container);
            
        }
        
        

        //containers = document.getElementsByClassName('container');
        
        if(container_arr.length == 0){
            
            indexContainer = 0;
            
        }else{
            
            indexContainer= prev_length;
            
        }

        readMultipleFile(event,files,index,indexContainer);

    }
    
    function readMultipleFile(event,file,index,indexContainer){
        
        event.stopPropagation();

        event.preventDefault();
        
        if( index >= file.length ) return;
        
        handleFileSelect(event,file,file[index],index,indexContainer);
        
        
    }
    

    function handleFileSelect(event,files,file,index,indexContainer){

        event.stopPropagation();

        event.preventDefault();   

        
                var progress_bar = document.createElement('div');

                progress_bar.setAttribute('class','progress_bar');

                var percent = document.createElement('div');



                progress_bar.appendChild(percent);

                container_arr[indexContainer].appendChild(progress_bar);

                reader.onloadstart = function (){

                    progress_bar.className = 'loading';

                    percent.setAttribute('class','percent');

                    //document.getElementById(main_obj.drop_container).appendChild(container);


                }

                reader.onprogress = function (event){

                        if (event.lengthComputable) {

                            var percentLoaded = Math.round((event.loaded / event.total) * 100);

                            if (percentLoaded < 100) {

                                percent.style.width = percentLoaded + '%';

                            }

                        }
                    }


                reader.onload= function (event){

                        percent.style.width = '100%';

                        percent.innerHTML = '&#10004;';

                        var img = new Image();

                        img.src = event.target.result;

                        img.width = 98;

                        img.height = 98;

                        img.setAttribute('style','position:absolute;left:0px;');

                        container_arr[indexContainer].appendChild(img);
                
                        reader.readyState = 0;
                    
                        readMultipleFile(event,files,index+1,indexContainer+1);

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