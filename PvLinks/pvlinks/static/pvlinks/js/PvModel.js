PVLINKS.namespace("PVLINKS.PvModel");
PVLINKS.PvModel = function(){
    var nodes, links;

        getPvNodes = function(){
            var result = nodes;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getIocNodes = function(){
            var result = nodes.filter(function(node){return node.type=="ioc";});//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
        },

        getPvLinks = function(){
            var result = links;//(tree_data===undefined)? undefined: jQuery.extend(true,{},tree_data);
            return result;
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
                console.log(data);
                $(document).trigger("unset_loading_cursor");
                $(document).trigger("ioc_loaded");
            }
        });
    };




    return {
        loadIocNodes: loadIocNodes,
        getPvNodes: getPvNodes,
        getIocNodes: getIocNodes,
        getPvLinks: getPvLinks
    };
}