import timetableImg from "@assets/시간표_1782723949343.png";

export function TimetableCard() {
  return (
    <img
      src={timetableImg}
      alt="시간표"
      className="w-full h-full object-contain drop-shadow-xl"
    />
  );
}
