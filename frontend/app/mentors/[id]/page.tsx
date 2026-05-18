"use client";

import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
      const userId = parseInt(localStorage.getItem("userId") || "0");
      await api.post(
        "/coffeechats",
        { timeSlotId, menteeId: userId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      alert("Reservation success");
      setSlots((prev) => prev.filter((slot) => slot.id !== timeSlotId));
    } catch (error) {
      console.error(error);
      alert("Reservation failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">멘토 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">멘토를 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        {/* Mentor Profile */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {mentor.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{mentor.name}</h1>
              {mentor.headline && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {mentor.headline}
                </p>
              )}
            </div>
          </div>

          {mentor.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {mentor.bio}
            </p>
          )}

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
        </div>

        {/* Time Slots */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            예약 가능한 슬롯
          </h2>

          {slots.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-gray-400">
                현재 예약 가능한 슬롯이 없어요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(slot.startTime).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(slot.startTime).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReserve(slot.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-lg transition"
                  >
                    예약하기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
