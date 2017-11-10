PVLINKS.namespace("PVLINKS.PvGraph");
PVLINKS.PvGraph = function(model,body){
    var model = model;

    var svg = d3.select("body").append("svg")
        .attr('width', 1124)
        .attr('height', 1124);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.id;}))//.strength(function(d) {return (d.type=="ref")?0.05:2}))
        .force("charge", d3.forceManyBody().strength(0))
        .force("center", d3.forceCenter(500, 500));

    function setGraph(source){
        var nodes = model.getPvNodes(),
            links = model.getPvLinks();

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-width", function(d) {return Math.sqrt(d.value);});

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", function(d) {return "black"});

        node.append("title")
            .text(function(d) {return d.id;});

        simulation
            .nodes(nodes);

        simulation.force("link")
            .links(links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }
    };

    function dragstarted(d)
    {
        if(!d3.event.active)
            simulation.alphaTarget(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d)
    {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation;
        d.fx = null;
        d.fy = null;
    }

    return{
        setGraph: setGraph
    };
};