import { Button } from "@/components/ui/button";

type DeleteTaskConfirmationProps = {
  taskTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteTaskConfirmation({
  taskTitle,
  onCancel,
  onConfirm,
}: DeleteTaskConfirmationProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        aria-describedby="delete-task-description"
        className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]"
      >
        <h2 id="delete-task-title" className="text-lg font-bold text-[#0F172A]">Delete this task?</h2>
        <p id="delete-task-description" className="mt-2 text-sm leading-6 text-[#64748B]">
          Are you sure you want to delete “{taskTitle}”? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="rounded-lg border-[#E2E8F0] bg-white px-4 py-2 text-[#475569] hover:bg-[#F8FAFC]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="rounded-lg bg-[#B42318] px-4 py-2 text-white hover:bg-[#912018] focus-visible:outline-[#B42318]"
          >
            Delete Task
          </Button>
        </div>
      </section>
    </div>
  );
}
