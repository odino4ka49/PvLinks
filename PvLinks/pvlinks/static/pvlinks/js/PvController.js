PVLINKS.namespace("PVLINKS.PvController");
PVLINKS.PvController = function(model,view){
    var pv_view = view,
        pv_model = model;


    function getIocId(){
        var pathname = location.pathname;
        var path = pathname.split('/');
        if(path[1]=="pvlinks"&&path[2]=="pvlist"){
            return path[3]
        }
    };

    $(document).on("iocinfo_loaded",function(event){
        view.setLi();
        view.setList();
    });

    pv_model.loadIocInfo(getIocId());

    return{

    };
};