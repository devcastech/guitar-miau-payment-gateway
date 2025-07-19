import type { Product } from "../types/product";
import { Package, CreditCard, ArrowLeft, Heart, Share2 } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export const ItemDetail = ({
  product,
  onStartPayment,
}: {
  product: Product;
  onStartPayment: (product: Product, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-gray-100 rounded-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />

            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-50">
                <Package size={14} />
                En stock
              </span>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
                <Heart size={20} className="text-gray-600 hover:text-red-500" />
              </button>
              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
                <Share2
                  size={20}
                  className="text-gray-600 hover:text-blue-500"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <p className="text-gray-500 mt-1">
                  {product.stock} unidades disponibles
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-900 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Máximo {product.stock} unidades
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">
                Total ({quantity} {quantity === 1 ? "unidad" : "unidades"}):
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice((parseFloat(product.price) * quantity).toString())}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onStartPayment(product, quantity)}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <CreditCard size={24} />
              Pagar con tarjeta de crédito
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles del producto
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID del producto:</span>
                <span className="text-gray-900 font-mono">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="text-green-600 font-medium">
                  {product.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de creación:</span>
                <span className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString("es-CO")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
