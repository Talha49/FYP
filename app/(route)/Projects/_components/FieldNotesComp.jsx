import Image from 'next/image';
import React from 'react'
import { RxAvatar } from 'react-icons/rx';

const FieldNotesComp = () => {
 
    const fieldnotes = [
        { id: 1, title: 'Added a note on Floor1', lastactive: 'Jan 17, 2019', image: '/h1.jpg', Avatar: "Mehwat Waseem" },
        { id: 1, title: 'Added a note on Floor4', lastactive: 'Jan 17, 2019', image: '/h2.jpg', Avatar: "Muhammad Saleem" },
        { id: 1, title: 'Added a note on Floor3', lastactive: 'Jan 17, 2019', image: '/h3.jpg', Avatar: "Anthony Miraco" },
        { id: 1, title: 'Added a note on Floor1', lastactive: 'Jan 17, 2019', image: '/h1.jpg', Avatar: "Mehwat Waseem" },
        { id: 1, title: 'Added a note on Floor4', lastactive: 'Jan 17, 2019', image: '/h2.jpg', Avatar: "Muhammad Saleem" },
        { id: 1, title: 'Added a note on Floor3', lastactive: 'Jan 17, 2019', image: '/h3.jpg', Avatar: "Anthony Miraco" },
        { id: 1, title: 'Added a note on Floor1', lastactive: 'Jan 17, 2019', image: '/h1.jpg', Avatar: "Mehwat Waseem" },
        { id: 1, title: 'Added a note on Floor4', lastactive: 'Jan 17, 2019', image: '/h2.jpg', Avatar: "Muhammad Saleem" },
        { id: 1, title: 'Added a note on Floor3', lastactive: 'Jan 17, 2019', image: '/h3.jpg', Avatar: "Anthony Miraco" },
      ];

  return (
  <div className="p-4 w-full">
      <div className="mb-4">
        <h2 className="font-bold text-lg">Field Notes</h2>
      </div>      
      <div className="relative w-full px-4">
        <div className="flex space-x-4 pb-2 overflow-x-auto custom-scrollbar">
          {fieldnotes.map((sheet) => (
            <div key={sheet.id} className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl flex-shrink-0 w-full sm:w-[180px] md:w-[250px]">
              <div className="mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl">
                <Image
                  src={sheet.image}
                  alt="card-image"
                  className="rounded-xl h-[30vh] object-cover"
                  width={400}
                  height={300}
                />
              </div>
              <div className="p-6">
                <p className="font-semibold">{sheet.Avatar}</p>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75 ">
                  {sheet.title}
                </p>
                <p className="text-gray-500 ">{sheet.lastactive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FieldNotesComp