import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

interface IProps {
  title: string;
  image: string;
}

const EventCard: FC<IProps> = ({ title, image }) => {
  return (
    <Link href={`/events`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <p className="title">{title}</p>
    </Link>
  );
};

export default EventCard;
