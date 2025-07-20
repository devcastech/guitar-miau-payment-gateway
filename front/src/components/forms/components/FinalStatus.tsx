import { CheckCircle, XCircle, Home, Receipt } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setPaymentModal } from "../../../redux/states/app";
import { PAYMENT_STEPS } from "../../../utils/constants";

interface FinalStatusProps {
  isSuccess?: boolean;
  transactionId: string;
  redirectPath: string;
}

export const FinalStatus = ({
  isSuccess = true,
  transactionId,
  redirectPath,
}: FinalStatusProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(
      setPaymentModal({
        open: false,
        step: PAYMENT_STEPS.STEP_1.id,
      }),
    );
    navigate(redirectPath);
  };

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
          <h2 className="text-2xl font-bold text-gray-900">
            {isSuccess ? "¡Ya casi!" : "Pago Fallido"}
          </h2>
          <p className="text-gray-600">
            {isSuccess
              ? "Tu transacción está siendo procesada y se encuentra en estado de validación"
              : "Hubo un problema al procesar tu pago"}
          </p>
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