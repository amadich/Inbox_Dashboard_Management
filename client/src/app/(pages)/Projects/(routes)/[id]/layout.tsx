import AccessTasks from "@/components/authUsers/AccessTasks";


export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
   const { id } = await params;
   return (
      <>
         <AccessTasks children={children}  projectId={id} ></AccessTasks>
      </>
   );
}