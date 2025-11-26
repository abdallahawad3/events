import type { EventItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

const EventCard: FC<EventItem> = ({
  title,
  image,
  date,
  location,
  slug,
  time,
}) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster w-full h-auto rounded-md"
      />
      <div className="flex items-center gap-2">
        <Image
          src="/icons/pin.svg"
          alt="Location Icon"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>

      <div className="datetime">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/calendar.svg"
            alt="Calendar Icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/icons/clock.svg"
            alt="Clock Icon"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
