"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

// Dummy project data for demonstration
const initialProjects = [
  { id: 1, name: "Flow Diagram Example", type: "Flow Diagram" },
  { id: 2, name: "Sequence Diagram Example", type: "Sequence Diagram" },
  { id: 3, name: "Hierarchy Diagram Example", type: "Hierarchy Diagram" },
];

export default function WorkFlow() {
  const [projects, setProjects] = useState(initialProjects);
  const router = useRouter();

  const handleEdit = (id) => {
    // Redirect to the diagram editing page
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    // Delete the diagram (mock implementation)
    setProjects(projects.filter((project) => project.id !== id));
  };

  const handleExport = (id) => {
    // Trigger export functionality
    const format = prompt("Enter format (png/pdf):");
    if (format === "png" || format === "pdf") {
      alert(`Exporting diagram ${id} as ${format}`);
      // Add your export logic here
    } else {
      alert("Invalid format");
    }
  };

  const navigateToEditor = (type) => {
    const editorPath = type.split(" ").join("").toLowerCase();
    router.push(`/edit/${editorPath}`);
  };

  return (
    <div className="relative min-h-screen">
      <Head>
        <title>Diagram Maker</title>
        <meta
          name="description"
          content="Create and visualize diagrams with ease"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background SVG Patterns */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <svg
          className="absolute inset-0 w-full h-full text-gray-200"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circles */}
          <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.1" />
          <circle cx="150" cy="150" r="50" fill="currentColor" opacity="0.1" />
          <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.1" />

          {/* Background Lines */}
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.1"
          />
          <line
            x1="0"
            y1="200"
            x2="200"
            y2="0"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.1"
          />

          {/* Background Squares */}
          <rect
            x="20"
            y="120"
            width="40"
            height="40"
            fill="currentColor"
            opacity="0.1"
          />
          <rect
            x="140"
            y="20"
            width="50"
            height="50"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col  justify-center min-h-screen p-6">
        <h1 className="text-5xl font-semibold  mb-12 text-gray-800">
          Project Work Flow
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Diagram Options */}
          <div
            onClick={() => {
              router.push("/WorkFlow/FlowDiagram");
            }}
            className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <svg
              className="w-24 h-24 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10h5M3 14h5M3 6h5m10 8h5m-5-4h5M13 6h5m-5 8h5m-5-4V6m0 12v-6" />
            </svg>
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">
              Flow Diagram
            </h2>
            <p className="text-gray-600">
              Visualize the flow of processes and decisions with ease.
            </p>
          </div>

          <div
            onClick={() => {
              router.push("/WorkFlow/SequenceDiagram");
            }}
            className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <svg
              className="w-24 h-24 mb-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16M4 19h16m-6-7h6M4 9h6M14 13h2M14 7h2M4 13h2" />
            </svg>
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">
              Sequence Diagram
            </h2>
            <p className="text-gray-600">
              Depict the sequence of interactions and messages between entities.
            </p>
          </div>

          <div
            onClick={() => {
              router.push("/WorkFlow/HierarchyDiagram");
            }}
            className="bg-gray-100 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            <svg
              className="w-24 h-24 mb-4 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l4 4m0 0l4 4m-4-4v12m0 0l-4-4m0 0l-4 4m4-12H5m7 0h7" />
            </svg>
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">
              Hierarchy Diagram
            </h2>
            <p className="text-gray-600">
              Show the structure of organizations or systems.
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-6 text-gray-800">
            Your Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-100 p-6 rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="text-gray-600">{project.type}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEdit(project.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleExport(project.id)}
                    className="text-green-500 hover:underline"
                  >
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
