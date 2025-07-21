import { CheckCircle, XCircle, Home, Receipt } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setPaymentModal } from "../../../redux/states/app";
import { PAYMENT_STEPS } from "../../../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { getTransaction } from "../../../api/api";
import { useEffect, useState } from "react";

interface FinalStatusProps {
  isSuccess?: boolean;
  transactionId: string;
  redirectPath: string;
  reference: string;
}

export const FinalStatus = ({
  isSuccess = true,
  transactionId,
  redirectPath,
  reference,
}: FinalStatusProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [retryCount, setRetryCount] = useState(0);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["transactions", reference],
    queryFn: () => getTransaction(reference),
    enabled: !!reference,
  });
  const transactionIsPending = data?.status === "pending";
  const transactionIsCompleted = data?.status === "completed";
  const transactionIsRejected = data?.status === "rejected";

  const handleGoBack = () => {
    dispatch(
      setPaymentModal({
        open: false,
        step: PAYMENT_STEPS.STEP_1.id,
      })
    );
    navigate(redirectPath);
  };
  useEffect(() => {
    async function retry() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if ((transactionIsPending || transactionIsRejected) && retryCount < 5) {
        refetch();
        setRetryCount((prev) => prev + 1);
      }
    }
    retry();
  }, [transactionIsPending, transactionIsRejected, refetch, retryCount]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!transactionIsCompleted && !transactionIsRejected && (
            <h2 className="text-2xl font-bold text-gray-900">
              {isSuccess ? "¡Ya casi!" : "Pago Fallido"}
            </h2>
          )}
          {transactionIsRejected && (
            <h2 className="text-2xl font-bold text-gray-900">
              Tu transacción ha sido rechazada.
            </h2>
          )}
          {transactionIsCompleted && (
            <h2 className="text-2xl font-bold text-gray-900">
              Tu transacción ha sido completada exitosamente.
            </h2>
          )}
          {!transactionIsCompleted && (
            <p className="text-gray-600">
              {isSuccess && transactionIsPending
                ? "Tu transacción está siendo procesada y se encuentra en estado de validación"
                : "Hubo un problema al procesar tu pago"}
            </p>
          )}
        </div>

        {isSuccess && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                Detalles de la Transacción
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Transacción:</span>
                <span className="font-mono text-gray-900">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="text-gray-900">
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="w-full flex justify-center items-center p-4 animate-pulse">
            <p className="text-slate-300">Actualizando...</p>
          </div>
        )}

        <button
          onClick={handleGoBack}
          className={`w-full font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
            isSuccess
              ? "bg-gradient-to-r from-violet-600 to-purple-700 hover:to-violet-800 text-white"
              : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          Cerrar
        </button>
      </div>
    </div>
  );
};