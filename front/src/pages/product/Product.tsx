import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProduct } from "../../api/api";
import { ItemDetail } from "../../components/ItemDetail";
import { useState } from "react";
import { Modal } from "../../components/Dialog";

export const Product = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  return (
    <div className="w-full">
      {isLoading && <p>Loading...</p>}
      {data?.data && (
        <ItemDetail product={data.data} setIsModalOpen={setIsModalOpen} />
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
