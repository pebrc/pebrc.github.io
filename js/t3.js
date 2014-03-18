!function() {
    var v3 = {
        "version": "0.0.1"
    };


    v3.nodeJoin =  function(a, b) {
                    if(a.leaf && b.leaf) {
                        return {"node": 2, "children": [a, b]};
                    } else if (a.node && b.leaf) {
                        return {"node": a.node + 1, "children": [a, b]};
                    } else if (a.leaf && b.node)  {
                        return {"node": b.node, "children": [a, b]};
                    } else {
                        return {"node": a.node + b.node, "children": [a, b]};
                    }
                };

    v3.buildTreeRecur = function() {
       if(arguments.length == 1) {
           return arguments[0];
       } else if (arguments.length == 2) {
           return v3.nodeJoin(arguments[0], arguments[1]);
       } else  {
           var args = Array.prototype.slice.call(arguments);
           return v3.buildTreeRecur(v3.nodeJoin(args[0], args[1]),
                                    v3.buildTreeRecur.apply(null, args.slice(2)));
       } 
    }; 

    v3.buildFor = function (target) {

        var input = target.attributes["values"].value.split(",");
        var data =  v3.buildTreeRecur.apply(null, input.map(function(e){ return {"leaf": e};}));
        

        var width = 150 + (20 * data.node);
        var height = 50 * Math.ceil(Math.log(data.node)/Math.log(2));

        var trees = d3.select(".tree");


        
        var svg = d3.select(target)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(0,7)");

        var tree = d3.layout.tree().size([width - 15, height - 15]);
        
        var diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y];});

        var nodes = tree.nodes(data);
        var links = tree.links(nodes);

        var link = svg.selectAll("path.link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", diagonal);

        var node = svg.selectAll("g.node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", function(d) {return "node " + (d.children ? "branch" :
                                                              "leaf"); })
                .attr("transform", function(d) {return "translate(" + d.x
                                                + "," + d.y + ")";});
        
        node.append("circle").attr("r", 6);
        
        var leaves = svg.selectAll("g.leaf");
        var branches = svg.selectAll("g.branch");
        
        leaves.append("text")
            .attr("dx", 10)
            .attr("dy", 3)
            .attr("text-anchor", "start")
            .text(function(d) {return d.leaf;});

        branches.append("text")
            .attr("dx", -2.5)
            .attr("dy", 3.8)
            .text(function(d){return d.node;});
    };


    d3.selectAll(".tree")[0].forEach(function(e) {
        v3.buildFor(e);
    });


}();


