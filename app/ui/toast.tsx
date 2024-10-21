import clsx from "clsx";

export default function Toast({
  children,
  style,
}: {
  children: JSX.Element | string | null;
  style: "error" | "success" | "base";
}) {
  if (children) {
    return (
      <div
        className={clsx("p-3 mb-4 w-full rounded-lg", {
          "bg-green-200 border border-green-500 text-green-500":
            style === "success",
          "bg-red-200 border border-red-500 text-red-500": style === "error",
          "bg-primary border border-primarybg text-onprimary": style === "base",
        })}
      >
        {children}
      </div>
    );
  } else {
    return <></>;
  }
}
