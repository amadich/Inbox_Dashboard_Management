export default function UserTable() {
   const users = [
     { name: "John Doe", email: "john@example.com", status: "Active" },
     { name: "Jane Smith", email: "jane@example.com", status: "Pending" },
   ];
 
   return (
     <div className="bg-white p-6 rounded shadow mt-6">
       <div className="flex justify-between mb-4">
         <h2 className="text-lg font-semibold">Users</h2>
         <button className="bg-blue-500 text-white px-4 py-2 rounded">+ Add User</button>
       </div>
       <table className="w-full table-auto">
         <thead>
           <tr className="bg-gray-100">
             <th className="p-2 text-left">Name</th>
             <th className="p-2 text-left">Email</th>
             <th className="p-2 text-left">Status</th>
           </tr>
         </thead>
         <tbody>
           {users.map((user, index) => (
             <tr key={index} className="border-b">
               <td className="p-2">{user.name}</td>
               <td className="p-2">{user.email}</td>
               <td className="p-2">{user.status}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
 }
 