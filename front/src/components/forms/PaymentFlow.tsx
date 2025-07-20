import { CardDeliveryInfo } from "./components/CardDeliveryInfo";
import { Button } from "@radix-ui/themes";
import { Summary } from "./components/Summary";
import { FinalStatus } from "./components/FinalStatus";
import { useParams } from "react-router";
import { PAYMENT_STEPS } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import type { IAppStore } from "../../redux/store";
import { setPaymentModal } from "../../redux/states/app";

const PaymentFlow = () => {
  const { paymentModal: paymentStep } = useSelector(
    (state: IAppStore) => state.app,
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const base_url = window.location.origin;
  const redirectPath = `/product/${id}`;
  const redirectUrl = `${base_url}${redirectPath}`;
  const urlParams = new URLSearchParams(location.search);
  const transactionId = urlParams.get("id") || "";
  const isSuccess = !!transactionId;

  return (
    <article className="w-full">
      {paymentStep.step === PAYMENT_STEPS.STEP_1.id && (
        <div className="w-full">
          <CardDeliveryInfo
            onFinished={() =>
              dispatch(
                setPaymentModal({
                  open: true,
                  step: PAYMENT_STEPS.STEP_2.id,
                }),
              )
            }
          />
        </div>
      )}
      {paymentStep.step === PAYMENT_STEPS.STEP_2.id && (
        <div className="w-full">
          <Summary redirectUrl={redirectUrl} />
          <div className="w-full flex justify-start items-center mt-4">
            <Button
              onClick={() =>
                dispatch(
                  setPaymentModal({
                    open: true,
                    step: PAYMENT_STEPS.STEP_1.id,
                  }),
                )
              }
            >
              Atrás
            </Button>
          </div>
        </div>
      )}
      {paymentStep.step === PAYMENT_STEPS.STEP_3.id && (
        <div className="w-full">
          <FinalStatus
            isSuccess={isSuccess}
            transactionId={transactionId}
            redirectPath={redirectPath}
          />
        </div>
      )}
    </article>
  );
};

export default PaymentFlow;
