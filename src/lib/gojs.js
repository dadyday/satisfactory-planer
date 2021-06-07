import go from 'gojs';
var $ = go.GraphObject.make;

function makePort(name, inOut, side = 'Left') {
  var port = $(go.Shape, "RoundedRectangle", {
    fill: inOut ? "#fc0" : "#0c0", 
    stroke: null,
    desiredSize: new go.Size(20, 20),
    portId: name,  // declare this object to be a "port"
    toMaxLinks: 1,  // don't allow more than one link into a port
    cursor: "pointer",  // show a different cursor to indicate potential link point
    toSpot: go.Spot[side],
    toLinkable: true,
  });

  var panel = $(go.Panel, "Horizontal", { 
    margin: new go.Margin(2, 0),
    alignment: go.Spot['Top'+side],
  }, port);
  
  return panel;
}

function makeTemplate(name, inports, outports) {
  var panel = $(go.Panel, "Auto",
    { 
      width: 100, 
      height: 120
    },
    $(go.Shape, "Rectangle", {
      // fill: background, stroke: null, strokeWidth: 0,
      spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
    }),
    $(go.Panel, "Table",
      $(go.TextBlock, name, {
        row: 0,
        margin: 3,
        maxSize: new go.Size(80, NaN),
        stroke: "white",
        font: "bold 11pt sans-serif"
      }),
      // $(go.Picture, icon, { row: 1, width: 16, height: 16, scale: 3.0 }),
      $(go.TextBlock, 
        {
          row: 2,
          margin: 3,
          editable: true,
          maxSize: new go.Size(80, 40),
          stroke: "white",
          font: "bold 9pt sans-serif"
        }
      //  new go.Binding("text", "name").makeTwoWay()
      )
    )
  );
  
  var node = $(go.Node, "Spot", 
    panel,
    $(go.Panel, "Vertical", {
      alignment: go.Spot.Left,
      alignmentFocus: new go.Spot(0, 0.5, 8, 0)
    }, inports),
    $(go.Panel, "Vertical", {
      alignment: go.Spot.Right,
      alignmentFocus: new go.Spot(1, 0.5, -8, 0)
    }, outports)
  );

  return node;
}

export function createNodeTemplateMap(aConfig) { 
  const aMap = new go.Map();
  for (var name in aConfig) {
    var [title, inPorts, outPorts] = aConfig[name];
    
    const aIn = [];
    for (var i = 0; i < inPorts; i++) {
      aIn.push(makePort("in"+i, true));
    }

    const aOut = [];
    for (var o = 0; o < outPorts; o++) {
      aOut.push(makePort("out"+o, false));
    }
    
    aMap.add(name, makeTemplate(title, aIn, aOut));
  }
  return aMap;
}


function makeLinkTemplate() {
  var node = $(go.Link,
    {
      routing: go.Link.Orthogonal, corner: 5,
      relinkableFrom: true, relinkableTo: true
    },
    $(go.Shape, { stroke: "gray", strokeWidth: 2 }),
    $(go.Shape, { stroke: "gray", fill: "gray", toArrow: "Standard" })
  );

  return node;
}

export function createLinkTemplateMap() { 
  return {
    belt: makeLinkTemplate("Belt"),
    pipe: makeTemplate("Pipe"),
  };
}


