var PVLINKS = PVLINKS||{};
PVLINKS.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = PVLINKS,
        i;
    if (parts[0] === "PVLINKS") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};
PVLINKS.serveradr = function(){
	return location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/";
};

$(document).on("set_loading_cursor",function(){
    document.body.style.cursor='wait';
});
$(document).on("unset_loading_cursor",function(){
    document.body.style.cursor='default';
});
$(document).ready(function(){
    var model = PVLINKS.PvModel(),
        view = PVLINKS.PvView(model,{
            "body": d3.select("body")
        });
        controller = PVLINKS.PvController(model,view);
});

