import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import NoBlogFoundMsg from "@/app/(public pages)/blog/[slug]/components/NoBlogFoundMsg";
import { ITeamInfo } from "@/types/data";
import TeamUpdateForm from "./components/TeamUpdateForm";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import Container from "@/sharedComponets/ui/wrapper/Container";

const getTeamData = async (slug: string) => {
  // You can fetch data here on the server f
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/${slug}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error, " Error fetching data");
  }
  return null;
};

export default async function SingleTeamInfoPage({ params }) {
  const { id } = await params;

  const data = await getTeamData(id);
  if (!data?.teamData)
    return <NoBlogFoundMsg msg="No team found" key="TEAM_INFO_MSG" />;
  const teamData = data.teamData || ({} as ITeamInfo);
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="UPDATE" title="UPDATE" />
          <Link href="/settings/teams/add">
            <Button className="!py-2.5 whitespace-nowrap" label="Add Team" />
          </Link>
        </section>
        <section className="section-speacing mt-10  grow h-full ">
        <Container className="w-full justify-center flex items-center">
            <TeamUpdateForm member={teamData} />
        </Container>
        </section>
        </main>
    </PrivatePageWrapper>
  );
}
