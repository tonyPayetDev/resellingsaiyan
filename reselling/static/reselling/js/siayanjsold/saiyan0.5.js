$(document).ready(function(){




    a=$("div[data]");

    console.log($("div[data]"))
    $.each(a, function (key, data) {

        generateDatatable($("#"+ a[key].id).attr("data"));

    })
})


function generateDatatable(url){



    
    $(document).ready(function(){
        var editor;
        var fields ; 



        jsondata=get_json();
        
        jsondata=JSON.parse(jsondata[0].fields)
        id=jsondata.idTable;
        col=jsondata.col;
        $( "#"+ id ).addClass( "col-lg-"+col );
        
        
        generethDatable();
        json=exchangeJsonDatatable(jsondata.field);
        generateDatatableEtEditor(json)


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
                        json=json.data[0]                    
                        mylist.push(json);



                    }
                });

            return mylist;
        }

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
            $.each(jsondata.field, function (key, data) {

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


                renderColtp=function ( data, type, row ) {
                    tab="";
                    try {

                        tab=JSON.parse(data)

                        console.log(tab)

                        tab=tab[0].prix+'->'+tab[0].id

                    } catch (e) {
                        tab=data;
                        //   console.error("Parsing error:", e); 
                    }

                    return tab;
                }

                editor.tab[cpt]={data:key,render:renderColtp}  ;  // attention pour type options


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
                            "type": type
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
                            console.log(val)
                            jqInput.append(
                                '<div>'+
                                '<input id="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'" type=""  value='+val+' name="'+label+'"/>'+
                                '<label for="'+ $.fn.dataTable.Editor.safeId( conf.id )+'_'+i+'">'+label+'</label>'+
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


            console.log(json.fields)
            editor = new $.fn.dataTable.Editor( {
                ajax:url,
                table: "#table"+id,

            } );

            // [{data:"id"},{data:"name"}]
            //  a=get_family()
            // console.log( a[0])

            editor.add( {
                label: "indicatif",
                name: "indicatif",

            } );
            editor.add( {
                label: "telco:",
                name: "telco",
                type:"list",
                options:{"sfr":"2","telco":"0"},      
            } );

            editor.add( {
                label: "test:",
                name: "test",

            } );
            //  editor.field( 'id' ).value( 'Enter the user\'s first name' );
            function get_family()
            {
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
                            json=json.data                         
                            for(var a=0;a<json.length;a++)
                            {
                                b=json[1]['telco'].split(';')
                                //  b[0]
                                x=b[1]
                                jsontelco=JSON.parse(json[0]['telco'])
                                console.log(jsontelco[0].id)

                                obj= { "label" : json[a]['telco'], "value" : json[a]['value']};
                                //      console.log(a)

                                mylist.push(b);
                            }


                        }
                    });

                JSON.stringify(mylist);
                return mylist;
            }




            var data=$("#table"+id).dataTable(
                {
                    dom: "Tfrtip",
                    lengthChange: false,
                    "ajax":url,
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
                    "fnDrawCallback": function( oSettings ) {

                    }

                })

            //  console.log(data);

            }
        
        

    });

}