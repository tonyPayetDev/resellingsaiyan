/*
    creer un div est donner id example dans page html 
    
    <div id="example" >
    
    // init avec js 
    
    jsonEntrer={"field":{  "kind": {"optionsS": ["fixe","mobile"]}, "name": {} ,"zone": {}}};
    jsonEntrer=JSON.stringify(jsonEntrer)
    generateEditor('example4',jsonEntrer,"{% url 'reselling:reselling_list' %}");
    
    // init avec django en context

    generateEditor('example2','{{ jsonfields|safe}}',"{% url 'reselling:reselling_list' %}");
*/


function generateEditor(id,json,url){

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

                //  console.log(key)
                //   console.log('key', key) 

                editor.tab[cpt]={data:key}  ;  


                $.each(data, function (index, data) {


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

                            name: key,
                            label: key,
                            type: type,
                            options: options

                        }

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

            editor = new $.fn.dataTable.Editor( {
                ajax:url,
                table: "#table"+id,
                fields:json.fields
            } );

            // [{data:"id"},{data:"name"}]

            var data=$("#table"+id).dataTable(
                {
                    dom: "Tfrtip",
                    lengthChange: false,
                    "ajax":url,
                    //  "language": dt_language,
                    "responsive": true,

                    "columns":json.tab,

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
            console.log('{% url "reselling:reselling_list" %}');

        }

    });

}