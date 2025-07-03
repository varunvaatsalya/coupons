"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError } from "@/utils/toast";
import { MdDelete, MdEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Page() {
  const [countries, setCountries] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      currencyCode: "",
      currencySymbol: "",
    },
  });

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        let res = await fetch("/api/country");
        res = await res.json();
        if (res.success) {
          setCountries(res.countries);
        } else {
          showError(res.message || "Failed to fetch countries");
        }
      } catch (err) {
        showError("Error fetching countries");
        console.error("Error fetching countries", err);
      }
    };
    fetchCountry();
  }, []);

  async function onSubmit(data) {
    console.log(data);
    setLoading(true);
    try {
      let res = await fetch("/api/country", {
        method: "POST",
        body: JSON.stringify(data),
      });
      res = await res.json();

      if (res.success) {
        if (isEdit) {
          console.log("updating...");
          setCountries((countries) =>
            countries.map((country) =>
              country.id === data.id ? res.data : country
            )
          );
        } else {
          console.log("Inserting...");
          setCountries((countries) => [res.data, ...countries]);
        }
        setIsEdit(false);
        reset();
      } else {
        showError(res.message || "Failed to save config");
      }
    } catch (err) {
      showError("Application error while saving config");
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      let res = await fetch("/api/country", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      res = await res.json();
      if (res.success) {
        setCountries((countries) =>
          countries.filter((country) => country.id !== id)
        );
      } else {
        showError(res.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-2 w-full px-4">
      <div className="text-2xl font-semibold border-b p-2">
        Country & their Currency
      </div>
      <div className="p-2 max-w-4xl mx-auto border rounded-lg">
        <h1 className="text-xl font-semibold py-1">
          {isEdit ? "Edit Country" : "Add New Country"}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-wrap gap-2 justify-end"
        >
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder={`Enter Country Name`}
            className="flex-1 py-2"
          />
          <div className="flex flex-wrap gap-2 items-end">
            <Input
              {...register("currencyCode")}
              placeholder={`Enter Currency Code`}
              className="flex-1"
            />
            <Input
              {...register("currencySymbol")}
              placeholder={`Enter Currency Symbol`}
              className="w-1/4"
            />
            <Button disabled={loading} type="submit">
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                ? "Update"
                : "Add"}
            </Button>
            {isEdit && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  reset();
                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="font-semibold">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Currency Code</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.length > 0
              ? countries.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.currencyCode}</TableCell>
                    <TableCell>{item.currencySymbol}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEdit(true);
                          setValue("id", item.id);
                          setValue("name", item.name);
                          setValue("currencyCode", item.currencyCode);
                          setValue("currencySymbol", item.currencySymbol);
                        }}
                      >
                        <MdEdit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDelete size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : countries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No countries added yet.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;

function ConfigSection({ type, items, onUpdate }) {
  const [localItems, setLocalItems] = useState(items);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null); // null = add, index = edit
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    const isEdit = editIndex !== null;
    const existingItem = isEdit ? localItems[editIndex] : null;

    const value = {
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
        setEditIndex(null);
      } else {
        showError(res.message || "Failed to save config");
      }
    } catch (err) {
      showError("Application error while saving config");
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (index) => {
    const item = localItems[index];
    setInputValue(item.name || "");
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
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setInputValue("");
  };

  return <></>;
}
