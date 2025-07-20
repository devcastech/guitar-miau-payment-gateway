import { useEffect, useRef } from "react";

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
    // TODO: GET FROM .ENV
    script.setAttribute(
      "data-public-key",
      "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7",
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
