import React from 'react';
import { Camera, Clock, Download, Clipboard } from 'lucide-react';

const About = () => {
  return (

    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 px-4">
      {/* Left Section */}
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Revolutionize Remote Site Management and Safety with SIJMS
        </h1>
        <p className="text-lg text-gray-600">
          SIJMS is designed to empower industries in construction, manufacturing, and utilities with advanced, data-driven tools for managing and monitoring remote sites. From real-time task tracking to 360-degree site visualization, SIJMS simplifies complex operations, ensuring safety compliance, streamlined workflows, and enhanced decision-making—all in one powerful platform.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
          Get Started Today
        </button>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center animate-fade-in-down">
        <img src='/images/hero-image.jpeg' alt='img' className='h-[400px] rounded-full shadow-lg'/>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-20 px-6 md:px-20 bg-neutral-100 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-4">
        <Camera size={48} className="text-blue-600" />
        <h3 className="text-xl font-medium text-gray-900">
          Centralized Management
        </h3>
        <p className="text-gray-600">
          Easily oversee multiple sites with streamlined workflows and task prioritization in a single platform.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-4">
        <Clock size={48} className="text-blue-600" />
        <h3 className="text-xl font-medium text-gray-900">
          Real-Time Data & Analytics
        </h3>
        <p className="text-gray-600">
          Gain actionable insights on resource allocation, task progress, and site safety with live reporting tools.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-4">
        <Download size={48} className="text-blue-600" />
        <h3 className="text-xl font-medium text-gray-900">
          360-Degree Site Visualization
        </h3>
        <p className="text-gray-600">
          Experience full-site views, enabling managers to assess job site conditions remotely.
        </p>
      </div>
      <div className="flex flex-col items-center text-center space-y-4">
        <Clipboard size={48} className="text-blue-600" />
        <h3 className="text-xl font-medium text-gray-900">
          Mobile Accessibility
        </h3>
        <p className="text-gray-600">
          Stay connected on the go. Monitor tasks, assign responsibilities, and track progress from anywhere.
        </p>
      </div>
    </div>

    <div className=" py-20 px-6 md:px-20 animate-fade-in-up">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Empowering Industries, Improving Outcomes
        </h2>
        <p className="text-lg text-gray-600">
          SIJMS brings measurable value to both stakeholders and on-site workers, improving operational efficiency, safety, and collaboration across dispersed teams.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl font-bold text-blue-600">10+</span>
            <h4 className="text-xl font-medium text-gray-900">
              Years of Experience
            </h4>
            <p className="text-gray-600">
              Trusted by industry leaders for over a decade.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl font-bold text-blue-600">95%</span>
            <h4 className="text-xl font-medium text-gray-900">
              Improvement in Efficiency
            </h4>
            <p className="text-gray-600">
              Streamlined workflows and real-time insights.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl font-bold text-blue-600">99.9%</span>
            <h4 className="text-xl font-medium text-gray-900">
              Uptime Guarantee
            </h4>
            <p className="text-gray-600">
              Reliable and secure platform for your operations.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-8 py-20 px-6 md:px-20 animate-fade-in">
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How It Works
        </h2>
        <p className="text-lg text-gray-600">
          SIJMS combines the power of computer vision, data analytics, and 360-degree visual reporting to bring a centralized approach to job site monitoring. Designed for industries managing remote sites, SIJMS provides real-time insights that reduce risks, optimize resource use, and improve efficiency.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Camera size={24} />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900">
                Set Up & Configure
              </h4>
              <p className="text-gray-600">
                Get started with a customizable setup to match your job site needs and priorities.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900">
                Assign & Monitor Tasks
              </h4>
              <p className="text-gray-600">
                Easily assign tasks and monitor their progress with real-time status updates.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Clipboard size={24} />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900">
                Data Analytics & Alerts
              </h4>
              <p className="text-gray-600">
                Receive instant notifications and alerts for task completions and safety concerns.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Download size={24} />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900">
                Visualize & Report
              </h4>
              <p className="text-gray-600">
                View comprehensive site data and share reports for seamless collaboration and oversight.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img src="/images/engineer.jpeg" alt="img" className='rounded-full shadow-xl ml-5' />
      </div>
    </div>


    <div className="py-20 px-6 md:px-20 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Get Started with SIJMS
        </h2>
        <p className="text-lg text-gray-600">
          Ready to take your remote site management to the next level? Contact us today to schedule a personalized demonstration and learn how SIJMS can transform your operations.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300">
          Request a Demo
        </button>
      </div>
    </div>
    </div>
  )}

export default About