"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">멘토 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">멘토 찾기</h1>
          <p className="text-sm text-gray-500 mt-1">
            커피챗으로 실무 이야기를 들어보세요
          </p>
        </div>

        {/* Mentor List */}
        <div className="flex flex-col gap-3">
          {mentors.map((mentor) => (
            <Link
              key={mentor.id}
              href={`/mentors/${mentor.id}`}
              className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-rose-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {mentor.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {mentor.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {mentor.headline ?? "—"}
                  </div>
                </div>
              </div>

              {mentor.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mentor.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
