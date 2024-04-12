import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationInMilliseconds = (seconds * 1000 + nanoseconds / 1e6).toFixed(
      3,
    );
    const method = chalk.blue(req.method);
    const url = chalk.magenta(req.path);
    const status =
      res.statusCode >= 400
        ? chalk.red(res.statusCode.toString())
        : chalk.green(res.statusCode.toString());
    const responseTime = chalk.yellow(`${durationInMilliseconds}ms`);

    console.log(`${method} ${url} ${status} - ${responseTime}`);
  });

  next();
};

export default loggerMiddleware;