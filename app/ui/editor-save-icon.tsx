import { SavingState } from "../MainEditor";
import {
  CloudArrowUpIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function EditorSaveIcon({
  savingToCloud,
}: {
  savingToCloud: SavingState;
}) {
  if (savingToCloud == SavingState.SAVED) {
    return (
      <div className="absolute -top-7 right-2 flex items-center gap-x-1 text-gray-500">
        <p>Saved</p>
        <DocumentCheckIcon className="size-5" />
      </div>
    );
  } else if (
    savingToCloud == SavingState.CHANGED ||
    savingToCloud == SavingState.SAVING
  ) {
    return (
      <div className="absolute -top-7 right-2 flex items-center gap-x-1 text-gray-500">
        <p>Saving</p>
        <CloudArrowUpIcon className="animate-pulse size-6" />
      </div>
    );
  }
}
