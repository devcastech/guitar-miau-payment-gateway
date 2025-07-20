import { useEffect, useState } from "react";
import { CardDeliveryInfo } from "./components/CardDeliveryInfo";
import { Button } from "@radix-ui/themes";
import { Summary } from "./components/Summary";
import { FinalStatus } from "./components/FinalStatus";
import { useParams } from "react-router";

const paymentSteps = {
  STEP_1: {
    id: 1,
    value: "cardAndDeliveryInformation",
  },
  STEP_2: {
    id: 2,
    value: "summary",
  },
  STEP_3: {
    id: 3,
    value: "finalStatus",
  },
};

const PaymentFlow = () => {
  const [paymentStep, setPaymentStep] = useState(paymentSteps.STEP_1);

  const { id } = useParams();
  const base_url = window.location.origin;
  const redirectUrl = `${base_url}/product/${id}`;

  const urlParams = new URLSearchParams(location.search);
  const transactionId = urlParams.get("id") || "";
  const isSuccess = !!transactionId;
  useEffect(() => {
    if (transactionId && isSuccess) {
      // TODO: check transaction status from api
      console.log("Transaction ID:", transactionId);
      console.log("Success:", isSuccess);
      setPaymentStep(paymentSteps.STEP_3);
    }
  }, [transactionId, isSuccess]);

  return (
    <article className="w-full">
      {paymentStep.id === paymentSteps.STEP_1.id && (
        <div className="w-full">
          <CardDeliveryInfo
            onFinished={() => setPaymentStep(paymentSteps.STEP_2)}
          />
        </div>
      )}
      {paymentStep.id === paymentSteps.STEP_2.id && (
        <div className="w-full">
          <Summary redirectUrl={redirectUrl} />
          <div className="w-full flex justify-start items-center mt-4">
            <Button onClick={() => setPaymentStep(paymentSteps.STEP_1)}>
              Atrás
            </Button>
          </div>
        </div>
      )}
      {paymentStep.id === paymentSteps.STEP_3.id && (
        <div className="w-full">
          <FinalStatus isSuccess={isSuccess} transactionId={transactionId} />
        </div>
      )}
    </article>
  );
};

export default PaymentFlow;
