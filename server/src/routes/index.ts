import { prisma } from "../db/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.get("/todos", async (req, res) => {
    return await prisma.habit.findMany();
  });
  app.post("/habits", async (req, res) => {
    const createHabitBody = z.object({
      tittle: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });
    const { tittle, weekDays } = createHabitBody.parse(req.body);
    const day = dayjs().startOf("day").toDate();
    console.log(day);

    const result = await prisma.habit.create({
      data: {
        tittle,
        created_at: day,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return { week_day: weekDay };
          }),
        },
      },
    });
    return result;
  });

  app.get("/day", async (req, res) => {
    const dayParam = z.object({
      date: z.coerce.date(),
    });
    const { date } = dayParam.parse(req.query);
    const weekDay = dayjs(date).get("day");
    const dateObject = dayjs(date).startOf("day");

    console.log(date);
    console.log(dateObject);

    //Pegar os hábitos até o dia passado pela query
    //Pegar os hábitos completos desse mesmo dia

    const habitsOnDay = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: dateObject.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    });

    return { habitsOnDay, completedHabits };
  });
}
