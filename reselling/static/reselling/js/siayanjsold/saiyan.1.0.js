



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
                     }
                    }   


     */


function datatableSaiyan(config){
    var editor; // 

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
    optList(); 
    editor=editorSaiyan( json.fields ,urlrest );  

    table=datatableSaiyan();


    table.on( 'xhr', function () {    

        editorS={fields:[]}

        var json = table.ajax.json();  
        cpt=0;
        obj2=json.data[0];
        fieldsContext=jsonParse.fields ;
        options=""



        try {
            $.each(fieldsContext, function (keyfieldsContext, datafieldsContext) {

                console.log(datafieldsContext)

                if(datafieldsContext=="mTom"){


                    $.each(json.options, function (key, data) {


                        if(keyfieldsContext=key){

                            $.each(data, function (key2, data2) {
                                // console.log(data2)
                                editor.add({
                                    label:data2.name,
                                    name: key+"."+data2.name,

                                })
                                console.log( key+"."+data2.name)

                            })


                        }

                    })


                }else{

                    editor.add({
                        label:keyfieldsContext,
                        name:keyfieldsContext,

                    })
                }



            } ); 



        } catch (e) {
        }



    } );



    $("#table"+id+' tbody').on( 'click', 'tr', function () {  
        // editor.field( 'code' ).val( '200' );        //console.log( editor.field('code').update())

        json= table.ajax.json(this) ; // recupere les options

        obj2=table.row( this ).data()// recupere les options une ligne de la colone 
        // console.log(optionsSaiyan)

        //tab=optionsSaiyan.juripurchase


        editor.on( 'initEdit', function ( e ) {
            optionrecup()
            function optionrecup(){
                $.each(json.options, function (key2, data2) {


                    $.each(data2, function (key, data) {

                        $.each(obj2, function (keyobj2, dataobj2) {



                            if(keyobj2==key2){

                                $.each(dataobj2, function (keyarrayobj2, arrayobj2) {

                                    if(arrayobj2.id==data.name){

                                        editor.field(key2+"."+data.name ).val( arrayobj2.value );  
                                    }






                                } ); 


                            }

                        } ); 




                    } );
                } );
            }
        })



        /*   $.each(optionsSaiyan, function (keyopt, data) {




            $.each(obj2, function (keyobj2, data1) {

                if(keyobj2==keyopt){

                    $.each(obj2[keyobj2], function (key2, data2) {

                        $.each(optionsSaiyan[keyobj2], function (key3, data3) {


                            if(data2.id==data3.id){
                                // console.log(data2.id)
                                //console.log(data2.value)

                                optionsSaiyan[keyobj2][key3].value=data2.value

                            }

                        } );


                    } );




                }

            } );


        } );

*/

    });

    //miseAjourlisteField(jsonParse.fields);




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

        if(!jsonParse.urlrest){
            modalError("veuillez saisir une adresse url rest pour la page "+id)

        }

        if(!jsonParse.urldata){

            modalError('veuillez saisir une adresse data rest pour la page '+id+'<p>  ex: "urldata":"/srv/juridiction/" ')

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

        $.each(json.fields, function (key, data) {

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




        $.each(json, function (key, data) {


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

            editor.tab[cpt]={data:key, render:renderColtp }
            /*
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

*/
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
                            '<div class="col-lg-4 ">'+
                            '<label   for="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'">'+label+'</label>'+
                            '   <input class="form-control col-lg-4 input-sm " id="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'" type="list"  value='+val+' name="'+label+'"/>'+

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


                conf._input.find('input').each( function () {

                    console.log(out);
                    if( this.value!=' '){
                        out.push( this.value);

                    }
                } );
                console.log(conf);
                console.log(conf.separator);
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

    var test ;

    function editorSaiyan(jsonSaiyan){
        editor = new $.fn.dataTable.Editor( {
            data:"",
            ajax: {
                create: {
                    type: 'POST',
                    url:   urlrest+"_id_"
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
            fields: {"name":"a","label":"a"}  // recuper fields generer par la fonction exchangedatatable
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
                console.log(key)
                editor.field(key).update( data);

                /*  if(data.optionsL){



                    initValue(data,"' '")
                    editor.field(key).update( data.optionsL);


                }
*/

            } );

        });

        /**
        *   si on clique sur un ligne du tableau on recupere son id et  pour cette id on va recuperer ces champs 
        *   @constructor
        */

        $('#'+id+' tbody ').on('click', 'tr', function () {

            idClick = this.id;

            alert(idClick)

            allfields=get_fieldjson(idClick) ; 

            editor.field('juripurchase').update( allfields.option);

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
        console.log(urldata)
        var mydata = "draw=1&columns[0][data]=name&columns[0][name]=&columns[0][searchable]=true&columns[0][orderable]=true&columns[0][search][value]=&columns[0][search][regex]=false&columns[1][data]=juripurchase&columns[1][name]=&columns[1][searchable]=true&columns[1][orderable]=true&columns[1][search][value]=&columns[1][search][regex]=false&order[0][column]=0&order[0][dir]=asc&start=0&length=10&search[value]=&search[regex]=false&_=1435330792409";
        $.ajax(
            {
                order: [[ 0, "desc" ]],
                url: urldata,
                data: mydata,
                async: true,

                dataType: 'json',
                success: function (json) 
                {
                    console.log(json)	
                    jsonrecup=json.data   

                    for(var a=0;a<jsonrecup.length;a++)
                    {

                        idJson=jsonrecup[a]['id']
                        console.log(idclick+" "+idJson)
                        if(idclick==idJson)
                        {			
                            //  console.log(json)

                            tab=jsonrecup[a]
                            //   console.log(tab)
                            tab={tab,"option":json.option}
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





