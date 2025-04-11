import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function Drawer() {
  return (
    <Sheet>
      <SheetTrigger className="flex m-auto items-center cursor-pointer">
        <Menu />{" "}
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[200px]">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default Drawer;
