/* eslint-disable @typescript-eslint/no-explicit-any */
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ui/Shared/ExploreBtn";

const URL = process.env.NEXT_PUBLIC_URL;
export default async function Page() {
  let events: any[] = [];

  try {
    const res = await fetch(`${URL}/api/events`);

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    const data = await res.json();

    events = Array.isArray(data) ? data : data.events || [];

    events = events.map((ev: any) => ({
      ...ev,
      _id:
        ev &&
        ev._id &&
        typeof ev._id === "object" &&
        typeof ev._id.toString === "function"
          ? ev._id.toString()
          : String(ev._id),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  // Show friendly message if no events
  if (events.length === 0) {
    return (
      <section className="min-h-screen text-center py-20">
        <h1 className="text-4xl font-bold mb-4">
          The Hub for Developer Events You Can&apos;t Miss
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Hackathons, conferences, and meetups all in one place.
        </p>
        <ExploreBtn />
        <p className="mt-20 text-lg text-muted-foreground">
          No events available right now. Check back soon!
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          The Hub for Developer <br /> Events You Can&apos;t Miss
        </h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Hackathons, conferences, and meetups all in one place.
        </p>
        <div className="mt-8">
          <ExploreBtn />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10">Featured Events</h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <li key={event._id.toString()}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
