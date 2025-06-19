"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosAddCircleOutline } from "react-icons/io";
import NewMerchantForm from "@/components/parts/NewMerchantForm";

function Page() {
  const [selectedMerchantForEdit, setSelectedMerchantForEdit] = useState(null);
  const [isOpenMerchantForm, setIsOpenMerchantForm] = useState(false);

  if (isOpenMerchantForm) {
    return (
      <NewMerchantForm
        selectedMerchantForEdit={selectedMerchantForEdit}
        setSelectedMerchantForEdit={setSelectedMerchantForEdit}
        setIsOpenMerchantForm={setIsOpenMerchantForm}
      />
    );
  }
  return (
    <div className="flex flex-col items-center flex-1 p-2">
      <div className="flex justify-between items-center gap-2 w-full">
        <Input placeholder="Search..." className="w-1/4" />
        <Button
          onClick={() => {
            setIsOpenMerchantForm(true);
          }}
          className={"flex items-center gap-1"}
        >
          <IoIosAddCircleOutline />
          <div>Add Merchant</div>
        </Button>
      </div>
    </div>
  );
}

export default Page;
