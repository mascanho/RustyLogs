import { Menu } from "lucide-react";
import UploadButton from "./UploadButton";

function Navigation() {
  return (
    <div className="p-2 dark:text-white text-black flex justify-between">
      <Menu />
      <UploadButton />
    </div>
  );
}

export default Navigation;
