var draw = function () {
    data = {}
    // data = d3.json("us-map.json").then(function(data){
    //     self.topology = data;
    // });
    new BubbleMap(data, 3000, 2000);
    // new EdgeBundling(data);
    //new ForceDirected();
};

window.onload = draw;