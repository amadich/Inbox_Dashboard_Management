import {
   FolderIcon,
   CheckCircleIcon,
   PlayCircleIcon,
   ClockIcon,
   PlusIcon,
 } from '@heroicons/react/24/outline';
 
 export default function DashboardContent() {
   return (
     <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 bg-gray-100">
 
       {/* === STAT CARDS === */}
       <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { title: "Total Projects", value: 24, icon: FolderIcon, color: "bg-green-500" },
           { title: "Ended Projects", value: 10, icon: CheckCircleIcon, color: "bg-blue-500" },
           { title: "Running Projects", value: 12, icon: PlayCircleIcon, color: "bg-yellow-500" },
           { title: "Pending Projects", value: 2, icon: ClockIcon, color: "bg-red-500" },
         ].map((item, index) => (
           <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
             <div className={`p-3 text-white rounded-full ${item.color}`}>
               <item.icon className="h-6 w-6" />
             </div>
             <div>
               <h4 className="text-gray-500 text-sm">{item.title}</h4>
               <p className="text-xl font-bold">{item.value}</p>
             </div>
           </div>
         ))}
       </div>
 
       {/* === REMINDER === */}
       <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
         <div>
           <h4 className="font-semibold mb-2">Meeting Reminder</h4>
           <p className="text-gray-600 mb-4">Meeting with Arc Company<br/>2:00 PM - 4:00 PM</p>
         </div>
         <button className="bg-green-500 text-white py-2 rounded">Start Meeting</button>
       </div>
 
       {/* === PROJECT ANALYTICS === */}
       <div className="bg-white col-span-2 p-4 rounded-lg shadow">
         <h4 className="font-semibold mb-4">Project Analytics</h4>
         <div className="flex justify-between">
           {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
             <div key={i} className="flex flex-col items-center">
               <div className={`h-24 w-8 bg-gray-200 rounded-md flex items-end`}>
                 <div className="w-full bg-green-500 rounded-md" style={{ height: `${Math.random() * 100}%` }}></div>
               </div>
               <span className="mt-2 text-sm text-gray-500">{day}</span>
             </div>
           ))}
         </div>
       </div>
 
       {/* === TEAM COLLABORATION === */}
       <div className="bg-white p-4 rounded-lg shadow">
         <div className="flex justify-between mb-4">
           <h4 className="font-semibold">Team Collaboration</h4>
           <button className="text-blue-500 text-sm flex items-center">
             <PlusIcon className="w-4 h-4 mr-1" /> Add Member
           </button>
         </div>
         <ul className="space-y-3">
           {[
             { name: "Alexandra Deff", task: "GitHub Repo" },
             { name: "Edwin Adenike", task: "User Auth System" },
             { name: "Isaac Oluwatemilorun", task: "Search & Filter" },
             { name: "David Oshodi", task: "Homepage Layout" },
           ].map((member, index) => (
             <li key={index} className="flex justify-between text-sm">
               <span>{member.name}</span>
               <span className="text-gray-500">{member.task}</span>
             </li>
           ))}
         </ul>
       </div>
 
       {/* === PROJECT PROGRESS === */}
       <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-center items-center">
         <h4 className="font-semibold mb-2">Project Progress</h4>
         <div className="relative">
           <svg className="w-32 h-32">
             <circle
               className="text-gray-300"
               strokeWidth="8"
               stroke="currentColor"
               fill="transparent"
               r="50"
               cx="64"
               cy="64"
             />
             <circle
               className="text-green-500"
               strokeWidth="8"
               strokeDasharray="314"
               strokeDashoffset="185"
               strokeLinecap="round"
               stroke="currentColor"
               fill="transparent"
               r="50"
               cx="64"
               cy="64"
             />
           </svg>
           <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">41%</span>
         </div>
       </div>
 
       {/* === PROJECT LIST === */}
       <div className="bg-white p-4 rounded-lg shadow col-span-2">
         <div className="flex justify-between mb-4">
           <h4 className="font-semibold">Projects</h4>
           <button className="text-blue-500 text-sm flex items-center">
             <PlusIcon className="w-4 h-4 mr-1" /> New
           </button>
         </div>
         <ul className="space-y-3 text-sm">
           {[
             { title: "Develop API Endpoints", due: "Nov 26, 2024" },
             { title: "Onboarding Flow", due: "Nov 28, 2024" },
             { title: "Build Dashboard", due: "Nov 30, 2024" },
             { title: "Optimize Page Load", due: "Dec 5, 2024" },
             { title: "Cross-Browser Testing", due: "Dec 6, 2024" },
           ].map((proj, index) => (
             <li key={index} className="flex justify-between">
               <span>{proj.title}</span>
               <span className="text-gray-500">{proj.due}</span>
             </li>
           ))}
         </ul>
       </div>
 
       {/* === TIME TRACKER === */}
       <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
         <h4 className="font-semibold mb-4">Time Tracker</h4>
         <p className="text-3xl font-bold mb-4">01:24:08</p>
         <button className="bg-red-500 text-white py-2 px-4 rounded">Pause</button>
       </div>
 
     </div>
   );
 }
 