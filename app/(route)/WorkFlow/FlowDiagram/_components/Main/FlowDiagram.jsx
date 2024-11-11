"use client";
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, MarkerType, EdgeText } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../SiderBar/SideBar';
import EdgeDialogue from '../EdgeDialog/EdgeDialog'; // Import EdgeDialogue component
import { StartNode } from "../NodeTypes/StartNode";
import { RectangleNode } from "../NodeTypes/RectangleNode";
import { NoteNode } from "../NodeTypes/NoteNode";
import { DatabaseNode } from "../NodeTypes/DatabaseNode";
import { ProcessNode } from "../NodeTypes/ProcessNode";
import { DecisionNode } from "../NodeTypes/DecisionNode";
import { CurvedNode } from "../NodeTypes/CurvedNode";
import { TerminatorNode } from "../NodeTypes/TerminatorNode";
import { TriangleNode } from "../NodeTypes/TringleNode";
import { CircleNode } from "../NodeTypes/CircleNode";
import { DisplayNode } from '../NodeTypes/DisplayNode';
import { CustomEdge } from '../Edges/EdgeTypes';
import { PreparationNode } from '../NodeTypes/PareparationNode';
import { DelayNode } from '../NodeTypes/DelayNode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const localStorageKey = "flow-diagram-data";

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  curved: CurvedNode,
  terminator: TerminatorNode,
  rectangle: RectangleNode,
  triangle: TriangleNode,
  circle: CircleNode,
  note: NoteNode,
  database: DatabaseNode,
  delay: DelayNode,
  preparation: PreparationNode,
};

const customEdgeTypes = {
  custom: CustomEdge, // Register your custom edge
};

export default function FlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeColor, setNodeColor] = useState('#ffffff');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedEdgeType, setSelectedEdgeType] = useState('default');
  const [pendingEdge, setPendingEdge] = useState(null); // Temporary state to hold edge


  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      type: 'smoothstep',
      markerEnd: selectedEdgeType === 'arrow' || selectedEdgeType === 'dotted'
        ? { type: MarkerType.Arrow, width: 10, height: 10 }
        : undefined,
      style: {
        stroke: 'black',
        strokeWidth: selectedEdgeType === 'dotted' ? 2 : 2,
        strokeDasharray: selectedEdgeType === 'dotted' ? '3,3' : undefined,
      },
      data: { label: '' }, // Initially empty label
      label: '', // Ensure this is added
    };
  
    setPendingEdge(newEdge); // Set the new edge as pending
    setSelectedEdge(newEdge); // Open dialog for setting title
  }, [selectedEdgeType, setEdges]);
  

  const handleEdgeSave = (edge, title) => {
    if (pendingEdge) {
      // Add the pending edge to the list of edges with the updated label
      setEdges((eds) => addEdge({ ...pendingEdge, data: { ...pendingEdge.data, label: title }, label: title }, eds));
      setPendingEdge(null); // Clear the pending edge
    } else {
      // Update existing edge
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === edge.id
            ? { ...ed, data: { ...ed.data, label: title }, label: title }
            : ed
        )
      );
    }
    setSelectedEdge(null); // Close dialog
  };
  
  
  const handleEdgeDelete = (edge) => {
    setEdges((eds) => eds.filter((ed) => ed.id !== edge.id));
    setSelectedEdge(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    const newNode = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: e.clientX, y: e.clientY },
      data: { label: `New ${type}`, color: nodeColor },
    };

    setSelectedNode(newNode);
    setNodeTitle(`New ${type}`);
    setNodeColor(nodeColor);
    setDialogOpen(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNodeDoubleClick = (event, node) => {
    setSelectedNode(node);
    setNodeTitle(node.data.label);
    setNodeColor(node.data.color || '#ffffff');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (selectedNode && !nodes.some((node) => node.id === selectedNode.id)) {
      setNodes((nds) => nds.concat(selectedNode));
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: nodeTitle, color: nodeColor } }
          : node
      )
    );

    setDialogOpen(false);
    setSelectedNode(null);
  };

  const handleNodeDelete = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setDialogOpen(false);
      setSelectedNode(null);
    }
  };

  const handleDialogCancel = () => {
    if (selectedNode && !nodes.some((node) => node.id === selectedNode.id)) {
      setPendingEdge(null); // Clear pending edge
  setSelectedEdge(null); // Close dialog
      setSelectedNode(null);
    }

    setDialogOpen(false);
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
      setNodes(savedNodes || []);
      setEdges(savedEdges || []);
    } else {
      alert("No saved diagram found.");
    }
  };

  const handleExportPng = () => {
    const flowElement = document.getElementById('react-flow');
    html2canvas(flowElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'diagram.png';
      link.click();
    });
  };

  const handleExportPdf = () => {
    const flowElement = document.getElementById('react-flow');
    html2canvas(flowElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('diagram.pdf');
    });
  };

  useEffect(() => {
    handleRestoreDiagram();
  }, []);

  const handleEdgeDoubleClick = (event, edge) => {
    setSelectedEdge(edge);
  };

  return (
    <div className="h-screen flex" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Sidebar onSetEdgeType={setSelectedEdgeType} selectedEdgeType={selectedEdgeType} />
      <div className="flex-grow relative pt-1">
        <div id="react-flow" className="relative w-full h-[99vh] border border-gray-300 rounded-lg bg-gray-50 pl-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={customEdgeTypes} // Use custom edge type
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            onNodeDoubleClick={handleNodeDoubleClick}
            onEdgeDoubleClick={handleEdgeDoubleClick} // Handle double-click on edges
          >
            <div className="font-bold pl-4 pt-3 text-2xl"><h1>FLOW DIAGRAM</h1></div>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
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
        {dialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {selectedNode ? 'Edit Node' : 'Add Node'}
              </h3>
              <input
                type="text"
                placeholder="Node Title"
                value={nodeTitle}
                onChange={(e) => setNodeTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="color"
                value={nodeColor}
                onChange={(e) => setNodeColor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleDialogClose}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleDialogCancel}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                {selectedNode && (
                  <button
                    onClick={handleNodeDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete Node
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {selectedEdge && (
          <EdgeDialogue
            edge={selectedEdge}
            onSave={handleEdgeSave}
            onDelete={handleEdgeDelete}
            onClose={() => setSelectedEdge(null)}
          />
        )}
      </div>
    </div>
  );
}
