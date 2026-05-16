"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { api } from "@/lib/api";

type Mentor = {
  id: number;
  name: string;
  headline: string | null;
  bio: string | null;
  techStack: string[];
};

type TimeSlot = {
  id: number;
  startTime: string;
};

export default function MentorDetailPage() {
  const params = useParams();

  const mentorId = Number(params.id);

  const [mentor, setMentor] = useState<Mentor | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorResponse, slotsResponse] = await Promise.all([
          api.get<Mentor>(`/mentors/${mentorId}`),

          api.get<TimeSlot[]>(`/time-slots/${mentorId}`),
        ]);

        setMentor(mentorResponse.data);

        setSlots(slotsResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [mentorId]);

  const handleReserve = async (timeSlotId: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await api.post(
        "/coffeechats",
        {
          timeSlotId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      alert("Reservation success");

      setSlots((prev) => prev.filter((slot) => slot.id !== timeSlotId));
    } catch (error) {
      console.error(error);

      alert("Reservation failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mentor) {
    return <div>Mentor not found</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">{mentor.name}</h1>

        <div>{mentor.headline}</div>

        <div className="mt-2">{mentor.bio}</div>

        <div className="mt-2">{mentor.techStack.join(", ")}</div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Available Slots</h2>

        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center justify-between border rounded p-3"
          >
            <div>{new Date(slot.startTime).toLocaleString()}</div>

            <button
              onClick={() => handleReserve(slot.id)}
              className="border px-3 py-1 rounded"
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
