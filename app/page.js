import About from "./_components/About/About";


export default function Home() {
  return (
    <main className="md:ml-0 ml-4">
     
     
       {/* <div className='w-[100%] flex gap-5'>
             <div className='w-auto '>
                   <SideNav />
             </div>
             <div className='w-full overflow-y-auto'>
                        <About/>
             </div> 
       </div> */}
      
      <About/>


    </main>

  );
}
