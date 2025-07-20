import { useEffect, useRef } from "react";
import { PAYMENT_PUBLIC_KEY } from "../../../utils/constants";

export const WompiWidget = ({
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
  const formRef = useRef<HTMLFormElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!formRef.current) return;

    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.co.uat.wompi.dev/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute(
      "data-public-key",
      PAYMENT_PUBLIC_KEY
    );
    script.setAttribute("data-currency", currency);
    script.setAttribute("data-amount-in-cents", `${amountInCents}`);
    script.setAttribute("data-reference", reference);
    script.setAttribute("data-redirect-url", redirectUrl);
    script.setAttribute("data-signature:integrity", integry);

    formRef.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [reference, amountInCents, currency, integry, redirectUrl]);

  return <form ref={formRef}></form>;
};
