import { PAYMENT_PUBLIC_KEY, WOMPI_ENV } from "../../../utils/constants";
import { useEffect } from "react";

declare global {
  interface Window {
    initializeWompi: any;
  }
}

export const WompiWeb = ({
  reference,
  amountInCents,
  currency,
  integry,
  redirectUrl,
  onPaymentSuccess,
}: {
  reference: string;
  amountInCents: number;
  currency: string;
  integry: string;
  redirectUrl: string;
  onPaymentSuccess: (result: any) => void;
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => {
      window.initializeWompi({
        currency: currency,
        publicKey: PAYMENT_PUBLIC_KEY,
        amountInCents: amountInCents,
        reference: reference,
        signature: integry,
        onAccepted: (result: any) => {
          console.log('Pago aceptado:', result);
          onPaymentSuccess(result);
        },
        onRejected: (result: any) => {
          console.log('Pago rechazado:', result);
          onPaymentSuccess({
            transaction: {
              id: result.transaction?.id || 'unknown',
              status: 'DECLINED',
              reference: reference
            }
          });
        },
        onError: (error: any) => {
          console.error('Error en el pago:', error);
        },
        onClose: () => {
          console.log('Modal de pago cerrado');
        },
        env: WOMPI_ENV === 'production' ? 'prod' : 'test'
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [reference, amountInCents, currency, integry, onPaymentSuccess]);

  return (
    <button
      onClick={() => {
        if (window.initializeWompi) {
          window.initializeWompi();
        }
      }}
      className="w-full bg-[#b0f2ae] text-slate-700 font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
    >
      Pagar con Wompi
    </button>
  );
};
