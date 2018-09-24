PVLINKS.namespace("PVLINKS.PvLists");
PVLINKS.PvLists = function(model,body){
    var model = model,
        iocnodes,
        pvnodes,
        pvnodes2,
        pvbutton = $( 'button[value="pv"]' )
        lists = {};

    function selectPv(pv_id){
        lists["pv"].setInput(pv_id);
        lists["pv"].selectFirst();
        hideList(["ioclist","pclist","iocpvlist"]);
        if(! pvbutton.hasClass("highlight")){
            $("#pvlist").removeClass("hidden");
            $('button').removeClass("highlight");
            pvbutton.addClass("highlight");
        }
        if(lists["pv2"]){
            lists["pv2"].clear();
        }
    };

    function additionalFunctions(listname,target){
        if(listname == "ioc"){
            if($(target).hasClass("selected")){
                var ioc_id = $(target).text();
                model.loadPvByIoc(ioc_id);
            }
            else {
                lists["pvlist2"].clear();
            }
        }
        else if(listname == "pv"){
            if($(target).hasClass("selected")){
                var pv_id = $(target).text();
                model.loadPvByPv(pv_id);
            }
            else {
                if(lists["pv2"]){
                    lists["pv2"].clear();
                }
            }
        }
        else if(listname == "pv2"){
            if($(target).hasClass("selected")){
                var pv_id = $(target).text();
                selectPv(pv_id);
            }
        }
        else if(listname == "iocpv"){
            if($(target).hasClass("selected")){
                var pv_id = $(target).text();
                showList(["pv2list"]);
                selectPv(pv_id);
            }
        }
    };


    function hideList(list){
        list.forEach(function(listname){
            $("#"+listname).addClass("hidden");
        });
    };

    function showList(list){
        list.forEach(function(listname){
            $("#"+listname).removeClass("hidden");
        });
    };

    function initMenu(){
        $('button').click(function(){
            $('button').removeClass("highlight");
            $(this).addClass("highlight");
        });
        $('button[value="ioc"]').click( function() {
            hideList(["pvlist","pclist","pv2list"]);
            showList(["ioclist","iocpvlist"]);
            model.loadIocNodes();
        });
        pvbutton.click( function() {
            hideList(["ioclist","pclist","iocpvlist"]);
            showList(["pvlist","pv2list"]);
            model.loadAllPvNodes();
        });
        $('button[value="pc"]').click( function() {
            hideList(["ioclist","pvlist","pv2list","iocpvlist"]);
        });
    };

    function initLists(){
        lists["ioc"] = PVLINKS.myList(model,$("#ioclist"),"ioc",additionalFunctions);
        lists["pv"] = PVLINKS.myList(model,$("#pvlist"),"pv",additionalFunctions);
        lists["pv2"] = PVLINKS.myList(model,$("#pv2list"),"pv2",additionalFunctions);
        lists["iocpv"] = PVLINKS.myList(model,$("#iocpvlist"),"iocpv",additionalFunctions);
    }

    $(document).ready(function(){
        initMenu();
        initLists();
        model.loadAllPvNodes();
    });

    return{

    };
};

