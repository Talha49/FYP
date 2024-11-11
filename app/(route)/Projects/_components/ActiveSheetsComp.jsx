import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ActiveSheetsComp(){

  const sheets = [
    { id: 1, title: 'Floor 1', lastactive: 'Last active Jan 10, 2019', image: '/floor2.jpg' },
    { id: 2, title: 'Floor 2', lastactive: 'Last active Jan 17, 2019', image: '/floor2.jpg' },
    { id: 3, title: 'Floor 3', lastactive: 'Last active Jan 24, 2019', image: '/floor2.jpg' },
    { id: 4, title: 'Floor 4', lastactive: 'Last active Jan 31, 2019', image: '/floor2.jpg' },
    { id: 5, title: 'Floor 5', lastactive: 'Last active Feb 7, 2019', image: '/floor2.jpg' },
    { id: 6, title: 'Floor 6', lastactive: 'Last active Feb 14, 2019', image: '/floor2.jpg' },
    { id: 7, title: 'Floor 7', lastactive: 'Last active Feb 21, 2019', image: '/floor2.jpg' },
    { id: 8, title: 'Floor 8', lastactive: 'Last active Feb 28, 2019', image: '/floor2.jpg' },
    { id: 9, title: 'Floor 9', lastactive: 'Last active Mar 7, 2019', image: '/floor2.jpg' },
    { id: 10, title: 'Floor 10', lastactive: 'Last active Mar 14, 2019', image: '/floor2.jpg' },
  ];

  return (
    <div className="py-10">
     <div className='flex justify-between  items-center mb-4 '>
     <h2 className="font-bold text-lg ">Active Sheets</h2>
     <Link href={`/Projects/1/ActiveSheets/1`} className='button rounded-lg px-6 py-3 mr-6 text-sm text-white hover:bg-blue-600 font-semibold transition-all'>View all Sheets</Link>
     </div>
    <div className="relative w-[99%] px-4">
      <div className="flex space-x-4 pb-2 overflow-x-auto custom-scrollbar">
        {sheets.map((floor) => (
          <Link key={floor.id} href={``}>
            <div className="flex p-2  rounded-lg flex-shrink-0" style={{ width: '350px' }}>
              <div className="w-32 h-32 relative">
                <Image src={floor.image} layout="fill" objectFit="contain" alt="Image" className="rounded-lg" />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <p className="font-semibold truncate">{floor.title}</p>
                <p className="text-gray-500 truncate">{floor.lastactive}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
}

export default ActiveSheetsComp;
