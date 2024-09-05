import express, { Request, Response } from "express";
import db from "@repo/db/client";
const app = express();

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
  // Todo: Add zod validation
  // todo2: Add a secret so that when hdfc sends a req we know that's hdfc
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  // add an entry in onRamptansactions table
  try {
    // update in onRamp status
    //  update the balance of the user
    await db.$transaction([
      db.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
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
