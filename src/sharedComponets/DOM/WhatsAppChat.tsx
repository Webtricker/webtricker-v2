import Image from "next/image";
import Link from "next/link";
import whatsAppImg from "@/assets/images/home/whatsapp.png";

function WhatsAppChat() {
  return (
    <>
      <div className="whatsApp-chat  md:block hidden">
        <Link
          href="https://wa.me/8801712377577"
          target="_blank"
          rel="noreferrer"
          aria-label="whatsapp redirect link"
        >
          <Image width={50} height={50} src={whatsAppImg.src} alt="whatsApp" />
        </Link>
      </div>
    </>
  );
}

export default WhatsAppChat;
