import TasksPage from "@/app/(pages)/Tasks/page"
import CertainMembers from "@/app/components/Projects/CertainMembers";
import LoadingShow from "@/components/LoadingShow";
import BtnAddTeam from "@/app/(pages)/Projects/(routes)/[id]/components/BtnAddTeam";


export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
   const { id } = await params
   
   if (!id) {
      const error_msg = "Project ID not found.";
      return (
         <>
         <LoadingShow msg={error_msg} />
         </>
      )
   }


   return (
      <>
         
         {/* BUTTONS */}
         <div className="flex items-center justify-between  border-t  p-4">
            <div>
               <h1 className="text-xl font-semibold text-blue-500">جميع المهام</h1>
               <p className="text-gray-600 text-xs">جميع المهام الحالية يتم تنفيذها من قبل جميع المصممين.</p>
            </div>

            <div className="flex items-center space-x-4">
            
                  <CertainMembers projectId={id} />
                  <BtnAddTeam projectId={id}></BtnAddTeam>

            </div>

         </div>
         
         {/* Show The Kanban  */}
         <TasksPage projectId={id} />
      </>
   )
 }