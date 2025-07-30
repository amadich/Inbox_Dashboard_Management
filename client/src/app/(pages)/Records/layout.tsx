import HasAccess from "@/components/authUsers/HasAccess";


export default function Layout({children,}: Readonly<{children: React.ReactNode;}>) {
   return (
      <>
         <HasAccess children={children}></HasAccess>
      </>
   );
}