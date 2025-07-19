import { X } from "lucide-react";
import { Button, Dialog } from "@radix-ui/themes";
import PaymentFlow from "./forms/PaymentFlow";

export const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog.Root
    open={open}
    onOpenChange={(open) => {
      if (!open) {
        onClose?.();
      }
    }}
  >
    <Dialog.Content
      className="relative w-[600px] h-auto"
      onInteractOutside={(e) => e.preventDefault()}
    >
      <Dialog.Title>Información del pago</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Información del pago
      </Dialog.Description>
      <PaymentFlow />
      <div className=" flex justify-center absolute top-4 right-4">
        <Dialog.Close className="absolute top-0 right-0">
          <Button variant="ghost">
            <X />
          </Button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  </Dialog.Root>
);