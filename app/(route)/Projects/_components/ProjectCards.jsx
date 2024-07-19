import Link from "next/link";
import React from "react";
import {
  FaGlobe,
  FaMapMarkedAlt,
  FaUsers,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const projects = [
  {
    id: 1,
    image: "/floor.jpg",
    title: "DemoPractice",
    lastCaptured: "Jan 17, 2023",
    captures: 1,
    users: 8,
    admin: "Admin",
    noCaptures: false,
  },
  {
    id: 2,
    image: "/floor.jpg",
    title: "Muhammad Saleem",
    lastCaptured: "",
    captures: 0,
    users: 0,
    admin: "Admin",
    noCaptures: true,
  },
  {
    id: 3,
    image: "/floor.jpg",
    title: "Three Month Tenant Improvement",
    lastCaptured: "Jan 17, 2019",
    captures: 73,
    users: 12,
    admin: "Admin",
    noCaptures: false,
  },
];

const ProjectCards = () => {
  return (
    <div className="py-10">
      <div className="mb-8 font-medium">
        <p className="flex gap-3 items-center ml-5">
          Project Name <IoIosArrowDown />{" "}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 mx-4">
        {projects.map((project) => (
          <Link href={`/Projects/${project.id}`}
            key={project.id}
            className="border rounded-lg overflow-hidden shadow-lg "
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute right-3 bottom-2 flex justify-center items-center space-x-4">
                <FaGlobe className="text-white bg-black bg-opacity-50 p-2 rounded-full" />
                <FaMapMarkedAlt className="text-white bg-black bg-opacity-50 p-2 rounded-full" />
                <FaUsers className="text-white bg-black bg-opacity-50 p-2 rounded-full" />
                <FaCog className="text-white bg-black bg-opacity-50 p-2 rounded-full" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{project.title}</h3>


              <p className="text-sm text-gray-500">
                {project.noCaptures ? (
                  "No captures"
                ) : (
                  <span className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-1" />{" "}
                    Last captured: {project.lastCaptured}
                  </span>
                )}{" "}
                • {project.admin}
              </p>
              <div className="flex space-x-4 mt-2">
                <p className="text-sm text-gray-500">
                  <FaGlobe className="inline mr-1" /> {project.captures}
                </p>
                <p className="text-sm text-gray-500">
                  <FaUsers className="inline mr-1" /> {project.users}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectCards;
