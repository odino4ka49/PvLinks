PVLINKS.namespace("PVLINKS.PvModel");
PVLINKS.PvModel = function(){
    var iocinfo;

        getPvNodes = function(){
            var result = nodes;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getIocNodes = function(){
            var result = nodes.filter(function(node){return node.type=="ioc";});//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
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

    function loadPvData(){
        $(document).trigger("set_loading_cursor");
        $.ajax({
            type: "GET",
            url: PVLINKS.serveradr()+"pvlinks/getPvData",
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
                nodes = data;
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("ioc_loaded");
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
                console.log(data)
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("iocinfo_loaded");
            }
        });
    };




    return {
        loadIocInfo: loadIocInfo,
        loadIocNodes: loadIocNodes,
        getIocInfo: getIocInfo,
        getPvNodes: getPvNodes,
        getIocNodes: getIocNodes,
        getConnectedPv: getConnectedPv,
	getPvFromIoc: getPvFromIoc
    };
}
