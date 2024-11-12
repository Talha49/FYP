import React from 'react'

function About () {
  return (
    <div className='px-6 py-6'>

        <div>
            <p className='text-2xl font-semibold'>Three Month Tentant Improvement</p>
            <p>2330 Butano  Sacramento Country California United States 9280290 99</p>
            <br/><br/><br/>
            <div>
                <h1 className='font-semibold text-2xl'>Active Sheets</h1>
               
                <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
          <div className="bg-white rounded shadow-md p-4 flex gap-4 items-center">
            <img
              src="/floor.jpg"
              alt="Image 2"
              className="w-16 h-16 rounded-sm mb-4"
            />
            <div> 
                <p>Floor Plans 2</p>
            <p>Last updated on 19 July,2019</p>
            </div>

          </div>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
          <div className="bg-white rounded shadow-md p-4 flex gap-4 items-center">
            <img
              src="/floor.jpg"
              alt="Image 2"
              className="w-16 h-16 rounded-sm mb-4"
            />
            <div> 
                <p>Floor Plans 2</p>
            <p>Last updated on 19 July,2019</p>
            </div>

          </div>
        </div>
      </div>
            </div>
        </div>
    </div>
  )
}

export default About




