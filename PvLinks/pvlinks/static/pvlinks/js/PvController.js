PVLINKS.namespace("PVLINKS.PvController");
PVLINKS.PvController = function(model,view){
    var pv_view = view,
        pv_model = model;


    $(document).on("ioc_loaded",function(event){
        view.setLi();
        view.setList();
    });

    pv_model.loadIocNodes();

    return{

    };
};