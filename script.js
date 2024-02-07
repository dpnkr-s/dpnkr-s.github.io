let baseLength_init = 0;
let heightLength_init = 0;
let area_init = 30;

const width = 600;
const height = 400;
const unit = 60;
const xOffset = 10; // Adjust this value to change the X offset
const yOffset = 90; // Adjust this value to change the Y offset

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg
  .append("line")
  .attr("x1", width / 2 - 10 - xOffset)
  .attr("y1", height / 2 + yOffset)
  .attr("x2", width / 2 + 10 - xOffset)
  .attr("y2", height / 2 + yOffset)
  .attr("stroke", "black");

svg
  .append("line")
  .attr("x1", width / 2 - xOffset)
  .attr("y1", height / 2 - 30 + yOffset)
  .attr("x2", width / 2 - xOffset)
  .attr("y2", height / 2 + 10 + yOffset)
  .attr("stroke", "black");

for (let i = -10; i <= 10; i++) {
  svg
    .append("line")
    .attr("x1", i * unit + width / 2 - xOffset)
    .attr("y1", height / 2 - 5 + yOffset)
    .attr("x2", i * unit + width / 2 - xOffset)
    .attr("y2", height / 2 + 5 + yOffset)
    .attr("stroke", "black");
}

for (let i = -15; i <= 15; i++) {
  svg
    .append("line")
    .attr("x1", width / 2 - 5 - xOffset)
    .attr("y1", i * unit + height / 2 + yOffset)
    .attr("x2", width / 2 + 5 - xOffset)
    .attr("y2", i * unit + height / 2 + yOffset)
    .attr("stroke", "black");
}

// Add axis labels
svg
  .append("text")
  .attr("x", width - xOffset)
  .attr("y", height / 2 + yOffset + 20)
  .attr("text-anchor", "end")
  .text("Consistency");

svg
  .append("text")
  .attr("x", xOffset)
  .attr("y", height / 2 + yOffset + 20)
  .attr("text-anchor", "start")
  .text("Decentralization");

svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", yOffset / 2)
  .attr("text-anchor", "middle")
  .text("Scale");

// Add a textbox for displaying blockchain platform information
const platformInfoText = svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("Bitcoin / Ethereum (PoW)");

const controlPoints = [
  {
    x: -3 * unit + width / 2 - xOffset,
    y: height / 2 + yOffset,
    label: 1,
    frozen: false,
  },
  {
    x: 0 + width / 2 - xOffset,
    y: -2.33 * unit + height / 2 + yOffset,
    label: 2,
    frozen: false,
  },
  {
    x: 3 * unit + width / 2 - xOffset,
    y: height / 2 + yOffset,
    label: 3,
    frozen: false,
  },
];

calculateTriangleProperties(
  controlPoints[0],
  controlPoints[1],
  controlPoints[2]
);

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(d3.curveBasis);

const curvePath = svg
  .append("path")
  .datum(controlPoints)
  .attr("class", "curve")
  .attr("d", line);

const points = svg
  .selectAll(".control-point")
  .data(controlPoints)
  .enter()
  .append("g")
  .attr("class", "control-point")
  .call(
    d3.drag().on("drag", (event, d) => {
      if (!d.frozen) {
        if (d.label === 1) {
          newX =
            Math.round(
              Math.min(
                Math.max(event.x, -3 * unit + width / 2 - xOffset),
                -1 * unit + width / 2 - xOffset
              ) / unit
            ) * unit;
          d.x = newX - 10;
          d.y = height / 2 + yOffset;

          const cp1 = controlPoints.find((cp) => cp.label === 1);
          const cp3 = controlPoints.find((cp) => cp.label === 3);
          const midX = (cp1.x + cp3.x) / 2;

          controlPoints.find((cp) => cp.label === 2).y =
            height / 2 - (14 / calculateDistance(cp1, cp3)) * unit + yOffset;
          controlPoints.find((cp) => cp.label === 2).x = midX;
        } else if (d.label === 3) {
          newX =
            Math.round(
              Math.min(
                Math.max(event.x, 1 * unit + width / 2 - xOffset),
                3 * unit + width / 2 - xOffset
              ) / unit
            ) * unit;
          d.x = newX - 10;
          d.y = height / 2 + yOffset;

          const cp1 = controlPoints.find((cp) => cp.label === 1);
          const cp3 = controlPoints.find((cp) => cp.label === 3);
          const midX = (cp1.x + cp3.x) / 2;

          controlPoints.find((cp) => cp.label === 2).y =
            height / 2 - (14 / calculateDistance(cp1, cp3)) * unit + yOffset;
          controlPoints.find((cp) => cp.label === 2).x = midX;
        } else {
          controlPoints.find((cp) => cp.label === 2).x = event.x;
          controlPoints.find((cp) => cp.label === 2).y = event.y;
        }
        updateCurve();
        updatePlatformInfoText();
      }
    })
  );

points
  .append("circle")
  .attr("r", 8)
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("fill", "blue");

// Add a class to hide control point 2
points.filter((d) => d.label === 2).style("visibility", "hidden");

// Add reset button
const resetButton = svg
  .append("g")
  .attr("class", "reset-button")
  .attr("transform", "translate(500, 100)")
  .on("click", resetControlPoints);

resetButton
  .append("rect")
  .attr("width", 80)
  .attr("height", 20)
  .attr("fill", "lightgreen")
  .attr("stroke", "black");

resetButton
  .append("text")
  .attr("x", 40)
  .attr("y", 12)
  .attr("text-anchor", "middle")
  .text("Reset");

function resetControlPoints() {
  controlPoints[0].x = -3 * unit + width / 2 - xOffset;
  controlPoints[0].y = height / 2 + yOffset;

  controlPoints[1].x = 0 + width / 2 - xOffset;
  controlPoints[1].y = -2.33 * unit + height / 2 + yOffset;

  controlPoints[2].x = 3 * unit + width / 2 - xOffset;
  controlPoints[2].y = height / 2 + yOffset;

  updateCurve();
  updatePlatformInfoText();
}

function updateCurve() {
  curvePath.attr("d", line);

  calculateTriangleProperties(
    controlPoints[0],
    controlPoints[1],
    controlPoints[2]
  );

  points
    .select("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("fill", (d) => (d.frozen ? "red" : "blue"));

  ll_updated = calculateBezierLength(controlPoints);
}

function calculateBezierLength(points) {
  const segments = 100;
  let length = 0;

  for (let i = 0; i < segments; i++) {
    const t1 = i / segments;
    const t2 = (i + 1) / segments;

    const p1 = getBezierPoint(t1, points);
    const p2 = getBezierPoint(t2, points);

    length += calculateDistance(p1, p2);
  }

  return length;
}

function getBezierPoint(t, points) {
  const [p1, p2, p3] = points;
  const x = (1 - t) ** 2 * p1.x + 2 * (1 - t) * t * p2.x + t ** 2 * p3.x;
  const y = (1 - t) ** 2 * p1.y + 2 * (1 - t) * t * p2.y + t ** 2 * p3.y;

  return { x, y };
}

function calculateDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy) / unit;
}

function calculateTriangleProperties(p1, p2, p3) {
  baseLength_init = calculateDistance(p1, p3);
  heightLength_init = (200 - p2.y) / unit;
  area_init = 0.5 * baseLength_init * heightLength_init;
}

function updatePlatformInfoText() {
  const cp1 = controlPoints.find((cp) => cp.label === 1);
  const cp3 = controlPoints.find((cp) => cp.label === 3);

  if (
    cp1.x === -3 * unit + width / 2 - xOffset &&
    cp3.x === 3 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("Bitcoin / Ethereum (PoW)");
  } else if (
    cp1.x === -3 * unit + width / 2 - xOffset &&
    cp3.x === 1 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("IOTA / EOS");
  } else if (
    cp1.x === -3 * unit + width / 2 - xOffset &&
    cp3.x === 2 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("Cardano / Dash / Lisk");
  } else if (
    cp1.x === -1 * unit + width / 2 - xOffset &&
    cp3.x === 1 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("Hyperledger / Corda");
  } else if (
    cp1.x === -2 * unit + width / 2 - xOffset &&
    cp3.x === 2 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("NEO");
  } else if (
    cp1.x === -2 * unit + width / 2 - xOffset &&
    cp3.x === 1 * unit + width / 2 - xOffset
  ) {
    platformInfoText.text("Ripple / NEM");
  } else {
    platformInfoText.text("");
  }
}
