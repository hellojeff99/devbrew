"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Slot = {
  id: number;
  date: string;
  start: string;
  end: string;
};

type ApiSlot = {
  id: number;
  mentorId: number;
  startTime: string;
  isReserved: boolean;
  createdAt: string;
};

export default function SlotsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [slots, setSlots] = useState<Slot[]>([]);
  const handleAddSlot = async () => {
    // 12시간 → 24시간 변환
    let h = parseInt(hour, 10);

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    const hh = String(h).padStart(2, "0");

    const localDateTime = new Date(`${date}T${hh}:${minute}:00`);
    const isoString = localDateTime.toISOString();

    try {
      const response = await api.post(
        "/time-slots",
        {
          startTime: isoString,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      const data = response.data;

      const startDate = new Date(data.startTime);

      const newSlot = {
        id: data.id,
        date: data.startTime.slice(0, 10),
        start: startDate.toTimeString().slice(0, 5),
        end: new Date(startDate.getTime() + 60 * 60 * 1000)
          .toTimeString()
          .slice(0, 5),
      };

      setSlots((prev) => [...prev, newSlot]);
    } catch (error) {
      console.error(error);
      alert("슬롯 생성 실패");
    }
  };

  const handleDelete = (id: number) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const userId: number = parseInt(localStorage.getItem("userId") || "0");

        const response = await api.get(`/time-slots/${userId}`);
        const data: ApiSlot[] = response.data;

        const parsed = data.map((slot) => {
          const startDate = new Date(slot.startTime);

          return {
            id: slot.id,
            date: slot.startTime.slice(0, 10),
            start: startDate.toTimeString().slice(0, 5),
            end: new Date(startDate.getTime() + 60 * 60 * 1000)
              .toTimeString()
              .slice(0, 5),
          };
        });

        setSlots(parsed);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900">타임슬롯 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            멘토링 가능한 시간을 등록하세요
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-900">새 슬롯 추가</p>

          <div className="flex flex-col gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500
             placeholder:text-gray-400"
            />

            <div className="flex gap-2">
              {/* Hour */}
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-2 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const h = String(i + 1).padStart(2, "0");
                  return (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  );
                })}
              </select>

              {/* Minute */}
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-2 text-sm"
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>

              {/* AM/PM */}
              <select
                value={ampm}
                onChange={(e) => setAmpm(e.target.value as "AM" | "PM")}
                className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-2 py-2 text-sm"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <button
              onClick={handleAddSlot}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition"
            >
              1시간 슬롯 추가
            </button>
          </div>
        </div>

        {/* Slot List */}
        <div className="flex flex-col gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {slot.date}
                </p>
                <p className="text-xs text-gray-500">
                  {slot.start} ~ {slot.end}
                </p>
              </div>

              <button
                onClick={() => handleDelete(slot.id)}
                className="text-xs text-gray-400 hover:text-red-500"
              >
                삭제
              </button>
            </div>
          ))}

          {slots.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-10">
              아직 등록된 슬롯이 없어요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
