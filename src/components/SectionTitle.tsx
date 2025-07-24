export default function SectionTitle({ emoji, text }: { emoji: string; text: string }) {
  return (
    <h2 className="text-3xl font-bold text-center text-[#2E2312]">{emoji} {text}</h2>
  );
}