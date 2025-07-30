import CheckRoleUser from "@/components/authUsers/CheckRoleUser";


export default function Layout({children,}: Readonly<{children: React.ReactNode;}>) {
   return (
      <>
         <CheckRoleUser children={children}></CheckRoleUser>
      </>
   );
}