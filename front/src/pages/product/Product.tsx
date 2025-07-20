import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProduct } from "../../api/api";
import { ItemDetail } from "../../components/ItemDetail";
import { Modal } from "../../components/Dialog";
import type { Product as ProductType } from "../../types/product";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../redux/states/product";
import { setPaymentModal } from "../../redux/states/app";
import { PAYMENT_STEPS } from "../../utils/constants";
import type { IAppStore } from "../../redux/store";
import { useEffect } from "react";
import PaymentFlow from "../../components/forms/PaymentFlow";

export const Product = () => {
  const { id } = useParams();
  const { paymentModal } = useSelector((state: IAppStore) => state.app);
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const startPaymentProcess = (product: ProductType, quantity: number) => {
    console.log("selected product", product);
    console.log("quantity", quantity);
    dispatch(
      setProduct({
        ...product,
        quantity: quantity,
      }),
    );
    dispatch(
      setPaymentModal({
        open: true,
        step: paymentModal.step,
      }),
    );
  };

  const urlParams = new URLSearchParams(location.search);
  const transactionId = urlParams.get("id") || "";
  const isSuccess = !!transactionId;
  useEffect(() => {
    console.log("transactionId", transactionId);
    if (transactionId && isSuccess) {
      // TODO: check transaction status from api
      console.log("Transaction ID:", transactionId);
      console.log("Success:", isSuccess);
      dispatch(
        setPaymentModal({
          open: true,
          step: PAYMENT_STEPS.STEP_3.id,
        }),
      );
    }
  }, [transactionId, isSuccess, dispatch]);
  return (
    <div className="w-full">
      {isLoading && <p>Loading...</p>}
      {data?.data && (
        <ItemDetail product={data.data} onStartPayment={startPaymentProcess} />
      )}
      {paymentModal.open && (
        <Modal
          open={paymentModal.open}
          onClose={() => {
            dispatch(
              setPaymentModal({
                open: false,
                step: paymentModal.step,
              }),
            );
          }}
        >
          <PaymentFlow />
        </Modal>
      )}
    </div>
  );
};
