import { Vacancy } from "../page";

function CareerCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <div className="w-[335px] h-[200px] flex flex-col justify-center gap-4 p-4 dark:shadow dark:shadow-white dark:hover:shadow-md dark:hover:shadow-slate-600 duration-300 shadow-md shadow-slate-300 hover:shadow rounded-xl border border-[#aa013f] dark:border-transparent text-center">
      <h6 className="!text-2xl font-semibold">{vacancy.title}</h6>
      <p className="uppercase text-[#aa013f] font-semibold">Vacancy : {vacancy.vacancy}</p>
    </div>
  );
}

export default CareerCard;
