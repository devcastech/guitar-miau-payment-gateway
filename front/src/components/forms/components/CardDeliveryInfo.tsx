import { CreditCard, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import {  setCardInformation } from "../../../redux/states/cardInformation";
import { useDispatch, useSelector } from "react-redux";
import type { ICardInformation } from "../../../types/cardInformation";
import { setDeliveryInformation } from "../../../redux/states/deliveryInformation";
import type { IDeliveryInformation } from "../../../types/deliveryInformation";
import type { IAppStore } from "../../../redux/store";

const getCardType = (number: string) => {
  const cleaned = number.replace(/\s/g, "");
  if (cleaned.startsWith("4")) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(cleaned)) return "mastercard";
  return null;
};

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(" ").substring(0, 19) : cleaned;
};

const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
  }
  return cleaned;
};

export const CardDeliveryInfo = ({
  onFinished,
}: {
  onFinished: () => void;
}) => {
  const dispatch = useDispatch();
  const selectedDeliveryInformation = useSelector(
    (state: IAppStore) => state.deliveryInformation,
  );
  const selectedCardInformation = useSelector(
    (state: IAppStore) => state.cardInformation,
  );
  console.log("selectedDeliveryInformation", selectedDeliveryInformation);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...selectedCardInformation,
      ...selectedDeliveryInformation,
    },
  });

  const watchedCardNumber = watch("cardNumber");
  const cardType = getCardType(watchedCardNumber || "");

  const onSubmit = (data: ICardInformation & IDeliveryInformation) => {
    dispatch(
      setCardInformation({
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        cardHolder: data.cardHolder,
      })
    );
    dispatch(
      setDeliveryInformation({
        fullName: data.fullName,
        email: data.email,
        address: data.address,
        city: data.city,
      })
    );
    onFinished?.();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Información de Pago
          </h3>

          <div className="relative">
            <input
              {...register("cardNumber", {
                required: "Número de tarjeta requerido",
                pattern: {
                  value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                  message: "Formato: 1234 5678 9012 3456",
                },
              })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.cardNumber ? "border-red-300" : "border-gray-300"
              }`}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setValue("cardNumber", formatted);
              }}
            />
            {cardType && (
              <div className="absolute right-3 top-3">
                <div
                  className={`text-white px-2 py-1 rounded text-xs font-bold ${
                    cardType === "visa" ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  {cardType === "visa" ? "VISA" : "MC"}
                </div>
              </div>
            )}
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                {...register("expiryDate", {
                  required: "Fecha requerida",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: "Formato MM/AA",
                  },
                })}
                placeholder="MM/AA"
                maxLength={5}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.expiryDate ? "border-red-300" : "border-gray-300"
                }`}
                onChange={(e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  setValue("expiryDate", formatted);
                }}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("cvv", {
                  required: "CVV requerido",
                })}
                placeholder="CVV"
                maxLength={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.cvv ? "border-red-300" : "border-gray-300"
                }`}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setValue("cvv", cleaned);
                }}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register("cardHolder", {
                required: "Nombre requerido",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
              placeholder="Nombre del titular"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.cardHolder ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.cardHolder && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cardHolder.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Información de Entrega
          </h3>

          <div>
            <input
              {...register("fullName", {
                required: "Nombre completo requerido",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
              placeholder="Nombre completo"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.fullName ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("email", {
                required: "Correo es requerido",
              })}
              placeholder="correo"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("address", {
                required: "Dirección requerida",
                minLength: {
                  value: 5,
                  message: "Mínimo 5 caracteres",
                },
              })}
              placeholder="Dirección completa"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.address ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="w-full gap-4">
            <input
              {...register("city", {
                required: "Ciudad requerida",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
              })}
              placeholder="Ciudad"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.city ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:to-violet-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          Procesar Pago
        </button>
      </form>
    </div>
  );
};
