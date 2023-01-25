import { FormEvent, useState } from "react";
import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import PreviousMap from "postcss/lib/previous-map";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [tittle, setTittle] = useState<string>("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();
    if (!tittle || weekDays.length == 0) return;

    await api.post("/habits", { tittle, weekDays });
    setTittle("");
    setWeekDays([]);
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter((day) => day !== weekDay);
      setWeekDays(weekDaysWithRemovedOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeekDays(weekDaysWithAddedOne);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="tittle" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>
      <input
        className="p-4 rouded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        type="text"
        id="tittle"
        value={tittle}
        placeholder="ex.: Exercícios, dormir bem, etc..."
        autoFocus
        onChange={(event) => setTittle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>
      {availableWeekDays.map((weekDay, index) => {
        return (
          <Checkbox.Root
            key={weekDay}
            className="flex items-center gap-3 group"
            checked={weekDays.includes(index)}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-600">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className=" text-white leading-tight">{weekDay}</span>
          </Checkbox.Root>
        );
      })}

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
