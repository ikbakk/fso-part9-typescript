import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';
const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('pong');
});

app.get('/bmi', (req: Request, res: Response) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res
      .status(400)
      .send({ error: 'Not enough arguments: height(cm), weight(kg)' });
  }

  const heightNumber = Number(height);
  const weightNumber = Number(weight);

  if (isNaN(heightNumber) || isNaN(weightNumber)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }

  const bmi: { height: number; weight: number; bmi: string } = {
    weight: weightNumber,
    height: heightNumber,
    bmi: calculateBmi(heightNumber, weightNumber)
  };

  res.json(bmi);
});

app.post('/exercises', (req: Request, res: Response) => {
  const { daily_exercises, target } = req.body as {
    daily_exercises: string;
    target: number;
  };

  if (!daily_exercises || !target) {
    res
      .status(400)
      .send({ error: 'Not enough arguments: daily_exercises, target' });
  }

  if (isNaN(Number(target))) {
    res
      .status(400)
      .send({ error: '"target" argument is the daily hours target as number' });
  }

  const dailyHours: number[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dailyExercises: number[] = JSON.parse(daily_exercises);
    if (!Array(dailyExercises)) throw new Error();

    dailyExercises.forEach((hour) => {
      if (isNaN(Number(hour))) {
        throw new Error();
      }
      dailyHours.push(Number(hour));
    });
  } catch (error) {
    res.status(400).send({
      error:
        '"daily_exercises" argument is an array of numbers with daily hours of exercise'
    });
  }

  const result: {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: 1 | 2 | 3;
    ratingDescription: string;
    target: number;
    avg: number;
  } = calculateExercise(target, dailyHours);

  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
