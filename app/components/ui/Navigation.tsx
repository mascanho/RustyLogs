import { Menu } from "lucide-react";
import UploadButton from "./UploadButton";
import { ModeToggle } from "./ThemeToggle";
import Drawer from "./Drawer";

function Navigation() {
  return (
    <div className="p-2 dark:text-white text-black flex justify-between fixed top-0 border-b bg-white z-50 w-full shadow-xs">
      <section className="flex items-center bg-white">
        <Drawer />
        <span className="ml-2">RustyLogs</span>
      </section>
      <section className="flex items-center">
        <ModeToggle />
        <UploadButton />
      </section>
    </div>
  );
}

export default Navigation;
