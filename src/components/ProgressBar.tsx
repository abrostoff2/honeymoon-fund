import { config } from "@/config";

export default function ProgressBar() {
  const { goalAmount, currentAmount } = config.fund;

  if (goalAmount <= 0) return null;

  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const formattedCurrent = currentAmount.toLocaleString();
  const formattedGoal = goalAmount.toLocaleString();

  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-sm text-[#2C2C2C]/60">
        <span>${formattedCurrent} raised</span>
        <span>${formattedGoal} goal</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#2C2C2C]/10">
        <div
          className="animate-progress h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: config.theme.primaryColor,
          }}
        />
      </div>
    </div>
  );
}
