import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ui/Shared/ExploreBtn";
import { events } from "@/lib/constants";

const page = () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Developer <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, conferences, and meetups all in one place.
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Features Events</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard key={event.id} {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
