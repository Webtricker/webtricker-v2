import Link from "next/link";
import Image from "next/image";

export type CareerCardItem = {
  slug: string;
  title: string;
  vacancyCount: number;
  ogImage?: string;
  ogImageAlt?: string;
};

function CareerCard({ vacancy }: { vacancy: CareerCardItem }) {
  const imageSrc = vacancy.ogImage || "/images/career/career-hero-team.png";

  return (
    <Link href={`/career/${vacancy.slug}`} className="w-[335px] min-h-[360px] overflow-hidden flex flex-col dark:shadow dark:shadow-white dark:hover:shadow-md dark:hover:shadow-slate-600 duration-300 shadow-md shadow-slate-300 hover:shadow rounded-xl border border-[#aa013f] dark:border-transparent bg-white">
      <div className="relative h-[170px] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={vacancy.ogImageAlt || vacancy.title}
          width={670}
          height={340}
          className="h-full w-full object-cover duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4 p-4 text-center">
        <h6 className="!text-2xl font-semibold">{vacancy.title}</h6>
        <p className="uppercase text-[#aa013f] font-semibold">Vacancy : {vacancy.vacancyCount}</p>
      </div>
    </Link>
  );
}

export default CareerCard;
