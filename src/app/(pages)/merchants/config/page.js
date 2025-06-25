"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";

const configLabels = {
  merchantType: "Merchant Type",
  merchantStatus: "Merchant Status",
  geographicMarket: "Geographic Market",
  currency: "Currency",
};

function Page() {
  const router = useRouter();
  const [configs, setConfigs] = useState({});

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        let res = await fetch("/api/merchants/configs");
        res = await res.json();
        if (res.success) {
          setConfigs(res.data);
        } else {
          showError(res.message || "Failed to fetch configs");
        }
      } catch (err) {
        showError("Error fetching configs");
        console.error("Error fetching configs", err);
      }
    };
    fetchConfigs();
  }, []);

  const updateConfig = (type, updatedList) => {
    setConfigs((prev) => ({
      ...prev,
      [type]: updatedList,
    }));
  };

  return (
    <div className="space-y-2 w-full px-4">
      <div className="flex items-center gap-2 border-b py-2">
        <Button
          variant="icon"
          onClick={() => router.back()}
          className="hover:opacity-80"
        >
          <IoMdArrowRoundBack className="size-6" />
        </Button>
        <div className="text-2xl font-semibold">Merchant Configs</div>
      </div>
      <div className="text-sm text-muted-foreground">
        Configure your merchant settings here.
      </div>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Merchant Configuration</h1>
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.entries(configs).map(([type, items]) => (
            <AccordionItem key={type} value={type}>
              <AccordionTrigger>{configLabels[type]}</AccordionTrigger>
              <AccordionContent>
                <ConfigSection
                  type={type}
                  items={items}
                  onUpdate={(updatedList) => updateConfig(type, updatedList)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Page;

function ConfigSection({ type, items, onUpdate }) {
  const [localItems, setLocalItems] = useState(items);
  const [inputValue, setInputValue] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState(""); // only for currency
  const [editIndex, setEditIndex] = useState(null); // null = add, index = edit

  const isCurrency = type === "currency";

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const isEdit = editIndex !== null;
    const existingItem = isEdit ? localItems[editIndex] : null;

    const value = isCurrency
      ? {
          ...(isEdit && { id: existingItem.id }),
          code: inputValue,
          symbol: currencySymbol,
        }
      : {
          ...(isEdit && { id: existingItem.id }),
          name: inputValue,
        };

    try {
      let res = await fetch("/api/merchants/configs", {
        method: "POST",
        body: JSON.stringify({ type, value }),
      });
      res = await res.json();

      if (res.success) {
        const newItem = res.data;
        const updatedItems = [...localItems];

        if (isEdit) {
          updatedItems[editIndex] = newItem;
        } else {
          updatedItems.unshift(newItem);
        }

        setLocalItems(updatedItems);
        onUpdate(updatedItems);

        setInputValue("");
        setCurrencySymbol("");
        setEditIndex(null);
      } else {
        showError(res.message || "Failed to save config");
      }
    } catch (err) {
      showError("Application error while saving config");
      console.error("Save failed", err);
    }
  };

  const handleStartEdit = (index) => {
    const item = localItems[index];
    if (isCurrency) {
      setInputValue(item.code || "");
      setCurrencySymbol(item.symbol || "");
    } else {
      setInputValue(item.name || "");
    }
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const item = localItems[index];
    try {
      let res = await fetch("/api/merchants/configs", {
        method: "DELETE",
        body: JSON.stringify({ type, id: item.id }),
      });
      res = await res.json();

      const updated = [...localItems];
      updated.splice(index, 1);
      setLocalItems(updated);
      onUpdate(updated);

      if (editIndex === index) {
        setEditIndex(null);
        setInputValue("");
        setCurrencySymbol("");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setInputValue("");
    setCurrencySymbol("");
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-wrap gap-2 items-end"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isCurrency ? "Enter currency code (e.g., INR)" : `Enter ${configLabels[type]}`}
          className="flex-1"
        />
        {isCurrency && (
          <Input
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            placeholder="Enter symbol (e.g., ₹)"
            className="w-1/4"
          />
        )}
        <Button type="submit">{editIndex !== null ? "Update" : "Add"}</Button>
        {editIndex !== null && (
          <Button variant="ghost" type="button" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </form>

      {/* List Section */}
      <ul className="space-y-2">
        {localItems.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            {isCurrency ? (
              <>
                <Input value={item.code} disabled className="flex-1" />
                <Input value={item.symbol} disabled className="w-1/4" />
              </>
            ) : (
              <Input value={item.name} disabled />
            )}
            <Button variant="outline" onClick={() => handleStartEdit(index)}>
              <MdEdit />
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(index)}>
              <MdDelete />
            </Button>
          </div>
        ))}
      </ul>
    </div>
  );
}
