type rating = 1 | 2 | 3;
interface result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: rating;
  ratingDescription: string;
  target: number;
  avg: number;
}

const calculateExercise = (target: number, dailyHr: number[]): result => {
  const sumHours: number = dailyHr.reduce((total, hours) => total + hours);
  const avg: number = sumHours / dailyHr.length;

  let rating: rating = 1;
  if (avg >= target - 1) rating = 2;
  if (avg >= target) rating = 3;
  const ratingDescription: { [key: number]: string } = {
    1: 'a little far from the target ',
    2: 'not too bad but could be better ',
    3: 'goal accomplished '
  };
  return {
    periodLength: dailyHr.length,
    trainingDays: dailyHr.filter((hours) => hours > 0).length,
    success: rating === 3,
    rating,
    ratingDescription: ratingDescription[rating],
    target: target,
    avg
  };
};

interface safeValues {
  targetDailyHours: number;
  dailyHours: number[];
}

const checkArguments = (args: Array<string>): safeValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (isNaN(Number(args[2]))) {
    throw new Error('First argument is the target of daily hours as number');
  }

  const dailyHoursArgs: string[] = args.slice(3);
  const dailyHours: number[] = [];

  dailyHoursArgs.forEach((hour) => {
    if (isNaN(Number(hour))) {
      throw new Error('Provided values were not numbers!');
    }
    dailyHours.push(Number(hour));
  });

  return {
    targetDailyHours: Number(args[2]),
    dailyHours
  };
};

try {
  const { targetDailyHours, dailyHours } = checkArguments(process.argv);
  console.log(calculateExercise(targetDailyHours, dailyHours));
} catch (error) {
  if (error instanceof Error)
    console.log('Error, something bad happened, message: ', error.message);
}

export { calculateExercise };
