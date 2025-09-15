import React from "react";
import OrderList from "./_components/orderList";
import Title from "../_components/Title";

const Page = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title="Order" active="Dashboard > Order > List" />
      </div>
      <OrderList />
    </div>
  );
};

export default Page;
