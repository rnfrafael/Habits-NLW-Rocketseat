import {
  TouchableOpacity,
  Dimensions,
  TouchableOpacityProps,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";

const weekDays = 7;
const screenHorizontalPadding = (32 * 2) / 5;

export const dayMarginBetween = 8;
export const daySize =
  Dimensions.get("screen").width / weekDays - (screenHorizontalPadding + 5);

interface Props extends TouchableOpacityProps {
  amountOfHabits?: number;
  completed?: number;
  date: Date;
}

export function HabitDay({
  amountOfHabits = 0,
  completed = 0,
  date,
  ...rest
}: Props) {
  const percentageCompleted =
    amountOfHabits > 0 ? Math.round((completed / amountOfHabits) * 100) : 0;
  const today = dayjs().startOf("day").toDate();
  const isCurrentDay = dayjs(date).isSame(today);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx("rounded-lg border-2 m-1", {
        ["bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"]:
          amountOfHabits === 0,
        ["bg-zinc-900 border-zinc-800"]: percentageCompleted === 0,
        ["bg-violet-900 border-violet-700"]:
          percentageCompleted > 0 && percentageCompleted <= 20,
        ["bg-violet-800 border-violet-600"]:
          percentageCompleted > 20 && percentageCompleted <= 40,
        ["bg-violet-700 border-violet-500"]:
          percentageCompleted > 40 && percentageCompleted <= 60,
        ["bg-violet-600 border-violet-400"]:
          percentageCompleted > 60 && percentageCompleted <= 80,
        ["bg-violet-500 border-violet-300"]: percentageCompleted > 80,
        ["border-white border-2"]: isCurrentDay,
      })}
      style={{ width: daySize, height: daySize }}
      {...rest}
    />
  );
}
