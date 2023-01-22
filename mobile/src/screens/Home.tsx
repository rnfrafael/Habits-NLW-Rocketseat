import { View, Text, ScrollView } from "react-native";

import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const miinimumSummaryDatesSize = 18 * 6;
const amountOfDaysToFill = miinimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
  return (
    <View className="flex-1 bg-background px-8 py-16">
      <Header />
      <View className="flex-row bg-background mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: daySize }}
            key={`${weekDay}-${i}`}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay key={date.toString()} />
          ))}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, i) => (
              <View
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: daySize, height: daySize }}
              ></View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
