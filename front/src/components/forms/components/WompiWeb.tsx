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
        <input
          type="hidden"
          name="public-key"
          // TODO: get from .env
          value="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
        />
        <input type="hidden" name="currency" value={currency} />
        <input type="hidden" name="amount-in-cents" value={amountInCents} />
        <input type="hidden" name="reference" value={reference} />
        <input type="hidden" name="signature:integrity" value={integry} />

        <input type="hidden" name="redirect-url" value={redirectUrl} />
        <button type="submit">Pagar con Wompi</button>
      </form>
    </>
  );
};
