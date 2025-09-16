// app/networks/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// components/NetworkDialog.tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Delete, DeleteIcon, ChevronUp } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { MdDeleteOutline } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RxCross2 } from "react-icons/rx";

export default function NetworkPage() {
  const [networks, setNetworks] = useState([]);
  const [sortBy, setSortBy] = useState("date"); // or "name"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchNetworks();
  }, [sortBy]);

  const fetchNetworks = async () => {
    try {
      let res = await fetch(`/api/networks?sort=${sortBy}`);
      res = await res.json();
      if (res.success) {
        setNetworks(res.networks);
      } else {
        showError(res.message || "Failed to fetch configs");
      }
    } catch (err) {
      showError("Error fetching configs");
      console.error("Error fetching configs", err);
    }
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);

    try {
      console.log("post requesting...");
      let res = await fetch("/api/networks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      res = await res.json();

      if (res.success) {
        const newItem = res.data;
        const updatedItems = [...networks];

        if (editing) {
          updatedItems((item) => (item.id === newItem.id ? newItem : item));
        } else {
          updatedItems.unshift(newItem);
        }
        setNetworks(updatedItems);

        setDialogOpen(false);
        setEditing(null);
        showSuccess(
          editing
            ? "Network updated successfully"
            : "Network created successfully"
        );
      } else {
        showError(res.message || "Failed to save config");
      }
    } catch (err) {
      showError("Application error while saving config");
      console.error("Save failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      let res = await fetch(`/api/networks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      res = await res.json();

      if (res.success) {
        setNetworks((prev) => prev.filter((network) => network.id !== id));
        showSuccess("Network deleted successfully");
        setDeleteTarget(null);
        setConfirmOpen(false);
      } else {
        showError(res.message || "Failed to delete network");
        console.error("Delete failed:", res.error);
      }
    } catch (err) {
      showError("Application error while deleting network");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Networks</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus />
          Create Network
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={sortBy === "name" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("name")}
        >
          Sort by Name
        </Button>
        <Button
          variant={sortBy === "date" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("date")}
        >
          Sort by Date
        </Button>
      </div>

      <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="space-y-1 px-2">
          <h2 className="text-xl font-semibold">Networks & Parameters</h2>
          <p className="text-sm text-muted-foreground">
            Manage affiliate networks and their parameter mappings here.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="multiple" className="space-y-2">
          {networks.map((network, idx) => (
            <AccordionItem key={network.id} value={network.id}>
              <AccordionTrigger>
                <div className="grid grid-cols-3 w-full text-left text-sm font-medium">
                  <span>
                    {idx + 1}. {network.name}
                  </span>
                  <span className="text-muted-foreground">
                    {network.merchantCount} Merchants
                  </span>
                  <span className="text-muted-foreground">
                    {network.parameters.length} Params
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-3 px-2 pt-2">
                  {/* Params Table */}
                  <div className="rounded-md border overflow-hidden">
                    <div className="grid grid-cols-2 text-xs font-semibold bg-muted text-muted-foreground px-3 py-2 border-b">
                      <div>Param Key</div>
                      <div>Param Value</div>
                    </div>
                    {network.parameters.map((param, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-2 px-3 py-1 text-sm border-b last:border-none"
                      >
                        <div>{param.key}</div>
                        <div className="text-muted-foreground">
                          {param.value}
                        </div>
                      </div>
                    ))}
                    {network.parameters.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm p-2">
                        No parameters added.
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(network);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteTarget(network);
                        setConfirmOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <NetworkDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        initialData={editing}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            This will permanently delete <b>{deleteTarget?.name}</b> and all
            related data.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleDelete(deleteTarget?.id); // see Part 3
                setConfirmOpen(false);
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NetworkDialog({ open, onClose, onSubmit, submitting, initialData }) {
  const [name, setName] = useState("");
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setParameters(initialData.parameters || []);
    } else {
      setName("");
      setParameters([]);
    }
  }, [initialData, open]);

  const addParam = () => setParameters([...parameters, { key: "", value: "" }]);

  const updateParam = (i, field, val) => {
    const newParams = [...parameters];
    newParams[i][field] = val;
    setParameters(newParams);
  };

  const removeParam = (i) => {
    setParameters(parameters.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    const cleanedParams = parameters.filter(
      (param) => param.key.trim() !== "" || param.value.trim() !== ""
    );
    const payload = {
      ...(initialData?.id && { id: initialData.id }),
      name,
      parameters: cleanedParams,
    };
    onSubmit(payload);
  };

  const moveParam = (from, to) => {
    if (to < 0 || to >= parameters.length) return;

    const updated = [...parameters];
    const [movedItem] = updated.splice(from, 1);
    updated.splice(to, 0, movedItem);
    setParameters(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Create"} Network</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the network details and parameters."
              : "Create a new network with parameters."}
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Network Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Scrollable parameter list */}
        <ScrollArea className="max-h-[50vh]">
          <div className="pr-3 py-1">
            {parameters.map((param, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <span className="w-16 text-right text-sm text-muted-foreground">
                  {idx + 1}.
                </span>
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => updateParam(idx, "key", e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => updateParam(idx, "value", e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={idx === 0}
                  onClick={() => moveParam(idx, idx - 1)}
                  className="h-8 w-8 p-1 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeParam(idx)}
                  className="h-8 w-8 p-1"
                >
                  <RxCross2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addParam}>
            + Add Parameter
          </Button>
        </ScrollArea>

        <DialogFooter>
          <Button type="submit" disabled={submitting} onClick={handleSubmit}>
            {initialData ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
