var size = 200;

var screenWidth = size * 4,
        screenHeight = size * 4;
var width = size,
        height = size;

var projectionTop = d3.geo.orthographic().scale(width / 2).rotate([0, 0, 0]).translate([width / 2 + 3 * size / 4, height / 2]).clipAngle(90).precision(.1);
var projectionRight = d3.geo.orthographic().scale(width / 2).rotate([0, 0, -90]).translate([width / 2 + 3 * size / 2, height / 2 + 3 * size / 4]).clipAngle(90).precision(.1);
var projectionBottom = d3.geo.orthographic().scale(width / 2).rotate([0, 0, 180]).translate([width / 2 + 3 * size / 4, height / 2 + 3 * size / 2]).clipAngle(90).precision(.1);
var projectionLeft = d3.geo.orthographic().scale(width / 2).rotate([0, 0, 90]).translate([width / 2, height / 2 + 3 * size / 4]).clipAngle(90).precision(.1);
var pathTop = d3.geo.path().projection(projectionTop);
var pathRight = d3.geo.path().projection(projectionRight);
var pathBottom = d3.geo.path().projection(projectionBottom);
var pathLeft = d3.geo.path().projection(projectionLeft);

var Delta = d3.scale.linear()
        .domain([0, width])
        .range([-180, 180]);

var Gamma = d3.scale.linear()
        .domain([0, height])
        .range([90, -90]);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
        .attr("width", screenWidth)
        .attr("height", screenHeight)
        .append('g')
        .attr('transform', 'scale(-1,1) translate(-' + (size * 4) +')');

svg.append("defs").append("path").datum({type: "Sphere"}).attr("id", "sphereTop").attr("d", pathTop);
svg.append("defs").append("path").datum({type: "Sphere"}).attr("id", "sphereRight").attr("d", pathRight);
svg.append("defs").append("path").datum({type: "Sphere"}).attr("id", "sphereBottom").attr("d", pathBottom);
svg.append("defs").append("path").datum({type: "Sphere"}).attr("id", "sphereLeft").attr("d", pathLeft);

svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphereTop");
svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphereRight");
svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphereBottom");
svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphereLeft");

svg.append("use").attr("class", "fill").attr("xlink:href", "#sphereTop");
svg.append("use").attr("class", "fill").attr("xlink:href", "#sphereRight");
svg.append("use").attr("class", "fill").attr("xlink:href", "#sphereBottom");
svg.append("use").attr("class", "fill").attr("xlink:href", "#sphereLeft");

d3.json("json/world-110m.json", function (error, world) {
    if (error)
        throw error;

    svg.insert("path", ".graticule")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .attr("id", "lTop")
            .attr("d", pathTop);
    svg.insert("path", ".graticule")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .attr("id", "lRight")
            .attr("d", pathRight);
    svg.insert("path", ".graticule")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .attr("id", "lBottom")
            .attr("d", pathBottom);
    svg.insert("path", ".graticule")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .attr("id", "lLeft")
            .attr("d", pathLeft);

});
Leap.loop(function (frame) {
    pointer = frame.pointables[1];
    if(pointer){
            move(-pointer.tipPosition[0], pointer.tipPosition[2], pointer.tipPosition[1] / 4);
        }
});
svg.on("mousemove", function () {
    var p = d3.mouse(this);
    move(p[0], p[1], p[0]);
});

move = function(x, y, z){
    projectionTop.rotate([Delta(x), Gamma(y), 0]);
    projectionRight.rotate([Delta(x), Gamma(y), -90]);
    projectionBottom.rotate([Delta(x), Gamma(y), 180]);
    projectionLeft.rotate([Delta(x), Gamma(y), 90]);
    projectionTop.scale(z);
    projectionRight.scale(z);
    projectionBottom.scale(z);
    projectionLeft.scale(z);
    svg.selectAll("#sphereTop").attr("d", pathTop);
    svg.selectAll("#sphereRight").attr("d", pathRight);
    svg.selectAll("#sphereBottom").attr("d", pathBottom);
    svg.selectAll("#sphereLeft").attr("d", pathLeft);
    svg.selectAll("#lTop").attr("d", pathTop);
    svg.selectAll("#lRight").attr("d", pathRight);
    svg.selectAll("#lBottom").attr("d", pathBottom);
    svg.selectAll("#lLeft").attr("d", pathLeft);
}