import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getProduct } from "../../api/api";
import { ItemDetail } from "../../components/ItemDetail";

export const Product = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data?.data && <ItemDetail product={data.data} />}
    </div>
  );
}
