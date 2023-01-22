import { prisma } from "../db/prisma";
import { FastifyInstance } from "fastify";
import { symbol, z } from "zod";
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

  app.patch("/habits/:id/toggle", async (req, res) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(req.params);
    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({ data: { date: today } });
    }

    const dayHabitCompleted = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    if (dayHabitCompleted) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabitCompleted.id,
        },
      });
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });

  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id,
        D.date,
        (
          SELECT
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT 
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount      
        FROM days D
    `;
    return summary;
  });
}
