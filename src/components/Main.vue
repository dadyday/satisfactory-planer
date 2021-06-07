<template>
  <div id="main">
    <div>
      <button @click="run">Run!</button>
      <button @click="drawDiagram">Diagram</button>
    </div>
    
    <div id="myDiagramDiv" style="width:1200px; height:400px; background-color: #dadae8;">
    </div>
     
    <svg width="800" height="400" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="foundation" viewBox="0,0,10,10" width="20%" height="20%">
          <polygon points="0,0 2,5 0,10 5,8 10,10 8,5 10,0 5,2" fill="#ccc"/>
        </pattern>
      </defs>
      <Scheme :data="oScheme" />
    </svg>
    
    <!--div>
      <Scheme :data="oScheme" />
    </div-->
    <ul>
      <li v-for="oQuant, item in aQuantity" v-bind:key="item">
        {{ item }}: {{ oQuant }}
      </li>
    </ul>
  </div>
</template>

<script>
import runner from '../lib';
import go from 'gojs';
import Building from '../lib/building';
/*import {
  createNodeTemplateMap, 
  // createLinkTemplateMap,
} from '../lib/gojs'; //*/

export default {
  data() {
    return {
      oScheme: null,
    };
  },
  computed: {
    aQuantity() {
      return this.oScheme ? this.oScheme.aQuantity : [];
    },
  },
  methods: {
    run() {
      this.oScheme = runner({
        //wire: 10,
        //cable: 10,
        ironplate: 10,
        ironrod: 10,
        screw: 10,
        reinforcedironplate: 3,
      });
    },
    drawDiagram() {
      var $ = go.GraphObject.make;  // for conciseness in defining templates
      var myDiagram = $(go.Diagram, "myDiagramDiv", {
        "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
        "draggingTool.gridSnapCellSize": new go.Size(40, 40),
        "draggingTool.isGridSnapEnabled": true,
        grid: $(go.Panel, "Grid",
          $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 4 }),
          $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
          $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 4 })
        ),
        "draggingTool.dragsLink": false,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
        "relinkingTool.fromHandleArchetype":
          $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
        "relinkingTool.toHandleArchetype":
          $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
        "linkReshapingTool.handleArchetype":
          $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        "rotatingTool.handleAngle": 270,
        "rotatingTool.handleDistance": 30,
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
      });
      const oMap = Building.getTemplateMap();
      console.log(oMap);
      myDiagram.nodeTemplateMap = oMap;
    /*  myDiagram.nodeTemplateMap = createNodeTemplateMap({
        splitter: ['Split', 1, 3],
        miner: ['Miner', 0, 1],
        smelter: ['Smelter', 1, 1],
        foundry: ['Foundry', 2, 1],
        construct: ['Constructor', 1, 1],
      });*/
      //myDiagram.linkTemplateMap = createLinkTemplateMap();
      myDiagram.linkTemplate = $(go.Link,
        { routing: go.Link.Orthogonal, corner: 10 },
        $(go.Shape, // the link's path shape
          { strokeWidth: 20, stroke: "#555" }
        )
      );
      //*/

      myDiagram.model = new go.GraphLinksModel(
        [
          { key: "ironore#0", type: "miner" },
          { key: "splitter#0", type: "splitter" },
          { key: "ironingot#0", type: "smelter" },
          { key: "ironingot#1", type: "smelter" },
          { key: "steelbeam#0", type: "foundry" },
        ],
        [
        //  { from: 'ironore#0', fromPortId: 'out', to: 'splitter#0', toPortId: 'in', },
        //  { from: 'splitter#0', fromPortId: 'out_left', to: 'ironingot#0', toPortId: 'in', },
        //  { from: 'splitter#0', fromPortId: 'out_mid', to: 'ironingot#1', toPortId: 'in', },
        ]
      );
      myDiagram.model.nodeCategoryProperty = "type";
      myDiagram.model.linkFromPortIdProperty = "fromPortId";
      myDiagram.model.linkToPortIdProperty = "toPortId";
      
      
    /*
      var myDiagram = $(
        go.Diagram, 
        "myDiagramDiv",  // create a Diagram for the DIV HTML element
        {
          initialAutoScale: go.Diagram.Uniform,  // scale to show all of the contents
        //  "ChangedSelection": onSelectionChanged, // view additional information
          
          
          "ModelChanged": function(e) {     // just for demonstration purposes,
            if (e.isTransactionFinished) {  // show the model data in the page's TextArea
              //document.getElementById("mySavedModel").textContent = e.model.toJson();
            }
          }
        }
      );
      myDiagram.nodeTemplate = $(
        go.Node, 
        "Spot",
        {
          locationObjectName: "PORT",
          locationSpot: go.Spot.Top,  // location point is the middle top of the PORT
          //linkConnected: updatePortHeight,
          //linkDisconnected: updatePortHeight,
          toolTip:
            $("ToolTip",
              $(go.TextBlock, { margin: 4, width: 140 },
                new go.Binding("text", "", function(data) { return data.text + ":\n\n" + data.description; }))
            )
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          // The main element of the Spot panel is a vertical panel housing an optional icon,
          // plus a rectangle that acts as the port
        $(
          go.Panel, 
          "Vertical", 
          $(
            go.Shape, 
            {
              width: 40, height: 0,
              stroke: null, strokeWidth: 0, fill: "gray"
            },
            new go.Binding("height", "icon", function() { return 40; }),
            new go.Binding("fill", "color", colorFunc),
            new go.Binding("geometry", "icon", geoFunc)),
            $(
              go.Shape, 
              {
                name: "PORT",
                width: 40, height: 24, margin: new go.Margin(-1, 0, 0, 0),
                stroke: null, strokeWidth: 0, fill: "gray",
                portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true
              },
              new go.Binding("fill", "color", colorFunc)
            ),
            $(
              go.TextBlock,
              {
                font: "Bold 14px Lato, sans-serif",
                textAlign: "center",
                margin: 3,
                maxSize: new go.Size(100, NaN),
                alignment: go.Spot.Top,
                alignmentFocus: go.Spot.Bottom,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          )
        );
      */
    }
  },
}
</script>

<style>
</style>
