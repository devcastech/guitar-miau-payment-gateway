import { CardDeliveryInfo } from "./components/CardDeliveryInfo";
import { Button } from "@radix-ui/themes";
import { Summary } from "./components/Summary";
import { FinalStatus } from "./components/FinalStatus";
import { useParams } from "react-router";
import { CUSTOMER_ID, PAYMENT_INTEGRITY_KEY, PAYMENT_PUBLIC_KEY, PAYMENT_STEPS } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import type { IAppStore } from "../../redux/store";
import { setPaymentModal } from "../../redux/states/app";
import { useState } from "react";

interface TransactionResult {
  transaction: {
    id: string;
    status: string;
    reference?: string;
  };
}
import { getIntegrity } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "../../api/api";

const PaymentFlow = () => {
  const { paymentModal: paymentStep } = useSelector(
    (state: IAppStore) => state.app
  );

  const selectedDeliveryInformation = useSelector(
    (state: IAppStore) => state.deliveryInformation
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const redirectPath = `/product/${id}`;
  const urlParams = new URLSearchParams(window.location.search);
  const initialTransactionId = urlParams.get("id") || "";
  const initialIsApproved = urlParams.get("status") === "approved";
  const initialReference = urlParams.get("reference") || "";

  const [transactionResultIsApproved, setTransactionResultIsApproved] =
    useState<boolean>(initialIsApproved);
  const [transactionId, setTransactionId] =
    useState<string>(initialTransactionId);
  const selectedProduct = useSelector((state: IAppStore) => state.product);
  const [reference, setReference] = useState<string>(initialReference);

  const summaryData = {
    productAmount: parseFloat(selectedProduct.price) * selectedProduct.quantity,
    baseFee: 50000,
    deliveryFee: 60000,
    productName: selectedProduct.description,
    currency: "COP",
  };

  const total =
    summaryData.productAmount + summaryData.baseFee + summaryData.deliveryFee;
  const startPayment = async () => {
    const REFERENCE = uuidv4();
    const AMOUNT_IN_CENTS = Math.round(total * 100);
    const CURRENCY = summaryData.currency;
    const INTEGRITY_SECRET = PAYMENT_INTEGRITY_KEY;

    const integrity = await getIntegrity(
      `${REFERENCE}${AMOUNT_IN_CENTS}${CURRENCY}${INTEGRITY_SECRET}`
    );
    setReference(REFERENCE);
    const transactionResponse = await createTransaction({
      id: REFERENCE,
      externalId: REFERENCE,
      reference: REFERENCE,
      status: "pending",
      totalAmount: total,
      customer: CUSTOMER_ID,
      products: [
        {
          productId: selectedProduct.id,
          quantity: selectedProduct.quantity,
        },
      ],
    });
    console.log("transactionResponse", transactionResponse);
    dispatch(
      setPaymentModal({
        open: false,
        step: PAYMENT_STEPS.STEP_2.id,
      })
    );

    const checkout = new WidgetCheckout({
      currency: CURRENCY,
      amountInCents: AMOUNT_IN_CENTS,
      reference: REFERENCE,
      publicKey: PAYMENT_PUBLIC_KEY,
      signature: {
        integrity: integrity,
      },
      customerData: {
        email: selectedDeliveryInformation.email,
        fullName: selectedDeliveryInformation.fullName,
        phoneNumber: "3040777777",
        phoneNumberPrefix: "+57",
        legalId: "123456789",
        legalIdType: "CC",
      },
      shippingAddress: {
        addressLine1: selectedDeliveryInformation.address,
        city: selectedDeliveryInformation.city,
        phoneNumber: "3019444444",
        region: "Antioquia",
        country: "CO",
      },
    });

    checkout.open((result: TransactionResult) => {
      const transaction = result?.transaction;
      if (!transaction) {
        console.error("No se recibió transacción:", result);
        return;
      }
      // TODO: REFACTOR THIS!!!!
      const isApproved = transaction.status === "APPROVED";
      const url = new URL(window.location.href);
      url.searchParams.set("id", transaction.id);
      url.searchParams.set("status", isApproved ? "approved" : "rejected");
      url.searchParams.set("reference", transaction.reference || "");
      window.history.pushState({}, "", url);

      setTransactionResultIsApproved(isApproved);
      setTransactionId(transaction.id);
      setReference(transaction.reference || "");

      setTimeout(() => {
        window.dispatchEvent(new Event("popstate"));

        dispatch(
          setPaymentModal({
            open: true,
            step: PAYMENT_STEPS.STEP_3.id,
          })
        );
      }, 100);
    });
  };

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
                })
              )
            }
          />
        </div>
      )}
      {paymentStep.step === PAYMENT_STEPS.STEP_2.id && (
        <div className="w-full">
          <Summary
            summaryData={summaryData}
            integrity={""}
            currency={summaryData.currency}
            total={total}
            product={selectedProduct}
            startPayment={startPayment}
          />
          <div className="w-full flex justify-start items-center mt-4">
            <Button
              onClick={() =>
                dispatch(
                  setPaymentModal({
                    open: true,
                    step: PAYMENT_STEPS.STEP_1.id,
                  })
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
            isSuccess={transactionResultIsApproved}
            transactionId={transactionId}
            reference={reference}
            redirectPath={redirectPath}
          />
        </div>
      )}
    </article>
  );
};

export default PaymentFlow;
