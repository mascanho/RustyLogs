import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function UploadButton() {
  return (
    <Dialog>
      <DialogTrigger className="border h-6 text-xs dark:bg-amber-900 px-3 cursor-pointer hover:bg-blue-500 rounded-xs hover:text-white active:scale-95 transition-all delay-75  ease-out">
        Upload Logs
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
