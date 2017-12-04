PVLINKS.namespace("PVLINKS.PvConnect");
PVLINKS.PvConnect = function(model,body){
    var model = model,
        body = body,
        svg,
        ioc1, pv1list,
        ioc2, pv2list,
        pvlinks;


    function setIoc1(ioc1name){
        ioc1 = {"type":"ioc", "id": ioc1name, "x0": 200, "y0": 300, "width": 200, "height": 400};
        //pv1list = model.getPvList();
    };

    function setIoc2(ioc2name){
        ioc2 = ioc2name;//model.getIoc(ioc2name);
        ioc2["x0"] = 600;
        ioc2["y0"] = 300;
        ioc2["width"] = 200;
        ioc2["height"] = 400;
        //pv2list = model.getPv(ioc2name);
        setPvLinks();
        drawIoc();
    };

    function setPvLinks(){
        //pvlinks = model.getPvLinks(pv1list,pv2list);
    };

    function drawIoc(){
        console.log(ioc1,ioc2);
        if(!(ioc1&&ioc2)) return;

        var node = svg.selectAll("g.ioc")
            .data([ioc1,ioc2], function(n){ return n.id; });

        var nodeEnter = node.enter().insert("g")
            .attr("class", "ioc")

        nodeEnter.append("rect")
            .attr("x",function(n){
                return n.x0;
            })
            .attr("y",function(n){
                return n.y0;
            })
            .attr("width",function(n){
                return n.width;
            })
            .attr("height",function(n){
                return n.height;
            })
            .attr("fill",function(n){
                return '#ADD8E6';
            });
    };

    function init(){
        var zoom = d3.behavior.zoom()
            .scaleExtent([.1,1])
            .on('zoom', function(){
                svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            })
            .translate([0, 0]);
        svg = d3.select("body").append("svg")
            .attr('width', "600%")
            .attr('height', "100%")
            .call(zoom)
            .append('g')
            .attr("transform", "translate(0,0)");
    };

    init();

    return{
        setIoc1: setIoc1,
        setIoc2: setIoc2,
        setPvLinks: setPvLinks
    };
};




