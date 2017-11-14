PVLINKS.namespace("PVLINKS.IocList");
PVLINKS.IocList = function(model,body){
    var model = model,
        ioclist;

    var options = {
        valueNames: ["id"]
        //item: '<li><h3 class="id"></h3></li>'
    };


    function setLi(){
        var nodes = model.getPvNodes();
        var li = d3.select("#ioclist").select("ul")
            .selectAll("li")
            .data(nodes)
            .enter()
            .append("li")
            .on("click", function(node){
                d3.select(this).classed("selected", "true");
            })
            .append("h3")
            .text(function(node){
                return node.id;
            })
            .attr("class", "id");
    };

    function setList(source){
        var nodes = model.getPvNodes();
        ioclist = new List('ioclist',options);
    };

    return{
        setLi: setLi,
        setList: setList
    };
};

