import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorMap = {
  blue: "bg-blue-600/20 text-blue-400",
  green: "bg-green-600/20 text-green-400",
  yellow: "bg-yellow-600/20 text-yellow-400",
  red: "bg-red-600/20 text-red-400",
  purple: "bg-purple-600/20 text-purple-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
