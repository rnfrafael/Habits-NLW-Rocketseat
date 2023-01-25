import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { ProgressBar } from "./ProgressBar";
import dayjs from "dayjs";
import { HabitList } from "./HabitList";

interface HabitDayProps {
  date: Date;
  completed?: number;
  amount?: number;
}

export function HabitDay({ completed = 0, amount = 0, date }: HabitDayProps) {
  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;
  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          "w-10 g-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg",
          {
            "bg-violet-500 boder-violet-400": completedPercentage >= 80,
            "bg-violet-600 boder-violet-500":
              completedPercentage >= 60 && completedPercentage < 80,
            "bg-violet-700 boder-violet-500":
              completedPercentage >= 40 && completedPercentage < 60,
            "bg-violet-800 boder-violet-600":
              completedPercentage >= 20 && completedPercentage < 40,
            "bg-violet-900 boder-violet-700":
              completedPercentage > 0 && completedPercentage < 20,
            "bg-zinc-900 boder-zinc-800": completedPercentage == 0,
          }
        )}
      />
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>
          <ProgressBar progress={completedPercentage} />

          <HabitList />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
