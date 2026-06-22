import Link from "next/link";

export type CareerCardItem = {
  slug: string;
  title: string;
  vacancyCount: number;
};

function CareerCard({ vacancy }: { vacancy: CareerCardItem }) {
  return (
    <Link href={`/career/${vacancy.slug}`} className="w-[335px] h-[200px] flex flex-col justify-center gap-4 p-4 dark:shadow dark:shadow-white dark:hover:shadow-md dark:hover:shadow-slate-600 duration-300 shadow-md shadow-slate-300 hover:shadow rounded-xl border border-[#aa013f] dark:border-transparent text-center">
      <h6 className="!text-2xl font-semibold">{vacancy.title}</h6>
      <p className="uppercase text-[#aa013f] font-semibold">Vacancy : {vacancy.vacancyCount}</p>
    </Link>
  );
}

export default CareerCard;
