import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/eureka-logo.jpeg"
        height={36}
        width={36}
        alt="Eureka Logo"
        className="rounded-lg border border-orange-300"
      />
    </Link>
  );
}

export function LogoTitle({
  fontColor = "dark",
  href = "/",
}: {
  fontColor?: "light" | "dark";
  href?: string;
}) {
  return (
    <Link href={href} className="flex items-end gap-x-2">
      <Image src="/favicon.ico" height={36} width={36} alt="Trext Logo" />
      <p
        className={clsx("text-2xl font-medium", {
          "text-secondary": fontColor == "light",
          "": fontColor == "dark",
        })}
      >
        SimpleClip
      </p>
    </Link>
  );
}
