import { LogoTitle } from "./logo";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import NavLinks from "@/app/ui/sidenav-links";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-end justify-start rounded-md bg-primary p-4 md:h-40">
        <LogoTitle fontColor="light" />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action="/auth/signout" method="post">
          <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium 
            hover:bg-primarybg hover:text-primary
            md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowLeftStartOnRectangleIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
