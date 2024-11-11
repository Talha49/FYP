"use client";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "../SideBar/Siderbar"; // Adjust the path as needed
import NodeDialog from "../dialouge/NodeDialog"; // Adjust the path as needed
import EdgeDialog from "../edges/EdgeDialog"; // Updated Edge Dialog component
import DefaultNode from "../Nodes/DefaultNode";
import InputNode from "../Nodes/InputNode";
import OutputNode from "../Nodes/OutputNode";
import CustomNode from "../Nodes/CustomNode";
import CircleNode from "../Nodes/CircleNode";
import RectangleNode from "../Nodes/RectangleNode";
import HumanNode from "../Nodes/HumanNode";
import VerticalLineNode from "../Nodes/VerticalLineNode";
import { CustomEdge } from "../edges/CustomEdge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const localStorageKey = "Sequence-diagram-data";

const nodeTypes = {
  defaultNode: DefaultNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  verticalLine: VerticalLineNode,
  customNode: CustomNode,
  circleNode: CircleNode,
  rectangleNode: RectangleNode,
  humanNode: HumanNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const SequenceDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false);
  const [edgeDialogData, setEdgeDialogData] = useState({});
  const [draggingNodeType, setDraggingNodeType] = useState(null);
  const [hideNodes, setHideNodes] = useState(false);
  const [hideEdges, setHideEdges] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);

  const onConnect = useCallback(
    (params) => {
      const edgeType = dialogData.edgeStyle || "straight";

      // Ensure all edges are straight
      const newEdge = {
        ...params,
        type: "straight", // Always use 'straight' for all edges
        animated: edgeType === "dotted" ? false : true, // Disable animation for dotted lines
        style: {
          stroke: "#333",
          strokeWidth: "2px",
          strokeDasharray: edgeType === "dotted" ? "5,5" : "0", // Dotted style for 'dotted' edges
        },
        markerEnd: { type: MarkerType.ArrowClosed }, // Arrow at the end of the edge
        label: dialogData.edgeLabel || "",
      };

      setEdges((eds) => addEdge(newEdge, eds)); // Update edges in the state
    },
    [dialogData.edgeLabel, dialogData.edgeStyle, setEdges]
  );

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    setDraggingNodeType(nodeType);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    setDialogData({ position, nodeType: draggingNodeType });
    setDialogOpen(true);
  };

  const handleNodeDoubleClick = (event, node) => {
    setDialogData({
      ...node,
      position: node.position || dialogData.position,
      nodeType: node.type,
      title: node.data.label,
      color: node.data.color || "#ffffff",
      nodeId: node.id,
    });
    setDialogOpen(true);
  };

  const handleEdgeDoubleClick = (event, edge) => {
    setEdgeDialogData({
      ...edge,
      label: edge.label || "",
      style: edge.style || { stroke: "#333", strokeWidth: "2px" },
    });
    setEdgeDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogData({});
  };

  const handleEdgeDialogClose = () => {
    setEdgeDialogOpen(false);
    setEdgeDialogData({});
  };

  const handleDialogSave = () => {
    const { position, nodeType, title, color, nodeId } = dialogData;

    if (nodeId) {
      // Update existing node
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { label: title, color },
                position: position || node.position,
                type: nodeType,
              }
            : node
        )
      );
    } else {
      // Add new node
      const newNode = {
        id: `${nodes.length + 1}`,
        type: nodeType,
        position,
        data: { label: title, color },
      };

      if (nodeType === "verticalLine") {
        newNode.data = {
          intervals: 10,
          height: 500,
          color,
          title,
          onConnectHandle: (params) => onConnect(params),
        };
      }

      setNodes((nds) => [...nds, newNode]);
    }

    handleDialogClose();
  };

  const handleEdgeDialogSave = () => {
    const { id, label, style } = edgeDialogData;

    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              label,
              style,
            }
          : edge
      )
    );

    handleEdgeDialogClose();
  };

  const handleEdgeDelete = () => {
    const { id } = edgeDialogData;

    setEdges((eds) => eds.filter((edge) => edge.id !== id));
    handleEdgeDialogClose();
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    handleDialogClose();
  };

  const handleInputChange = (event) => {
    setDialogData({ ...dialogData, [event.target.name]: event.target.value });
  };

  const handleEdgeInputChange = (event) => {
    setEdgeDialogData({
      ...edgeDialogData,
      [event.target.name]: event.target.value,
    });
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleSaveDiagram = () => {
    const diagramData = {
      nodes,
      edges,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(diagramData));
    alert("Diagram saved successfully!");
  };

  const handleRestoreDiagram = () => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  };

  const handleExportPng = () => {
    const element = document.getElementById("react-flow");
    html2canvas(element).then((canvas) => {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "diagram.png";
      link.click();
    });
  };

  const handleExportPdf = () => {
    const element = document.getElementById("react-flow");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("diagram.pdf");
    });
  };

  useEffect(() => {
    handleRestoreDiagram();
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          onDragStart={handleDragStart}
          onInputChange={handleInputChange}
          dialogData={dialogData}
          onToggleNodes={() => setHideNodes(!hideNodes)}
          onToggleEdges={() => setHideEdges(!hideEdges)}
          onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
        />

        {/* React Flow Canvas */}
        <div className="flex-grow relative pt-1">
          {/* Container with border for diagram */}
          <div
            id="react-flow"
            className="relative w-full h-[99vh] border border-gray-300 rounded-lg bg-gray-50 pl-1"
          >
            <ReactFlow
              nodes={hideNodes ? [] : nodes}
              edges={hideEdges ? [] : edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onDrop={handleDrop}
              onDragOver={onDragOver}
              onNodeDoubleClick={handleNodeDoubleClick}
              onEdgeDoubleClick={handleEdgeDoubleClick} // Add edge double click handler
              fitView
            >
              <div className="font-bold pl-4 pt-3 text-2xl">
                <h1>SEQUENCE DIAGRAM</h1>
              </div>
              {showMiniMap && <MiniMap />}
              <Controls />
              <Background />
            </ReactFlow>

            {/* Top-right buttons */}
            <div className="absolute top-2 right-2 space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={handleSaveDiagram}
              >
                Save
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={handleRestoreDiagram}
              >
                Restore
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={handleExportPng}
              >
                Export PNG
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={handleExportPdf}
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Node Configuration Dialog */}
        <NodeDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
          dialogData={dialogData}
          onInputChange={handleInputChange}
          onDelete={handleDeleteNode}
        />

        {/* Edge Configuration Dialog */}
        <EdgeDialog
          open={edgeDialogOpen}
          onClose={handleEdgeDialogClose}
          onSave={handleEdgeDialogSave}
          onDelete={handleEdgeDelete} // Pass delete handler to EdgeDialog
          edgeData={edgeDialogData}
          onInputChange={handleEdgeInputChange}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default SequenceDiagram;
