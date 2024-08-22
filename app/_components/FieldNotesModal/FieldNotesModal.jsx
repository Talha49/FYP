import React, { useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import { FaGlobe, FaExpand } from "react-icons/fa";
import Image from "next/image";
import Dialog from "../Dialog/Dialog";
import FieldNoteModalCardsModal from "../FieldNoteModalCardsModal/FieldNoteModalCardsModal";
import { VscClose } from "react-icons/vsc";

const FieldNotesModal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");

  const notes = [
    {
      id: 1,
      name: "Muhammad Waseem",
      room: "3-12",
      date: "Dec 8, 2022",
      floor: "Floor 2",
      priority: "Priority 2",
      imageUrl: "/floor.jpg",
      tag: "Fire alarm",
      description: "Fire Alarm is not connected to power source",
    },
    {
      id: 2,
      name: "Jane Doe",
      room: "2-14",
      date: "Jan 10, 2023",
      floor: "Floor 3",
      priority: "Priority 1",
      imageUrl: "/floor.jpg",
      tag: "Smoke detector",
      description: "Smoke detector needs maintenance",
    },
    
  ];

  const filterNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      note.description.toLowerCase().includes(searchParam.toLowerCase())
  );

  return (
    <>
      <div>
        {/*** Header Field Notes */}
        {/*** Search bar Row */}
        <div className="border-b-2 bg-white sticky top-0 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">FieldNotes</h1>
            <button className="hover:bg-gray-200 p-2 rounded-md" onClick={onClose}>
              <VscClose size={20} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Search Field Notes"
              className="border border-gray-300 rounded-md p-2 w-full outline-none md:max-w-[70%]"
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            />
            <button className="bg-transparent border p-2 rounded-md">
              <FaSortAmountDown />
            </button>
            <button className="bg-transparent text-blue-700 border flex items-center gap-2 p-2 rounded-md">
              <CiExport />
              Export
            </button>
          </div>
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap gap-1 text-xs">
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                For me
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Tags
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Status
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Due date
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Assignee
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Date created
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Sheets
              </button>
              <button className="border border-black/15 hover:bg-slate-200 p-2 rounded-full">
                Zones
              </button>
              <button className="border border-black/15 p-2 hover:bg-slate-200 rounded-full">
                Creator
              </button>
              <button className="border border-black/15 p-2 hover:bg-slate-200 rounded-full">
                Tags
              </button>
            </div>
            <div className="flex justify-end ml-auto mt-1">
              <button className="text-black p-2 text-xs bg-slate-200 rounded-md">
                Clear all
              </button>
            </div>
          </div>
          <div className="text-gray-600">{filterNotes.length} results</div>
        </div>

        {/*** Cards */}
        <div className="mt-3">
          <div className="p-4">
           {
            filterNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white shadow-md rounded-md p-4"
                  onClick={() => setIsOpen(true)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{note.name}</h3>
                      <p className="text-sm text-gray-600">
                        {note.room} &nbsp;&nbsp; {note.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <FaGlobe className="text-gray-600" />
                      <FaExpand className="text-gray-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{note.floor}</p>
                  <div className="my-2 bg-gray-200 p-2 rounded-md">
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {note.priority}
                    </span>
                  </div>
                  <div className="my-2">
                    <img
                      src={note.imageUrl}
                      alt="Note Image"
                      // width={400}
                      // height={300}
                      className="rounded-md"
                    />
                  </div>
                  <div className="my-2 bg-gray-200 p-2 rounded-md">
                    <span className="bg-gray-300 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {note.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{note.description}</p>
                </div>
              ))}
            </div>
            ) : (<div className="flex justify-center mt-4">
            <div className="text-center flex flex-col justify-center max-w-md mx-auto">
              <p className="text-md ">No Matches For Your Results !!</p>
              <Image src='/svg.jpg' width={300} height={300} className="mx-auto md:w-[73%]" />
            </div>
          </div>)
           }
          </div>
        </div>
      </div>

      {/* Dialog Middle */}
      {isOpen && (
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          widthClass="w-[900px]"
          isLeft={false}
          withBlur={true}
          padding="p-4"
          
        >
          <FieldNoteModalCardsModal onClose={() => setIsOpen(false)} />
        </Dialog>
      )}
    </>
  );
};

export default FieldNotesModal;
