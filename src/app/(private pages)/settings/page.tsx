import React from "react";
import PrivatePageWrapper from "../components/PrivatePageWrapper";
import { getMainHeaderData } from "@/utils/pageData";
import { IMainHeader } from "@/types/componentsType";
import Image from "next/image";

export default async function SettingsPage() {
  const mainHeaderData = (await getMainHeaderData()) as IMainHeader;
  return (
    <PrivatePageWrapper>
      <section className="w-full">
        <h3 className="text-center mt-2 font-semibold">Customize your site</h3>
        <div className="grid min-h-[calc(100vh-200px)] place-items-center">
          <div className="max-w-[880px] mx-auto px-2">
            <h4 className="mt-5">
              This is the content customization dashboard for:
            </h4>
            <div className="flex flex-col justify-center items-center mt-4">
              <Image
                className="dark:hidden"
                src={mainHeaderData?.logo?.black}
                height={400}
                width={400}
                alt="Webtricker Logo"
              />
              <Image
                className="hidden dark:block"
                src={mainHeaderData?.logo?.white}
                height={400}
                width={400}
                alt="Webtricker Logo"
              />
            </div>
            <div className="flex items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
              </svg>
              <h5>
                Pick any components from the sidebar and customize them
                according to your needs.
              </h5>
            </div>
          </div>
        </div>
      </section>
    </PrivatePageWrapper>
  );
}
