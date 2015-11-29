
/**
        
     * @constructor
       @author <a href="tony.payet.professionnel@gmail.com">Payet Tony</a>

      * rajouter un div avec un attribut datatableSaiyan et l'url contenant le json config 
        @description 
      * version du 24 07 13
      * 
      @example  <div  datatableSaiyan="{% url 'srv:config' %}">
        Pour creer un datatable il faudra lui renvoyer cette config json et lui indiquant :
            * idsaiyan
            * urldata
            * urlrest
                {

                        "idsaiyan": "example2",            

                        "urldata": "/reselling/jsonlist2/",
                        "urlrest": "/api/juridt",

                        "dom": "Tfrtip",
                        "col": "12",

                        "fields": [
                            {
                            "label": "indicatif:",
                            "name":  "indicatif",
                            },
                            {
                            "label": "zone:",
                            "name":  "zone",
                            "type":  "radio",

                            },
                            {
                            "label": "Name:",
                            "name":  "name",
                           },
                            {
                            "label": "Code:",
                            "name":  "code",
                           },
                            {
                            "label": "Juripurchase:",
                            "name":  "juripurchase",
                            "type":"manyTomany",
                           }
                        ]
	       }

*/

function datatableSaiyan(config){
    var editor; 
    jsonParse=JSON.parse(config);

    id=jsonParse.idsaiyan ; 
    urldata=jsonParse.urldata ;
    urlrest=jsonParse.urlrest;
    dom=jsonParse.dom
    title=jsonParse.title
    col=jsonParse.col

    gestionError();
    generethDatable(jsonParse,id)
    json=exchangeJsonDatatable(jsonParse.fields);
    crsf();                           
    editor=editorSaiyan( json.fields ,urlrest );  
    table=datatableSaiyan();


    $.fn.dataTable.Editor.fieldTypes.title = $.extend( true, {}, $.fn.dataTable.Editor.models.fieldType, {
        create: function ( field )      { return $('<div/>')[0]; },
        get:    function ( field )      { return ''; },
        set:    function ( field, val ) {}
    } );


    // creation d'un type list field saiyan
    $.fn.dataTable.Editor.fieldTypes.saiyan = $.extend( true, {},$.fn.dataTable.Editor.models.fieldType, {
        "create": function ( conf ) {

            conf._input = $('<input >').attr( $.extend( {
                id:   $.fn.dataTable.Editor.safeId( conf.id ),
                type:"text"
            }, conf.attr || {} ) );
            console.log(conf._input[0])

            return conf._input[0];
        },
        "get": function ( conf ) {
            return conf._input.val();
        },

        "set": function ( conf, val ) {
            conf._input.val( val ).trigger( 'change' );
        },

        "enable": function ( conf ) {
            conf._input.prop( 'disabled', false );
        },

        "disable": function ( conf ) {
            conf._input.prop( 'disabled', true );
        }
    } );


    // todo gérer type select radio etc 
    table.on( 'xhr', function () {    

        editorS={fields:[]}

        var json = table.ajax.json();  
        console.log(json)
        cpt=0;
        obj2=json.data[0];
        fieldsContext=jsonParse.fields ;
        options=""


        try {

            $.each(fieldsContext, function (keyfieldsContext, datafieldsContext) {


                if(!datafieldsContext.type){
                    editor.add({
                        label:datafieldsContext.label,
                        name:datafieldsContext.name,

                    })


                }
                if(datafieldsContext.type=="select"||datafieldsContext.type=="radio"||datafieldsContext.type=="checkbox"){
                    editor.add({
                        label:datafieldsContext.label,
                        name:datafieldsContext.name,
                        type:datafieldsContext.type
                    })

                }

                if(datafieldsContext.type=="manyTomany"){
                    console.log(datafieldsContext)
                    $.each(json.options, function (key, data) {

                        if(datafieldsContext.name==key){
                            editor.add({
                                label:key+" ",
                                name: key+" ",
                                type:"title",


                            })

                            $.each(data, function (key2, data2) {

                                console.log(key+"."+data2.name)

                                editor.add({
                                    label:data2.label,
                                    name: key+"s."+data2.name, // rajout d'un s pour ne pas avoir un conflit avec nom object.0 
                                    type:"saiyan",


                                })


                            })

                            miseajour(key)
                        }

                    })

                }


            } ); 



        } catch (e) {
        }



    } );



    function gestionError(){



        if(!jsonParse.dom){
            dom="";

        }else{
            dom=dom;
        }

        if(!jsonParse.title){
            title="";

        }

        if(!jsonParse.idsaiyan){
            modalError("veuillez saisir id  pour la page "+id )

        }
        if(!jsonParse.fields){
            modalError("veuillez saisir field  pour la page "+id)

        }
        console.log()
        if(!jsonParse.fields[0]){
            modalError("veuillez saisir un champs name dans fields pour l'id "+id)

        }


        $.each(jsonParse.fields, function (key, data) {
            if(!jsonParse.fields[key].name){
                modalError("veuillez saisir un champs name dans fields "+data.label+" pour l'id "+id)

            }
            if(!jsonParse.fields[key].label){
                modalError("veuillez saisir un champs  label dans fields "+data.name+" pour l'id "+id)

            }
        } ); 

        if(!jsonParse.urlrest){
            modalError("veuillez saisir une adresse url rest pour la page "+id)

        }

        if(!jsonParse.urldata){

            modalError('veuillez saisir une adresse data rest pour la page '+id+'<p>  ex: "urldata":"/srv/juridiction/" ')

        }


    }


    /**
     * la Mise a jour concerne juste le nouveau type generer soit le type optionsL , on va comparer l'id du json recuperer dans le data et l'id du json dans config pour recuperer la valeurs correspondants et faire l'update si pour un id pas trouver l'id ne sera pas mit a jour 
     * @constructor
     */

    function miseajour(keyrecup){

        $("#table"+id+' tbody').on( 'click', 'tr', function () {  

            json= table.ajax.json(this) ; // recupere les options

            obj2=table.row( this ).data()// recupere les options une ligne de la colone 

            editor.on( 'initEdit', function ( e ) {
                $.each(json.options, function (key2, data2) {
                    if(key2==keyrecup){

                        $.each(data2, function (key, data) {

                            $.each(obj2, function (keyobj2, dataobj2) {

                                if(keyobj2==key2){
                                    console.log(keyobj2)

                                    $.each(dataobj2, function (keyarrayobj2, arrayobj2) {
                                        if(arrayobj2.id==data.name){
                                            editor.field(key2+"s."+data.name ).val( arrayobj2.value );  

                                        }


                                    } ); 


                                }

                            } ); 

                        } );

                    }         

                } );

            })


        });


    }
    /**
     * 
        Generer le code html qui va contenir l'id de la table  et le code html pour genere une table en html et les class boostrap pour le responsive design 
        param json contenant l'id et les fields necessaire pour l'affichage de la partie th 
        @constructor
     */
    function generethDatable(json,id){

        var concat=""; // concatenation 
        console.log(json.fields[0])
        $('#'+id).append("<table id='table"+id+"' class='table table-striped table-bordered  display responsive' cellspacing='0' width='100%'></table>");

        $.each(json.fields, function (key, data) {

            concat=concat+' <th>' +data.label+'</th>';
            //  console.log(concat)

        })

        settings="<thead><"+concat+"</thead>"

        //    rajoute la table generer pour l'id en cours 

        $('#table'+id).append(settings);

    }

    /**
     *
        cette fonction va transformer un format json pour fields et columns dans le bon format attendu par datatable 
     * @constructor
     */


    function exchangeJsonDatatable(json){

        var type="" ;
        var tab=[];
        var name;
        var cpt=0;
        var editor={"fields": [{


            "label": "",
            "name": "",
            "type": "",
            "options": {"options": []}, }],"tab": []};



        $.each(json, function (key, data) {

            console.log(data.name)
            renderColtp=function ( data2, type, row ) {

                tab=""
                try {
                    //  console.log(data2);
                    if(data2[0].id){

                        tab=data2
                        concat=" "
                        for (var i = 0; i < tab.length; i++) {

                            concat=concat+" "+tab[i].id+"  "+tab[i].label+"  "+tab[i].value+" <p>" ;

                        }
                        tab=concat;
                    }else{
                        tab=data2;
                    }


                } catch (e) {
                    //console.error("Parsing error:", e); 
                }

                return  tab;
            }

            editor.tab[cpt]={data:data.name, render:renderColtp }


            type="";
            cpt++
        })

        return editor ;
    }

    /**
     * initialise editor recupere url et json field generer par exchangeJsonDatatable et le submit des données en REST et l'id en cours 
     * @constructor
     */


    function editorSaiyan(jsonSaiyan){
        editor = new $.fn.dataTable.Editor( {
            data:"",
            ajax: {
                create: {
                    type: 'POST',
                    url:   urlrest+"/"+"_id_"
                },
                edit: {
                    type: 'PUT',
                    url:    urlrest+"/"+"_id_"
                },
                remove: {
                    type: 'DELETE',
                    url:   urlrest+"/"+"_id_"
                }
            },
            table: '#table'+id,
            //fields:""  // recuper fields generer par la fonction exchangedatatable
        } );
        return editor;    }
    /**
     * Fonction qui va apeller la function datatable qui comprend .
     * @constructor
     */
    function datatableSaiyan(){

        var table=$('#table'+id).DataTable( {

            processing: true,
            serverSide: true,
            dom: dom,
            ajax:  {    
                "url": urldata,    
                "dataSrc": function ( json ) {   

                    return json.data;    } 
            },
            columns:json.tab,
            tableTools: {
                sRowSelect: "os",
                aButtons: [
                    { sExtends: "editor_create", editor: editor,},
                    { sExtends: "editor_edit", editor: editor },
                    { sExtends: "editor_remove", editor: editor }
                ]
            }
        } );
        return table ;


    }


    /**
     * Represente la gestion des erreurs si par example  l'utilisateur rendre une mauvaise donnée .
     * @constructor
     */
    function modalError(err){

        var settings =  '<a id="settings" href="#changeSkin" data-toggle="modal" >' +
            '<i class="fa fa-gear"></i> Change Skin' +
            '</a>' +   
            '<div class="modal  " id="a" >' +
            '<div class= " modal-dialog modal-lg  ">' +
            '<div class="modal-content ">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" >&times;</button>' +
            '<h4 class="modal-title ">Erreur </h4>' +
            '</div>' +
            '<div class="modal-body bg-danger  ">' +
            '<div class="row template-skins">' +

            '<div class=" text-center  "><p  class="text-center ">'+err+'</p></div>'+	

            ' </div>'+
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('body').prepend(settings);


        $('#a').modal()  
        $( "body" ).click(function() {
            $('#a').modal()  
        });

    }
    /**
     * Represents a book.
     * @constructor
     */

    /**
     * Represents a book.
     * @constructor
     */
    function crsf(){

        $.ajaxSetup({
            beforeSend: function(xhr, settings) 
            {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                //  console.log(xhr);
            }
        });

        function getCookie(name) 
        {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') 
            {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) 
                {
                    var cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) 
                    {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

    }

}





