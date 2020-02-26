var ForceDirected = (function () {
    function ForceDirected(width = 975, height = 610, radius = 10) {
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.init();
        this.drawGraphs();
    }

    ForceDirected.prototype.init = function () {
        var self = this;
        //975 610
        self.svg = d3.create("svg").attr("viewBox", [0, 0, this.width, this.height]).attr("class", 'ForceDirected');

        self.color = d3.scaleOrdinal(d3.schemeCategory10);

        self.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))//.distance([500]))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force('collide', d3.forceCollide(function (d) {
                return d.id === "j" ? 100 : 30
            }));
    };

    ForceDirected.prototype.drawGraphs = function () {
        var self = this;
        d3.json("http://localhost:8080/fdg").then(function (graph) {
            var link = self.svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

            var node = self.svg.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter().append("g")

            var circles = node.append("circle")
                .attr("r", self.radius)
                .attr("fill", function (d) {
                    return self.color(d.group);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            var lables = node.append("text")
                .text(function (d) {
                    return d.id;
                })
                .attr('x', 6)
                .attr('y', 3);

            node.append("title")
                .text(function (d) {
                    return d.id;
                });

            self.simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

            self.simulation.force("link")
                .links(graph.links);
            document.body.append(self.svg.node());

            function ticked() {
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
            }

            function dragstarted(d) {
                if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) self.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        });
    }
    return ForceDirected;
})();

