PVLINKS.namespace("PVLINKS.IocList");
PVLINKS.IocList = function(model,body){
    var model = model,
        ioclist;

    var options = {
        valueNames: ["id"],
        item: '<li><h3 class="id"></h3></li>'
    }


    function setList(source){
        var nodes = model.getIocNodes();
        ioclist = new List('ioclist',options,nodes);
    };

    return{
        setList: setList
    };
};

