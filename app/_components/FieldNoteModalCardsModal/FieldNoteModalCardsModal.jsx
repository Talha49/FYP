import React, { useState } from 'react';
import { FaHandLizard, FaFileUpload } from 'react-icons/fa';
import { ImBold } from 'react-icons/im';
import { TbWorld, TbCapture } from 'react-icons/tb';
import { MdOutlinePersonAddAlt1, MdOutlineMarkEmailUnread } from 'react-icons/md';
import { IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { SiSquare } from 'react-icons/si';
import { VscClose } from "react-icons/vsc";

const FieldNoteModalCardsModal = ({ onClose }) => {

  const [tags, setTags] = useState(['Fire alarm']);

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setTags([...tags, event.target.value]);
      event.target.value = '';
    }
  };


  return (
    <div>
      <div className='bg-white border-b-2 flex sticky top-0 z-10 justify-between px-4 py-2 items-center w-full'>
        <div>
          <h1>Muhammad Waseem</h1>
          <p>3-12 | <span>Dec 8, 2022</span></p>
        </div>
        <div className='flex items-center gap-x-2'>
          <p className='hover:bg-gray-200 p-2 rounded-md'><FaHandLizard size={15} /></p>
          <p className='hover:bg-gray-200 p-2 rounded-md'><ImBold size={15} /></p>
          <p className='hover:bg-gray-200 p-2 rounded-md'><TbCapture size={15} /></p>
          <p className='hover:bg-gray-200 p-2 rounded-md'><SiSquare size={15} /></p>
          <p className='hover:bg-gray-200 p-2 rounded-md'><TbWorld size={15} /></p>
          <p className='hover:bg-gray-200 p-2 rounded-md'><IoEllipsisHorizontalOutline size={15} /></p>
          <p className='bg-slate-300 h-6 w-[1px]'></p>
          <button className="hover:bg-gray-200 p-2 rounded-md" onClick={onClose}><VscClose size={20}/></button>
        </div>
      </div>


      <div className="w-full  p-4">
      <div className="grid sm:grid-cols-2  gap-4">
        {/* Left Section */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src="/floor.jpg"
              alt="Capture"
              className="w-full h-64 object-cover rounded"
            />
            <div className="absolute top-2 left-2 bg-white p-1 rounded shadow">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                Change photo
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                Markup
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="text-blue-600">Previous</button>
            <button className="text-blue-600">Next</button>
          </div>
          <div className="text-gray-600">
            <p>
              This Field Note is from a capture on Jan 16, 2019.{' '}
              <a href="#" className="text-blue-600">
                Click here to view it.
              </a>
            </p>
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Fire Alarm is not connected to power source"
            />
          </div>
          <div>
            <label className="block text-gray-600">Comment</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Add a comment..."
            />
          </div>
          <div className="text-center text-gray-400">No comments yet... Start the conversation!</div>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Floor</label>
            <img
              src="/floor2.jpg"
              alt="Floor Plan"
              className="w-full h-32 object-cover rounded border"
            />
          </div>
          <div>
            <label className="block text-gray-600">Status</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Priority 2</option>
              <option>Priority 1</option>
              <option>Priority 3</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Assignee</label>
            <div className="flex items-center border border-gray-300 p-2 rounded">
              <MdOutlinePersonAddAlt1 className="mr-2 text-gray-500" />
              <span className="text-gray-500">Unassigned</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-600">Email alerts</label>
            <div className="flex items-center border border-gray-300 p-2 rounded">
              <MdOutlineMarkEmailUnread className="mr-2 text-gray-500" />
              <span className="text-gray-500">1 watcher</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-600">Tags</label>
            <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded">
              {tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 p-1 rounded text-gray-600">{tag}</span>
              ))}
              <input
                type="text"
                className="flex-1 border-none focus:outline-none"
                placeholder="Add a tag"
                onKeyDown={handleAddTag}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600">Due date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue="2022-12-13"
            />
          </div>
          <div>
            <label className="block text-gray-600">Attachments</label>
            <div className="border border-gray-300 p-4 rounded text-center">
              <FaFileUpload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-gray-500">Looks like no attachments have been added yet.</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Browse files</button>
              <p className="text-gray-400 mt-2">or drag and drop here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FieldNoteModalCardsModal;
