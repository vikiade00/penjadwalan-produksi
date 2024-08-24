import { Card } from "@/components/ui/card";
import { useCustomer } from "@/context/CustomerContext";
import { usePesanan } from "@/context/PesananContext";
import { CircleCheckBig, Pickaxe, ShoppingCart, UserRound } from "lucide-react";
import React from "react";

const Cards = ({ onCardSelect }) => {
  const { customers } = useCustomer();
  const { pesanan } = usePesanan();

  const pesananBaru = pesanan.filter(
    (p) => p.status_pesanan === "Menunggu"
  ).length;

  const pesananDikerjakan = pesanan.filter(
    (p) => p.status_pesanan === "Diproses"
  ).length;

  const pesananSelesai = pesanan.filter(
    (p) => p.status_pesanan === "Selesai"
  ).length;

  const jumlahCustomers = customers.length;

  const cards = [
    {
      name: "Total Customers",
      icon: <UserRound />,
      qty: jumlahCustomers,
    },
    {
      name: "Pesanan Baru",
      icon: <ShoppingCart />,
      qty: pesananBaru,
    },
    {
      name: "Pesanan Dikerjakan",
      icon: <Pickaxe />,
      qty: pesananDikerjakan,
    },
    {
      name: "Pesanan Selesai",
      icon: <CircleCheckBig />,
      qty: pesananSelesai,
    },
  ];

  return (
    <div className="flex w-full mt-10 gap-5 justify-evenly flex-wrap">
      {cards.map((card) => (
        <Card
          key={card.name}
          className="p-5 items-center shadow w-52 cursor-pointer"
          onClick={() => onCardSelect(card.name)}
        >
          <div className="font-semibold flex justify-between">
            <div>{card.name}</div>
            <div>{card.icon}</div>
          </div>
          <div className="text-4xl font-bold mt-3">
            {card.qty}{" "}
            <span className="text-sm text-gray-400 font-normal">Item</span>{" "}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Cards;
