import Image from 'next/image'
import React from 'react'

const LatestCaptureComp = () => {

  const sheets = [
    { id: 1, title: 'Published a Capture on Floor1', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 2, title: 'Published a Capture on Floor2', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },
    { id: 3, title: 'Published a Capture on Floor3', lastactive: 'Jan 17, 2019', image: '/floor2.jpg', Avatar: "Unknown User" },

    // Add more sheets as needed
  ];

  return (
    <div className="p-4 w-full">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="font-bold text-lg">Latest Captures</h2>
        <button className='bg-blue-200 rounded-full px-6 py-3 mr-6 text-sm text-blue-900 hover:bg-blue-400 hover:text-blue-100 font-semibold'>View Captures</button>
      </div>
      <div className="relative w-full px-4">
        <div className="flex space-x-4 pb-4 overflow-x-auto custom-scrollbar">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl flex-shrink-0 w-full sm:w-[180px] md:w-[250px] lg:w-[300px]">
              <div className="mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl">
                <Image
                  src={sheet.image}
                  alt="card-image"
                  className=" rounded-xl h-[30vh] object-cover "
                  width={400}
                  height={300}
                />
              </div>
              <div className="p-6">
                <p className="font-semibold">{sheet.Avatar}</p>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75 truncate">
                  {sheet.title}
                </p>
                <p className="text-gray-500 ">{sheet.lastactive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestCaptureComp;
