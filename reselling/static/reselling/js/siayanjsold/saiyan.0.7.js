/**
     * Represents a book.
     * @constructor
       @author <a href="tony.payet.professionnel@gmail.com">Payet Tony</a>
      @example
      * generateDatatable("reselling/achat/")
      *   

      @description 
        .
     */

$(document).ready(function(){

    datatableSaiyan('example2','/srv/config/');

})



function datatableSaiyan(id,url){
    var editor; // 


    var host=document.location.host;
    // permet de rester hover sur le lien active 

    var urlhost = jQuery(location).attr("href"); 
    var res = urlhost.split(host); // a changer par la suite 
    var urlhost=res[1];
    console.log(urlhost);
    jsondata=get_json();
    var jsonParse=jsondata[0].config;   
    urlrest=jsonParse.url2
    url=jsonParse.url
    urlpage=jsonParse.urlpage
    idsaiyan=jsonParse.idsaiyan
    col=jsonParse.col


    if(urlhost==urlpage){
        $('#datatable').replaceWith(  '<div class=" col-lg-'+col+'" id='+idsaiyan+'></div>')

        generethDatable(jsonParse,id)
        json=exchangeJsonDatatable(jsonParse.field);
        crsf();                           
        optList(); 
        editorSaiyan( json.fields ,urlrest );                    
        datatableSaiyan();
        miseAjourlisteField();
    }


    /**
     * Recuperer le data transmit en get contient data , config et field 
     * @constructor
     */

    function get_json()  {
        var mylist=new Array();
        var mydata = { table: 'ajaxtelco', field: 'code'};
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
    /**
     * Generer le code html qui va contenir l'id de la table  et le code html pour genere une table en html et les class boostrap pour le responsive design 
        param json contenant l'id et les fields necessaire pour l'affichage de la partie th 
     * @constructor
     */

    function generethDatable(json,id){

        var concat=""; // concatenation 

        $('#'+id).append("<table id='table"+id+"' class='table table-striped table-bordered  display responsive' cellspacing='0' width='100%'></table>");

        $.each(json.field, function (key, data) {

            concat=concat+' <th>' +key+'</th>';
            console.log(concat)

        })

        settings="<thead><"+concat+"</thead>"

        //    rajoute la table generer pour l'id en cours 

        $('#table'+id).append(settings);

    }
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
                    if(data2[0].id){

                        tab=data2
                        concat=" "
                        for (var i = 0; i < tab.length; i++) {

                            concat=concat+tab[i].label+":"+tab[i].value+" <p>" ;

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

                    console.log(tabOptions[i])

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

                    if( this.value!='saisie'){
                        out.push( this.value +"->"+this.name+"<p>");

                    }
                } );
                return conf.separator ? out.join(conf.separator) : out;
            },

            "set": function ( conf, val ) {
                var jqInputs = conf._input.find('input');
                console.log(val)
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
     * initialise editor recuperer url et json field generer par exchangeJsonDatatable et le submit des données en REST et l'id en cours 
     * @constructor
     */


    function editorSaiyan(jsonSaiyan){
        console.log(jsonSaiyan)
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
            fields:jsonSaiyan
        } );

    }
    /**
     * Represents a book.
     * @constructor
     */
    function datatableSaiyan(){

        var table=$('#table'+id).DataTable( {
            dom: "Tfrtip",
            ajax:   url,
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
     * Represents a book.
     * @constructor
     */
    //todo mise a jour des champs





    function miseAjourlisteField(){
        editor.on( 'initCreate', function ( e ) {
            $.each(jsonParse.field, function (key, data) {


                if(data.optionsL){


                    //     console.log(data.optionsL)

                    initValue(data)
                    editor.field(key).update( data.optionsL);


                }


            } );

        });


        $('#'+id+' tbody ').on('click', 'tr', function () {
            idClick = this.id;

            allfields=get_telco(idClick) ; 

            $.each(jsonParse.field, function (key, data) {


                editor.on( 'initEdit', function ( e ) {

                    if(data.optionsL){

                        miseAjourvaluelist(data,key);


                    }

                })


            } );


        } );


    }

    function miseAjourvaluelist(data,key){

        initValue(data)


        for(var a=0;a<data.optionsL.length;a++ ){

            //  console.log(data.optionsL[b])
            $.each(allfields, function (key2, data2) {


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
    function initValue(data){
        for( a=0 ; a<data.optionsL.length ; a++ ){
            data.optionsL[a].value="saisie"; 
            console.log(data.optionsL[a])
        }


    }

    /**
     * renvoie les valeurs d'une liste de champs pour un champs selectionner
     * @constructor
     */
    function get_telco(idclick) {

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
     * Represents a parse .
     * @constructor
     */
    function ParsingJson(a){

        // alert(a);
        try { 
            //  todo gerer probleme affiche erreur 
            if(a == "{}")  throw ' veuillez saisir un objet table "field":{"id": {}  }';
            a=JSON.parse(a)
        }
        catch(err) {
            alert("erreur de saisie is " + err);
            var settings =  '<a id="settings" href="#changeSkin" data-toggle="modal" style="display: block;>' +
                '<i class="fa fa-gear"></i> Change Skin' +
                '</a>' +   
                '<div class="modal fade" id="changeSkin" tabindex="-1" role="dialog" aria-hidden="false">' +
                '<div class="modal-dialog modal-lg">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">Changer le fond </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="row template-skins">' +

                err+	

                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';



            $('body').prepend(settings);

            $('#changeSkin').modal()  


        }

        return a ; 
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





