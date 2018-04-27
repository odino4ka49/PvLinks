PVLINKS.namespace("PVLINKS.PvView");
PVLINKS.PvView = function(model,body){
    var model = model,
        ioclist,
        pvconnect,
	pvLinked;

    var options_ioc = {
        valueNames: ["id"]
    };

    var options_pv = {
        valueNames: ["id","rectype"]
    };


    function setLi(){
        var iocinfo = model.getIocInfo();

        var li_pv = d3.select("#pvlist").select("ul")
            .selectAll("li")
            .data(iocinfo["pv_list"])
            .enter()
            .append("li")
            .on("click", function(node){
                d3.select(this.parentNode).selectAll("li.selected").classed("selected",false);
                d3.select(this).classed("selected", true);
		loadPvLinksByPv(node.id);
            })
            .append("h3")
            .text(function(node){
                return node.id;
            })
            .attr("class", "id");

        var li_ioc = d3.select("#connected_ioc").select("ul")
            .selectAll("li")
            .data(iocinfo["ioc"])
            .enter()
            .append("li")
            .on("click", function(node){
                d3.select(this.parentNode).selectAll("li.selected").classed("selected",false);
                d3.select(this).classed("selected", "true");
		loadPvLinksByIoc(node.id);
            })
            .append("h3")
            .text(function(node){
                return node.id;
            })
            .attr("class", "id");
    };

    function loadPvLinksByPv(id){
        pvLinked = model.getConnectedPv(id);
	displayPvLinks();
    };

    function loadPvLinksByIoc(id){
        pvLinked = model.getPvFromIoc(id);
	displayPvLinks();
    };

    function displayPvLinks(){
	var pvlist = d3.select("#pvlist2").select("ul")
            .selectAll("li")
            .data(pvLinked);

	pvlist.select("h3")
            .text(function(node){
                return node;
            });
            
	pvlist.enter()
            .append("li")
            .on("click", function(node){
                d3.select(this.parentNode).selectAll("li.selected").classed("selected",false);
                d3.select(this).classed("selected", true);
            })
            .append("h3")
            .text(function(node){
                return node;
            });

	pvlist.exit().remove();
            //.attr("class", "id");
    };

    function setList(source){
        var ioclist = new List('connected_ioc',options_ioc);
        var pvlist = new List('pvlist',options_pv);
    };

    function setPvConnect(ioc){
        pvconnect = PVLINKS.PvConnect(model,body);
        pvconnect.setIoc1(ioc);
    };

    return{
        setLi: setLi,
        setList: setList,
        setPvConnect: setPvConnect
    };
};

