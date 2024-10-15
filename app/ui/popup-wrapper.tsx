import { Dispatch, SetStateAction } from "react";

export function PopupWrapper({
  children,
  setVisible,
}: {
  children: React.ReactNode;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setVisible(false)}
    >
      {children}
    </div>
  );
}
