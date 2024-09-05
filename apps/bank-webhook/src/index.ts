import express, { json, Request, Response } from "express";
import db from "@repo/db/client";
const app = express();

app.use(json());
app.post("/hdfcWebhook", async (req: Request, res: Response) => {
  // Todo: Add zod validation
  // todo2: Add a secret so that when hdfc sends a req we know that's hdfc
  const paymentInformation: {
    token: string;
  } = {
    token: req.body.token,
  };

  // add an entry in onRamptansactions table
  try {
    // update in onRamp status
    const transaction = await db.onRampTransaction.findFirst({
      where: {
        token: paymentInformation.token,
      },
    });

    if (!transaction || !transaction.userId || !transaction.amount) {
      throw new Error("invalid transaction " + transaction?.id);
    }

    //  update the balance of the user
    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(transaction?.userId),
        },
        data: {
          amount: {
            increment: Number(transaction?.amount),
          },
        },
        //
      }),
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Sucess",
        },
      }),
    ]);

    res.json({
      message: "captured",
    });
  } catch (error) {
    console.log("error in on ramping the amount", error);
    res.status(411).json({
      message: "something went wrong while processing the webhook!",
    });
  }
});

app.listen(3003);
