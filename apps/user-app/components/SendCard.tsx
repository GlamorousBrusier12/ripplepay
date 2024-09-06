"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { createP2pTransfer } from "../app/lib/actions/p2pTransaction";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionMessage, setTransactionMessage] = useState("hi");

  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button
                onClick={async () => {
                  const respose = await createP2pTransfer(
                    number,
                    Number(amount) * 100,
                  );

                  setTransactionMessage(respose.message);
                }}
              >
                Send
              </Button>
            </div>
            {transactionMessage}
          </div>
        </Card>
      </Center>
    </div>
  );
}
