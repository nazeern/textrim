import clsx from "clsx";

export default function Toast({
  children,
  style,
}: {
  children: string | null;
  style: "error" | "success";
}) {
  if (children) {
    return (
      <div
        className={clsx("p-3 mb-4 rounded-lg", {
          "bg-green-200 border border-green-500": style === "success",
          "bg-red-200 border border-red-500": style === "error",
        })}
      >
        <p
          className={clsx({
            "text-green-500": style === "success",
            "text-red-500": style === "error",
          })}
        >
          {children}
        </p>
      </div>
    );
  } else {
    return <></>;
  }
}
