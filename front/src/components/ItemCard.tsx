import type { Product } from "../types/product";
import { Package } from "lucide-react";
import { Link } from "react-router";

export const ItemCard = ({ product }: { product: Product }) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-64 object-cover transition-all duration-700 group-hover:scale-110`}
        />

        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50`}
          >
            <Package size={12} />
            En stock
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {product.stock} disponibles
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-700 text-white py-3 px-4 rounded-xl font-medium hover:from-violet-700 hover:to-violet-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};
