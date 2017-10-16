PVLINKS.namespace("PVLINKS.PvController");
PVLINKS.PvController = function(model,view){
    var pv_view = view,
        pv_model = model;


    $(document).on("pvdata_loaded",function(event){
        view.setGraph();
    });

    return{

    };
};