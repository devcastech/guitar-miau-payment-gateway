import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProduct } from "../../api/api";
import { ItemDetail } from "../../components/ItemDetail";
import { useState } from "react";
import { Modal } from "../../components/Dialog";
import type { Product as ProductType } from "../../types/product";
import { useDispatch } from "react-redux";
import { setProduct } from "../../redux/states/product";

export const Product = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  const startPaymentProcess = (product: ProductType, quantity: number) => {
    console.log("selected product", product);
    console.log("quantity", quantity);
    dispatch(
      setProduct({
        ...product,
        quantity: quantity,
      }),
    );
    setIsModalOpen(true);
  };
  return (
    <div className="w-full">
      {isLoading && <p>Loading...</p>}
      {data?.data && (
        <ItemDetail product={data.data} onStartPayment={startPaymentProcess} />
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
