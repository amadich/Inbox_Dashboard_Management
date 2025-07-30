import Announcement from "./Announcement";
import Main_Drawer from "./Main_Drawer";
import Main_Header from "./Main_Header";
import '@/assets/styles/Main_Header.css';

export default function MainHeaderContents({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        
          <Main_Drawer />
        
        <div className=" w-[80%] flex-1">
          <Main_Header />
          {/* Other content can go here */}
          {children}
          <Announcement />
        </div>
      </div>
    </>
  );
}
