function generateDatatable(id,json,url){

    var jsonEntrer=json;

    $(document).ready(function(){

        var editor;
        var fields ; 

        /*  jsonEntrer={
            "field": {

                "kind": {
                    "optionsS": [
                        "fixe",
                        "mobile"
                    ]
                },


                "zone": {
                    "optionsS": [
                        "inter",
                        "natio"
                    ]
                },

                "name": {

                }

            }
        }
        ;*/
        // jsonEntrer='{"field":{  "kind": {"optionsS": ["fixe","mobile"]}, "name": "aaa" }}';
        //var obj = jQuery.parseJSON(jsonEntrer );

        var json=JSON.parse(jsonEntrer);   //  remplacer par function todo gerer probleme affiche erreur   
        generethDatable();
        json=exchangeJsonDatatable(json.field);
        generateDatatableEtEditor(json)
        console.log(json)

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


        function generethDatable(){

            $("#"+id).append('<table id="table'+id+'" class="table table-striped table-bordered  display responsive " width="100%" cellspacing="0"></table>');

            var concat="";
            $.each(json.field, function (key, data) {

                // alert(key);
                concat=concat+' <th>' +key+'</th>';

            })
            settings="<thead>"+concat+"</thead>"

            console.log(settings);


            $('#table'+id).append(settings);
        }


        function exchangeJsonDatatable(json){
            var type="" ;
            var tab=[];
            var name;
            var cpt=0;
            var editor={"fields": [],"tab": []};
            var  options={"options": []};
            var concat;



            $.each(json, function (key, data) {

                console.log(key)
                //   console.log('key', key) 

                editor.tab[cpt]={data:key}  ;  // attention pour type options


                $.each(data, function (index, data) {

                    if(index=="list"){

                        type="list";
                        options=data;
                    }

                    if(index=="optionsS"){

                        type="select";
                        options=data;
                    }

                    if(index=="optionsR"){

                        type="radio";
                        options=data;
                    }

                })

                // si il ya un type on ajoute les options

                if(key!="" ){

                    editor.fields[cpt]={

                        name: key,
                        label: key,
                    }

                    if(type!=""){

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

        // permet de parser le json 

        function generateDatatableEtEditor(json){
            var editor; // use a global for the submit and return data rendering in the examples
            // Our custom field type list
            $.fn.dataTable.Editor.fieldTypes.list = $.extend( true, {}, $.fn.dataTable.Editor.models.fieldType, {
                "_addOptions": function ( conf, opts ) {
                    var val, label;
                    var elOpts = conf._input[0].options;
                    var jqInput = conf._input.empty();

                    if ( opts ) {
                        $.fn.dataTable.Editor.pairs( opts, conf.optionsPair, function ( val, label, i ) {
                            //  console.log(val)
                            jqInput.append(
                                '<div>'+
                                '<label for="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'">'+label+'</label>'+
                                '   <input id="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'" type=""  value='+val+' name="'+label+'"/>'+

                                '</div>'
                            );
                            //$('input:last', jqInput).attr('value', val)[0]._editor_val = val;
                        } );
                    }
                },

                "create": function ( conf ) {
                    var that = this;

                    conf._enabled = true;
                    console.log($.fn.dataTable.Editor.fieldTypes.list._addOptions )
                    // Create the elements to use for the input
                    conf._input = $('<div />');


                    $.fn.dataTable.Editor.fieldTypes.list._addOptions( conf, conf.options || conf.ipOpts );


                    return conf._input;
                },
                "get": function ( conf ) {
                    var el = conf._input.find('input:checked');
                    return el.length ? el[0]._editor_val : undefined;
                },

                "set": function ( conf, val ) {
                    var that  = this;

                    conf._input.find('input').each( function () {
                        this._preChecked = false;

                        if ( this._editor_val == val ) {
                            this.checked = true;
                            this._preChecked = true;
                        }
                        else {
                            // In a detached DOM tree, there is no relationship between the
                            // input elements, so we need to uncheck any element that does
                            // not match the value
                            this.checked = false;
                            this._preChecked = false;
                        }
                    } );

                    conf._input.find('input:checked').change();
                },

                "enable": function ( conf ) {
                    conf._input.find('input').prop('disabled', false);
                },

                "disable": function ( conf ) {
                    conf._input.find('input').prop('disabled', true);
                },

                "update": function ( conf, options ) {
                    var radio =  $.fn.dataTable.Editor.fieldTypes.list;
                    var currVal = radio.get( conf );

                    radio._addOptions( conf, options );

                    // Select the current value if it exists in the new data set, otherwise
                    // select the first radio input so there is always a value selected
                    var inputs = conf._input.find('input');
                    radio.set( conf, inputs.filter('[value="'+currVal+'"]').length ?
                              currVal :
                              inputs.eq(0).attr('value')
                             );
                }



            } );


            // console.log(json.fields)
            editor = new $.fn.dataTable.Editor( {
                ajax:url,
                table: "#table"+id,
                idSrc: "myid",
                fields:json.fields,
            } );
            // [{data:"id"},{data:"name"}]




            var table=$("#table"+id).DataTable(
                {
                    dom: "Tfrtip",
                    lengthChange: false,
                    ajax:url,

                    //  "language": dt_language,
                    "responsive": true,

                    "columns": json.tab,// [ { data: "access" , render: "[, ].name"}],

                    "processing": true,
                    "serverSide": true,


                    tableTools: {
                        sRowSelect: "os",
                        aButtons: [
                            { sExtends: "editor_create", editor:  editor},
                            { sExtends: "editor_edit",   editor: editor},
                            { sExtends: "editor_remove", editor: editor}
                        ]
                    },
                })



            $('#'+id+' tbody').on('click', 'tr', function () {
                var id = this.id;


                var jsonautre=JSON.parse(jsonEntrer);    


                allfields=get_telco(id) ; 


                $.each(jsonautre.field, function (key, data) {
           
                    tabTransf=reconstructionOptForaDatatable(key,allfields,data);
                    // on transmet l'id et le nom de la list 

                    editor.field(key).update(tabTransf );



                })

                function get_telco(idclick)
                {

                    var mylist=new Array();
                    var mydata = { table: 'hosting.telco', field: 'code'};
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
                                        mylist.push(tab);

                                    }


                                }


                            }
                        });

                    JSON.stringify(mylist);
                    return tab;
                }


                function reconstructionOptForaDatatable(key1,tab1,list1){

                    //      console.log(tab1)
                    //     console.log(key)


                    $.each(tab1, function (key, data) {


                        if(key==key1){

                            data=data.split(';')                 

                            for(var a=0;a<data.length;a++){

                                // pour chaque ligne de la chaine on enlever les espaces devant 
                                tabSansEspace=$.trim(data[a])
                                // on split pour recuperer 3 valeur et le mettre dans un tableau  id et la value 
                                tab2=tabSansEspace.split(' ');
                                tablist=list1.list

                                for(var c=0;c<tablist.length;c++){

                                    // attention si id change de place 
                                    if(tab2[1]==tablist[c].id){

                                        tablist[c].value=tab2[2] 

                                    }

                                }


                            }

                        }


                    })


                    return tablist;

                }




            } );

        }

    });

}
