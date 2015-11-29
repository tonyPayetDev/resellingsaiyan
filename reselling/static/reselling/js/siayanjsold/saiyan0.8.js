
/*$.each(dataSaiyan, function (key, data) {
        console.log($(dataSaiyan[key]).attr("id"))
        console.log($(dataSaiyan[key]).attr("datatableSaiyan"))

        ids=$(dataSaiyan[key]).attr("id");
        url=$(dataSaiyan[key]).attr("datatableSaiyan");



    })*/


$(document).ready(function(){

    url=$("div[datatableSaiyan]").attr("datatableSaiyan")
    nompanel=$("h3#nomPanel.panel-title").text()

    $("div[datatableSaiyan]").replaceWith( '<div  datatableSaiyan="'+url+'" id="datatable" class="content">'
                                          +'<div id="construction"><h1 class="visible-lg  text-center">Page en Construction</h1>  '
                                          +'</div>')

    jsondata=get_json(url);

    var jsonParse=jsondata[0].config;   
    $.each(jsonParse, function (key, data) {


        datatableSaiyan(data);

    })

    function get_json(url)  {

        var mylist=new Array();
        var mydata = { table: 'ajaxConfig',};
        $.ajax(
            {
                url: url,
                data: mydata,
                async: false,
                dataType: 'json',
                success: function (json) 
                {
                    json=json
                    mylist.push(json);

                }
            });

        return mylist;
    }

})



/**

     * @constructor
       @author <a href="tony.payet.professionnel@gmail.com">Payet Tony</a>

      * rajouter un div avec un attribut datatableSaiyan et l'url contenant le json config 
        @description 
      * 
      * 
      @example  <div  datatableSaiyan="{% url 'srv:config' %}">
        Pour creer un datatable ou plusieurs datatable il faudra lui renvoyer une config json et lui indiquer sur quel page on veut que la datatable soit visible 

                 {
                      "config": {
                        "saiyan": {
                          "idsaiyan": "example2",
                          "urlpage": "/reselling/ventes/",
                          "urldata": "/srv/juridiction/",
                          "urlrest": "/srv/juridiction/",
                          "dom": "Tfrtip",
                          "col": "12",
                          "field": {
                            "indicatif": "",
                            "code": "",
                            "name": "",
                            "zone": "",
                            "juripurchase": {
                              "optionsL": [
                                {
                                  "id": "4",
                                  "label": "sfr"
                                },
                                {
                                  "id": "5",
                                  "label": "cptl"
                                },
                                {
                                  "id": "6",
                                  "label": "colt"
                                },
                                {
                                  "id": "8",
                                  "label": "TRANSATEL"
                                },
                                {
                                  "id": "9",
                                  "label": "[B3G]"
                                },
                                {
                                  "id": "7",
                                  "label": "KEYYO"
                                }
                              ]
                            },
                            "access[].id": {
                              "optionsC": [
                                {
                                  "id": "1",
                                  "label": "Printer"
                                },
                                {
                                  "id": "3",
                                  "label": "cptl"
                                },
                                {
                                  "id": "4",
                                  "label": "VMs"
                                }
                              ]
                            }
                          }
                        },
                        "saiyan2": {
                          "dom": "Tfrtip",
                          "idsaiyan": "example",
                          "urlpage": "/reselling/dashboard/",
                          "url": "/srv/juridiction/",
                          "url2": "/srv/juridiction/",
                          "col": "6",
                          "field": {
                            "indicatif": "",
                            "zone": "",
                            "name": "",
                            "bizzone": ""
                          }
                        }
                      }
                    }   


     */

function datatableSaiyan(config){
    var editor; // 


    jsonParse=config

    urlpage=jsonParse.urlpage

    if(!jsonParse.urlpage){
        modalError("veuillez  saisir une adresse url page pour <p>"+JSON.stringify(config)+"</p>")

    }

    var host=document.location.host;
    var urlhost = jQuery(location).attr("href"); 
    var res = urlhost.split(host); // a changer par la suite 
    var urlhost=res[1];

    a="";
    $("body").append("<div class='page' value=''></div>")



    if(urlhost==urlpage){


        id=jsonParse.idsaiyan ; 
        url=jsonParse.urldata ;
        urlrest=jsonParse.urlrest;
        dom=jsonParse.dom
        title=jsonParse.title
        col=jsonParse.col

        gestionError();

        $('#datatable').append(  '<div class=" col-lg-'+col+'" id='+id+'> <div class="text-center"><h1>'+title+'</h1></div>')
        $('#construction').hide()

        generethDatable(jsonParse,id)
        json=exchangeJsonDatatable(jsonParse.field);
        crsf();                           
        optList(); 
        editorSaiyan( json.fields ,urlrest );                    
        datatableSaiyan();
        miseAjourlisteField(jsonParse.field);
    }



    function gestionError(){



        if(!jsonParse.dom){
            dom="";

        }

        if(!jsonParse.title){
            title="";

        }

        if(!jsonParse.idsaiyan){
            modalError("veuillez saisir id  pour la page "+urlpage)

        }
        if(!jsonParse.field){
            modalError("veuillez saisir field  pour la page "+urlpage)

        }

        if(!jsonParse.urlrest){
            modalError("veuillez saisir une adresse url rest pour la page "+urlpage)

        }

        if(!jsonParse.urldata){

            modalError('veuillez saisir une adresse data rest pour la page '+urlpage+'<p>  ex: "urldata":"/srv/juridiction/" ')

        }


    }

    /**
     * 
        Generer le code html qui va contenir l'id de la table  et le code html pour genere une table en html et les class boostrap pour le responsive design 
        param json contenant l'id et les fields necessaire pour l'affichage de la partie th 
        @constructor
     */

    function generethDatable(json,id){

        var concat=""; // concatenation 

        $('#'+id).append("<table id='table"+id+"' class='table table-striped table-bordered  display responsive' cellspacing='0' width='100%'></table>");

        $.each(json.field, function (key, data) {

            concat=concat+' <th>' +key+'</th>';
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



        var concat;




        $.each(json, function (key, data) {


            renderColtp=function ( data2, type, row ) {


                tab=""
                try {
                    // console.log(data2);
                    if(data2[0].id){

                        tab=data2
                        concat=" "
                        for (var i = 0; i < tab.length; i++) {

                            concat=concat+tab[i].label+","+tab[i].id+tab[i].value+" <p>" ;

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

            editor.tab[cpt]={data:key, render:renderColtp }

            tabOptions=[  { "id":"optionsL" ,"type": "list"}, { "id":"optionsS" ,"type": "select"}, { "id":"optionsR" ,"type": "radio"}, { "id":"optionsC" ,"type": "checkbox"}];

            $.each(data, function (index, data) {

                for (var i = 0; i < tabOptions.length; i++) {

                    //              console.log(tabOptions[i])

                    if(index==tabOptions[i].id){

                        type=tabOptions[i].type;
                        options=data;
                    }


                }


            })




            if(key!="" ){
                // editor.fields[0].label=key
                editor.fields[cpt]={

                    name: key,
                    label: key,
                }

                if(type){

                    editor.fields[cpt]={


                        "label": key,
                        "name": key,
                        "type": type,
                        "options": options,
                    }
                    // editor.tab[cpt]={data:key}  ;   // attention pour type options


                }

            }


            type="";
            cpt++
            //   editor.tab;
        })

        return editor ;
    }

    /**
     * Contient opt list permettant de creer une liste de champs dans le cas d'une relations a plusieurs 
     * @constructor
     */
    function optList(){


        $.fn.dataTable.Editor.fieldTypes.list = $.extend( true, {},$.fn.dataTable.Editor.models.fieldType, {
            // Locally "private" function that can be reused for the create and update methods
            "_addOptions": function ( conf, opts ) {
                var val, label;
                var elOpts = conf._input[0].options;
                var jqInput = conf._input.empty();

                if ( opts ) {
                    $.fn.dataTable.Editor.pairs( opts, conf.optionsPair, function ( val, label, i ) {
                        jqInput.append(
                            '<div>'+
                            '<label for="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'">'+label+'</label>'+
                            '   <input id="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'" type="text"  value='+val+' name="'+label+'"/>'+

                            '</div>'
                        );
                    } );
                }
            },


            "create": function ( conf ) {
                conf._input = $('<div />');
                $.fn.dataTable.Editor.fieldTypes.list._addOptions( conf, conf.options || conf.ipOpts );

                return conf._input[0];
            },

            "get": function ( conf ) {
                var out=[] ;


                conf._input.find('input:text').each( function () {

                    if( this.value!=' '){
                        out.push( this.value +"->"+this.name+"<p>");

                    }
                } );
                return conf.separator ? out.join(conf.separator) : out;
            },

            "set": function ( conf, val ) {
                var jqInputs = conf._input.find('input');
                if ( ! $.isArray(val) && typeof val === 'string' ) {
                    val = val.split( conf.separator || '|' );
                }
                else if ( ! $.isArray(val) ) {
                    val = [ val ];
                }

                var i, len=val.length, found;

                jqInputs.each( function () {
                    found = false;

                    for ( i=0 ; i<len ; i++ ) {
                        if ( this.value == val[i] ) {
                            found = true;
                            break;
                        }
                    }
                    this.checked = found;
                } ).change();
            },

            "enable": function ( conf ) {
                conf._input.find('input').prop('disabled', false);
            },

            "disable": function ( conf ) {
                conf._input.find('input').prop('disabled', true);
            },

            "update": function ( conf, options ) {
                // Get the current value
                var list = $.fn.dataTable.Editor.fieldTypes.list;
                var currVal = list.get( conf );

                list._addOptions( conf, options );
                list.set( conf, currVal );
            }
        } );

    }

    /**
     * initialise editor recupere url et json field generer par exchangeJsonDatatable et le submit des données en REST et l'id en cours 
     * @constructor
     */


    function editorSaiyan(jsonSaiyan){

        editor = new $.fn.dataTable.Editor( {
            ajax: {
                create: {
                    type: 'POST',
                    url:  urlrest
                },
                edit: {
                    type: 'PUT',
                    url:   urlrest+"_id_"
                },
                remove: {
                    type: 'DELETE',
                    url:  urlrest+"_id_"
                }
            },
            table: '#table'+id,
            fields: jsonSaiyan  // recuper fields generer par la fonction exchangedatatable
        } );

    }

    /**
     * Fonction qui va apeller la function datatable qui comprend .
     * @constructor
     */


    function datatableSaiyan(){


        var table=$('#table'+id).DataTable( {
            "processing": true,
            "serverSide": true,
            "idSrc":id,
            dom: dom,
            ajax:{
                "url":url,
                "dataSrc": function ( json ) {
                    // console.log(json)

                    $('body').on('click', 'a', function(e){

                        a=$(".paginate_button.active").text()
                        $("div.page").html(a)

                    });
                    
                    console.log($("div.page").text())
                    url+"?page="+$("div.page").text();
                    test={"data":json.results}

                    return test.data ;  
                }
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


    }


    /**
     * la Mise a jour concerne juste le nouveau type generer soit le type optionsL , on va comparer l'id du json recuperer dans le data et l'id du json dans config pour recuperer la valeurs correspondants et faire l'update si pour un id pas trouver l'id ne sera pas mit a jour 
     * @constructor
     */

    function miseAjourlisteField(jsonParse){

        /**
        * 
            Dans le cas ou on cliquerai sur le bouton new les champs pour l'optionsL sera mis a vide dans ce cas 
        */


        editor.on( 'initCreate', function ( e ) {
            $.each(jsonParse, function (key, data) {


                if(data.optionsL){



                    initValue(data,"' '")
                    editor.field(key).update( data.optionsL);


                }


            } );

        });

        /**
        *   si on clique sur un ligne du tableau on recupere son id et  pour cette id on va recuperer ces champs 
        *   @constructor
        */

        $('#'+id+' tbody ').on('click', 'tr', function () {

            idClick = this.id;

            //  alert(idClick)
            allfields=get_fieldjson(idClick) ; 

            $.each(jsonParse, function (key, data) {

                editor.on( 'initEdit', function ( e ) {


                    if(data.optionsL){


                        initValue(data,"' '");
                        miseAjourvaluelist(data,key);


                    }



                })


            } );


        } );


    }


    function miseAjourvaluelist(data,key){

        // initValue(data)


        for(var a=0;a<data.optionsL.length;a++ ){

            $.each(allfields, function (key2, data2) {
                // si le nom du champs et egal au champs dans la config 
                if(key2==key){

                    for(var b=0;b<data2.length;b++ ){


                        if(data.optionsL[a].id==data2[b].id){

                            data.optionsL[a].value=data2[b].value;
                            data.optionsL[a].label=data2[b].label;

                            editor.field(key).update( data.optionsL);



                        }

                    }



                }

            })


        }

    }

    function initValue(data,text){
        for( a=0 ; a<data.optionsL.length ; a++ ){
            data.optionsL[a].value=text+""; 
            // console.log(data.optionsL[a])
        }


    }

    /**
     * renvoie les valeurs d'une liste de champs pour un champs selectionner 
        example si le champs selectionner a pour id 1  on va faire un apel ajax on va chercher les fields correspondants a ce champs  et returner ces valeurs
     * @constructor
     */

    function get_fieldjson(idclick) {

        var mylist=new Array();
        var mydata = { table: 'hosting.a', field: 'code'};
        $.ajax(
            {
                url: url,
                data: mydata,
                async: false,
                dataType: 'json',
                success: function (json) 
                {

                    json=json.data   

                    for(var a=0;a<json.length;a++)
                    {

                        idJson=json[a]['id']

                        if(idclick==idJson)
                        {
                            //  console.log(json)
                            tab=json[a]
                            //   console.log(tab)

                            mylist.push(tab);

                        }


                    }


                }
            });

        JSON.stringify(mylist);
        return tab;
    }
    /**
     *  
     * @constructor
     */

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





