PVLINKS.namespace("PVLINKS.PvLists");
PVLINKS.PvLists = function(model,body){
    var model = model,
        iocnodes,
        pvnodes,
        pvnodes2,
        pvbutton = $( 'input[type="button"][value="pv"]' )
        lists = {};

    function selectPv(pv_id){
        /*$("#pvlist input").val(pv_id);
        lists["pvlist"].search(pv_id);
        $("#pvlist").children("ul").children("li").trigger("click");*/
        lists["pvlist"].setInput(pv_id);
        hideList(["ioclist","pclist"]);
        if(! pvbutton.hasClass("highlight")){
            $("#pvlist").removeClass("hidden");
            pvbutton.siblings().removeClass("highlight");
            pvbutton.addClass("highlight");
        }
        if(lists["pvlist2"]){
            lists["pvlist2"].clear();
        }
    };

    function additionalFunctions(listname){
        var lis =  $("#"+listname).children("ul").children("li");
        if(listname == "ioclist"){
            lis.click(function(event){
                if($(this).hasClass("selected")){
                    var ioc_id = $(this).children("h3").text();
                    model.loadPvByIoc(ioc_id);
                }
                else {
                    lists["pvlist2"].clear();
                }
            });
        }
        else if(listname == "pvlist"){
            lis.click(function(event){
                if($(this).hasClass("selected")){
                    var pv_id = $(this).children("h3").text();
                    model.loadPvByPv(pv_id);
                }
                else {
                    lists["pvlist2"].clear();
                }
            });
        }
        else if(listname == "pvlist2"){
            lis.click(function(event){
                var pv_id = $(this).children("h3").text();
                selectPv(pv_id);
            });
        }
    };

    function setList(){
        var nodes = model.getPvNodes();
        ioclist = new List('ioclist',options);
    };

    function initSearch(list,listname,actions){
        var options = {
            valueNames: ["id"],
            item: '<li><h3 class="id"></h3></li>'
        };
        if (lists[listname]) {
            if(actions!="add"){
                if(lists["pvlist2"]){
                    lists["pvlist2"].clear();
                }
                lists[listname] = new List(listname,options).clear();
            }
            lists[listname].add(list);
        }
        else{
            lists[listname] = new List(listname,options,list);
        }
        var lis = $("#"+listname).children("ul").children("li");
        lis.click(function(){
            if(!$(this).hasClass("selected")){
                lis.removeClass("selected");
                $(this).addClass("selected");
            }
            else{
                $(this).removeClass("selected");
            }
        });
        additionalFunctions(listname);
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
        $('input').click(function(){
            $(this).siblings().removeClass("highlight");
            $(this).addClass("highlight");
        });
        $('input[type="button"][value="ioc"]').click( function() {
            hideList(["pvlist","pclist","pvlist2"]);
            model.loadIocNodes();
        });
        pvbutton.click( function() {
            hideList(["ioclist","pclist","pvlist2"]);
            showList(["pvlist"]);
            model.loadAllPvNodes();
        });
        $('input[type="button"][value="pc"]').click( function() {
            hideList(["ioclist","pvlist","pvlist2"]);
        });
    };

    $(document).ready(function(){
        initMenu();
        model.loadAllPvNodes();
        lists["pvlist"] = PVLINKS.myList(model,$("#pvlist"));
    });

    $(document).on("ioc_loaded",function(event){
        iocnodes = model.getIocNodes();
        showList(["ioclist"]);
        initSearch(iocnodes,"ioclist",null);
    });

    $(document).on("pv_loaded",function(event){
        pvnodes = model.getPvNodes();
        //initSearch(pvnodes,"pvlist",null);
    });

    $(document).on("pv2_loaded",function(event){
        pvnodes2 = model.getPvNodes2();
        showList(["pvlist2"]);
        initSearch(pvnodes2,"pvlist2",null);
    });

    $(document).on("clearlist",function(event,listname){
        lists[listname].clear();
    })

    return{

    };
};

