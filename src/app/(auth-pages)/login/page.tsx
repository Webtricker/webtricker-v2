import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import LoginForm from "./components/LoginForm";
import SiteLogoLong from "@/sharedComponets/ui/logos/SiteLogoLong";
import { getMainHeaderData } from "@/utils/pageData";
import { IMainHeader } from "@/types/componentsType";

export default async function LoginPage() {
  const mainHeaderData = (await getMainHeaderData()) as IMainHeader;
  return (
    <main className="w-full z-0">
      <div
        className={`relative w-full mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]`}
      >
        <Container>
          <div className="w-full max-w-[500px] mx-auto">
            <LoginForm>
              <SiteLogoLong
                logos={{
                  white: mainHeaderData?.logo?.white,
                  black: mainHeaderData?.logo?.black,
                }}
              />
            </LoginForm>
          </div>
        </Container>
      </div>
    </main>
  );
}
