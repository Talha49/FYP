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
      <h2 className="font-bold text-lg mb-4">Latest Captures</h2>
      <div className="relative w-full">
        <div className="flex space-x-4 pb-2 overflow-x-auto custom-scrollbar">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl flex-shrink-0" style={{ width: '350px' }}>
              <div className="mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl">
                <Image
                  src={sheet.image}
                  alt="card-image"
                  className="object-cover rounded-xl"
                  width={400}
                  height={300}
                />
              </div>
              <div className="p-6">
                <p className="font-semibold">{sheet.Avatar}</p>
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75 truncate">
                  {sheet.title}
                </p>
                <p className="text-gray-500 truncate">{sheet.lastactive}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestCaptureComp;
