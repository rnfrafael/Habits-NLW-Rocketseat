import { View, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateRangeDatesFromYearStart();
const miinimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = miinimumSummaryDatesSize - datesFromYearStart.length;

type summaryProps = Array<{
  date: string;
  amount: number;
  completed: number;
  id: string;
}>;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<summaryProps | null>(null);
  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get("/summary");
      setSummary(res.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar hábitos");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
        {/* Aqui são gerados os quadrados/hábitos via map desde o inicio do ano */}
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  completed={dayWithHabits?.completed}
                  key={date.toString()}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}
            {/* Aqui são gerados os quadrados/hábitos faltantes para completar o mínimo de quadrados na tela */}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                <View
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: daySize, height: daySize }}
                ></View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
