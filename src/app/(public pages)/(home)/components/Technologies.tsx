import Container from "@/sharedComponets/ui/wrapper/Container";
import { HTechnology } from "@/types/data";
import Image from "next/image";
function Technologies({ technologies }: { technologies: HTechnology[] }) {
  return (
    <section className="my-16">
      <Container>
        <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
          <h3 className="text-center middle-border">
            Technologies that we are experts in
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6">
          {technologies?.map((item, idx) => (
            <div
              key={item._id ? (item._id + idx) : idx}
              className="flex flex-col items-center gap-4"
            >
              <Image src={item.icon} alt={item.name} width={80} height={80} />
              <p className="text-xl font-semibold uppercase">{item.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Technologies;
