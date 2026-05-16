"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { api } from "@/lib/api";

type Mentor = {
  id: number;
  email: string;
  name: string;
  headline: string | null;
  bio: string | null;
  techStack: string[];
};

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get<Mentor[]>("/mentors");

        setMentors(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMentors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Mentors</h1>

      {mentors.map((mentor) => (
        <Link
          key={mentor.id}
          href={`/mentors/${mentor.id}`}
          className="border p-4 rounded"
        >
          <div className="font-semibold">{mentor.name}</div>

          <div>{mentor.headline}</div>

          <div>{mentor.techStack.join(", ")}</div>
        </Link>
      ))}
    </div>
  );
}
