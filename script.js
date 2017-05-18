$(document).ready(function() {
  $.getJSON(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    function(json) {
      var returnNum = json.monthlyVariance.map(function(d, i) {
        return [
          {
            year: json.monthlyVariance[i].year,
            month: json.monthlyVariance[i].month,
            tVariance: json.monthlyVariance[i].variance
          }
        ];
      });

      var dataset = [].concat.apply([], returnNum);

      var margin = { top: 20, right: 0, bottom: 10, left: 0 },
        width = $(".divCard").width - margin.left - margin.right,
        height = $(".divCard").height - margin.top - margin.bottom,
        months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        years = [];

      for (var i = 0; i < 2015 - 1753; i++) {
        years[i] = i + 1753;
      }

      var margin = { top: 70, right: 200, bottom: $(".divCard").height()/13, left: 100 },
        width = $(".divCard").width() - margin.left - margin.right,
        height = $(".divCard").height() - margin.top - margin.bottom;

      var svg = d3
        .select(".divCard")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xScale = d3.scaleTime()
                     .domain([new Date(1753, 0, 0), new Date(2015, 0, 0)])
                     .range([0, width]);

      var yScale = d3.scaleLinear()
                     .domain([0, 12])
                     .range([height, 0]);

      svg
        .append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisTop(xScale).ticks(20));

      svg.append("g").call(d3.axisLeft(yScale));

      var colorScale = d3.scaleThreshold()
                         .domain([-5, -3, -1, 0, 1, 3, 5])
                          .range(["#5D2EE8", "#2F9EEE", "#2FC8EE", "#2DD91A", "#CBF22C", "#F2CE2C", "#F06E1D", "#7A2EA1"]);

        var tooltip = d3
        .select(".divCard")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var cells = svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("g")
        .append("rect")
        .attr("class", "cell")
        .attr("width", 5)
        .attr("height", 85)
        .attr("y", function(d) {
          return yScale(d.month);
        })
        .attr("x", function(d) {
          return xScale(new Date(d.year,0,0));
        })
        .attr("fill", function(d) {
          return colorScale(d.tVariance);
        })
          .on("mouseover", function(d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html("Year: "+ d.year +"<br> Month:"+ d.month+"<br>Variance:" + d.tVariance)
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition().duration(500).style("opacity", 0);
        });


        svg

        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-family", "sans-serif")
        .text("Month");
      svg
        .append("text")
        .attr("y", height + 35)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "18px")
        .style("fill", "black")
        .attr("font-family", "sans-serif")
        .text("Monthly Global Land-Surface Temperature Variance (1753-2015)");

         var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width+20)
      .attr("y", height-135)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", width+50)
      .attr("y", height-125)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d})



    });
});
