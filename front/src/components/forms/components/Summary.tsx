import { CreditCard, Package, Truck, Receipt } from "lucide-react";
export const Summary = ({ onFinished }: { onFinished: () => void }) => {
  const summaryData = {
    productAmount: 1200000,
    baseFee: 50000,
    deliveryFee: 60000,
    productName: "Guitarra Acústica",
    currency: "COP",
  };

  const total =
    summaryData.productAmount + summaryData.baseFee + summaryData.deliveryFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: summaryData.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handlePayment = () => {
    console.log("Procesando pago...", { total, ...summaryData });
    onFinished();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Resumen de Pago
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Revisa los detalles antes de confirmar
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Producto</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">{summaryData.productName}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(summaryData.productAmount)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 border-b pb-2">
            Desglose de Costos
          </h4>

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">Precio del producto</span>
            </div>
            <span className="text-gray-900">
              {formatCurrency(summaryData.productAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">Tarifa base</span>
            </div>
            <span className="text-gray-900">
              {formatCurrency(summaryData.baseFee)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Tarifa de entrega</span>
            </div>
            <span className="text-gray-900">
              {formatCurrency(summaryData.deliveryFee)}
            </span>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          Confirmar Pago
        </button>

        <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p>🔒 Pago seguro y encriptado</p>
          <p className="mt-1">Tus datos están protegidos</p>
        </div>
      </div>
    </div>
  );
};
