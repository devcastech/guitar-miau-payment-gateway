import { PAYMENT_PUBLIC_KEY } from "../../../utils/constants";

export const WompiWeb = ({
  reference,
  amountInCents,
  currency,
  integry,
  redirectUrl,
}: {
  reference: string;
  amountInCents: number;
  currency: string;
  integry: string;
  redirectUrl: string;
}) => {
  console.log(reference, amountInCents, currency, integry);
  return (
    <>
      <form action="https://checkout.co.uat.wompi.dev/p/" method="GET">
        <input type="hidden" name="public-key" value={PAYMENT_PUBLIC_KEY} />
        <input type="hidden" name="currency" value={currency} />
        <input type="hidden" name="amount-in-cents" value={amountInCents} />
        <input type="hidden" name="reference" value={reference} />
        <input type="hidden" name="signature:integrity" value={integry} />

        <input type="hidden" name="redirect-url" value={redirectUrl} />
        <button
          type="submit"
          className="w-full bg-[#b0f2ae] text-slate-700 font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Pagar con Wompi
        </button>
      </form>
    </>
  );
};
