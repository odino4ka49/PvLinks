PVLINKS.namespace("PVLINKS.PvModel");
PVLINKS.PvModel = function(){
    var iocinfo,
        iocnodes,
        pvnodes,
        pvnodes2,
        nodes,
        links,

        getPvNodes2 = function(){
            var result = pvnodes2;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getPvNodes = function(){
            var result = pvnodes;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getIocNodes = function(){
            var result = iocnodes;//.filter(function(node){return node.type=="ioc";});//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getIocInfo = function(){
            var result = iocinfo;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getConnectedPv = function(id){
            var pvnames = [], pvs = [];
            iocinfo["pv_links"].forEach(function(link){
                if (link.source==id){
                    pvnames.push(link.target);
                }else if(link.target==id){
                    pvnames.push(link.source);
                }
            });
            return pvnames;
        },

	    getPvFromIoc = function(id){
            var pvnames = [], pvs = [];
            iocinfo["ioc_links"].forEach(function(link){
                if (link.source==id){
                    pvnames.push(link.target);
                }
            });
            return pvnames;
        };

    function loadAllData(){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getAllData",
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                nodes = data["nodes"];
                links = data["links"];
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("pvdata_loaded");
            }
        });
    };

    function loadIocNodes(){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getIoc",
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                iocnodes = data;
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("ioc_loaded");
            }
        });
    };

    function loadAllPvNodes(){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getAllPv",
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                pvnodes = data;
                console.log("loaded")
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("pv_loaded");
            }
        });
    };

    function loadPvByIoc(ioc){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getPvByIoc",
            data: {ioc:ioc},
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                pvnodes2 = data;
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("pv2_loaded");
            }
        });
    };

    function loadPvByPv(pv){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getPvByPv",
            data: {pv:pv},
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                pvnodes2 = data;
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("pv2_loaded");
            }
        });
    };

    function loadIocInfo(ioc){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getInfoIoc",
            data: {ioc:ioc},
            error: function(xhr, ajaxOptions, thrownError) {
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("error_message",thrownError);
            },
            success: function(data){
                iocinfo = data;
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("iocinfo_loaded");
            }
        });
    };


    return {
        loadIocInfo: loadIocInfo,
        loadIocNodes: loadIocNodes,
        loadAllPvNodes: loadAllPvNodes,
        loadPvByIoc: loadPvByIoc,
        loadPvByPv: loadPvByPv,
        getIocInfo: getIocInfo,
        getPvNodes: getPvNodes,
        getPvNodes2: getPvNodes2,
        getIocNodes: getIocNodes,
        getConnectedPv: getConnectedPv,
	    getPvFromIoc: getPvFromIoc
    };
}
