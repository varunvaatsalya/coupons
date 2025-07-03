// // Page.jsx
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Pencil, Plus, ChevronRight, ChevronDown } from "lucide-react";

// const fetchCategories = async () => {
//   const res = await fetch("/api/categories");
//   const data = await res.json();
//   return data.tree; // ✅ returns the full tree
// };

// const createCategory = async (payload) => {
//   const res = await fetch("/api/categories", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();
//   return data.category; // ✅ returns created category
// };

// const updateCategory = async (id, payload) => {
//   const res = await fetch(`/api/categories`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id, ...payload }),
//   });

//   const data = await res.json();
//   return data.category; // ✅ returns updated category
// };

// function CategoryForm({ mode, category, parent, onSave }) {
//   const [name, setName] = useState(category?.name || "");
//   const [slug, setSlug] = useState(category?.slug || "");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     const payload = {
//       name,
//       slug,
//       parentId: parent?.id || null,
//     };
//     try {
//       let newCat;
//       if (mode === "create") {
//         newCat = await createCategory(payload);
//       } else if (category) {
//         newCat = await updateCategory(category.id, payload);
//       }
//       onSave(newCat);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <Input
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <Input
//         placeholder="Slug"
//         value={slug}
//         onChange={(e) => setSlug(e.target.value)}
//       />
//       <Button onClick={handleSubmit} disabled={loading}>
//         {mode === "create" ? "Create" : "Update"}
//       </Button>
//     </div>
//   );
// }

// function CategoryNode({ node, onUpdate }) {
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [expanded, setExpanded] = useState(false);
//   const [children, setChildren] = useState(node.children);

//   const handleAdd = (newCat) => {
//     setChildren((prev) => [...prev, newCat]);
//     setExpanded(true);
//     setOpenAdd(false);
//   };

//   const handleEdit = (updated) => {
//     onUpdate(updated);
//     setOpenEdit(false);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex items-center gap-2 w-full max-w-md bg-muted px-3 py-1 rounded-md shadow-sm justify-between">
//         <div
//           className="flex items-center gap-1 cursor-pointer"
//           onClick={() => setExpanded((prev) => !prev)}
//         >
//           {children.length > 0 ? (
//             expanded ? (
//               <ChevronDown size={16} />
//             ) : (
//               <ChevronRight size={16} />
//             )
//           ) : (
//             <span className="w-[16px]" />
//           )}
//           <span className="font-medium">📁 {node.name}</span>
//         </div>

//         <div className="flex gap-1">
//           <Dialog open={openEdit} onOpenChange={setOpenEdit}>
//             <DialogTrigger asChild>
//               <Button size="icon" variant="ghost">
//                 <Pencil size={14} />
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <CategoryForm mode="edit" category={node} onSave={handleEdit} />
//             </DialogContent>
//           </Dialog>

//           <Dialog open={openAdd} onOpenChange={setOpenAdd}>
//             <DialogTrigger asChild>
//               <Button size="icon" variant="ghost">
//                 <Plus size={14} />
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <CategoryForm mode="create" parent={node} onSave={handleAdd} />
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {expanded && children.length > 0 && (
//         <div className="pl-6 border-l-2 border-dashed border-muted mt-1 space-y-1 w-full">
//           {children.map((child) => (
//             <CategoryNode
//               key={child.id}
//               node={child}
//               onUpdate={(updated) => {
//                 setChildren((prev) =>
//                   prev.map((c) => (c.id === updated.id ? updated : c))
//                 );
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// export default function Page() {
//   const [tree, setTree] = useState([]);

//   useEffect(() => {
//     fetchCategories().then(setTree);
//   }, []);

//   const handleAddRoot = (cat) => {
//     setTree((prev) => [...prev, cat]);
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">Category Tree</h2>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus size={16} className="mr-2" /> Add Root Category
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <CategoryForm mode="create" onSave={handleAddRoot} />
//           </DialogContent>
//         </Dialog>
//       </div>
//       <div className="space-y-1">
//         {tree.map((cat) => (
//           <CategoryNode
//             key={cat.id}
//             node={cat}
//             onUpdate={(updated) => {
//               setTree((prev) =>
//                 prev.map((c) => (c.id === updated.id ? updated : c))
//               );
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronDown, Pencil, Plus, Info, X } from "lucide-react";
import { TbBinaryTreeFilled } from "react-icons/tb";
import { VscListTree } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { showError } from "@/utils/toast";

function CategoryFormDialog({ open, setOpen, onSubmit, defaultValues = {} }) {
  const [form, setForm] = useState({
    name: defaultValues.name || "",
    translatedName: defaultValues.translatedName || "",
    description: defaultValues.description || "",
    country: defaultValues.country || "",
    pageTitle: defaultValues.pageTitle || "",
    metaDescription: defaultValues.metaDescription || "",
    metaKeywords: defaultValues.metaKeywords || [],
    newKeyword: "", // temporary input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      metaKeywords: form.metaKeywords.map((k) => k.trim()),
    };
    delete payload.newKeyword;
    onSubmit(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>
            {defaultValues.id ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            Fill the category details carefully. You can always edit them later.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 py-4 max-h-[70vh] overflow-y-auto px-3">
          <div>
            <Label className={"p-2"}>Name</Label>
            <Input
              name="name"
              placeholder="e.g. Fashion"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label className={"p-2"}>Translated Name</Label>
            <Input
              name="translatedName"
              placeholder="e.g. Fashion"
              value={form.translatedName}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <Label className={"p-2"}>Description</Label>
            <Textarea
              name="description"
              placeholder="Short description about this category"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className={"p-2"}>Country</Label>
            <Input
              name="country"
              placeholder="e.g. India"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className={"p-2"}>Page Title</Label>
            <Input
              name="pageTitle"
              placeholder="SEO title for this category"
              value={form.pageTitle}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <Label className={"p-2"}>Meta Description</Label>
            <Textarea
              name="metaDescription"
              placeholder="SEO meta description"
              value={form.metaDescription}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <Label className="p-2">Meta Keywords</Label>
            <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2 min-h-[42px] bg-background">
              {form.metaKeywords.map((kw, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 text-sm"
                >
                  <div className="pb-0.5">{kw}</div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        metaKeywords: prev.metaKeywords.filter(
                          (_, idx) => idx !== i
                        ),
                      }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              <Input
                type="text"
                className="border-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-auto p-0 text-sm px-2"
                placeholder="Type & press comma"
                value={form.newKeyword || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, newKeyword: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "," || e.key === "Enter") {
                    e.preventDefault();
                    const val = form.newKeyword?.trim();
                    if (val && !form.metaKeywords.includes(val)) {
                      setForm((prev) => ({
                        ...prev,
                        metaKeywords: [...prev.metaKeywords, val],
                        newKeyword: "",
                      }));
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {defaultValues.id ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryNode({ node, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(node.children || []);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const handleAdd = async (newCat) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCat,
        parentId: node.id,
        slug: newCat.name.toLowerCase().replace(/\s+/g, "-"),
      }),
    });
    const data = await res.json();
    setChildren((prev) => [...prev, data.category]);
    setExpanded(true);
  };

  const handleEdit = async (updatedCat) => {
    const res = await fetch(`/api/categories`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...updatedCat,
        id: node.id,
        slug: updatedCat.name.toLowerCase().replace(/\s+/g, "-"),
      }),
    });
    const data = await res.json();
    onUpdate(data.category);
  };

  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center gap-2 justify-between bg-muted px-3 py-1 rounded-lg">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {children.length > 0 ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-[14px]" />
          )}
          <div>
            <div className="font-medium flex items-center gap-1">
              <VscListTree /> {node.name}
            </div>
            <div className="text-xs text-muted-foreground">{node.path}</div>
          </div>
        </div>
        <div className="flex gap-1">
          <Dialog open={openDetails} onOpenChange={setOpenDetails}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Info size={14} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Category Details</DialogTitle>
                <DialogDescription>
                  Full information of "{node.name}"
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Name</div>
                  <div className="font-medium">{node.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Translated</div>
                  <div className="font-medium">{node.translatedName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Description</div>
                  <div className="font-medium">{node.description}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Country</div>
                  <div className="font-medium">{node.country}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Page Title</div>
                  <div className="font-medium">{node.pageTitle}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Meta Description</div>
                  <div className="font-medium">{node.metaDescription}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Meta Keywords</div>
                  <div className="font-medium">
                    {node.metaKeywords?.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Path</div>
                  <div className="font-medium">{node.path}</div>
                </div>
              </div>
              <div className="mt-2">
                <Button
                  onClick={() => {
                    setOpenDetails(false);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="icon" variant="ghost" onClick={() => setOpenEdit(true)}>
            <Pencil size={14} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setOpenAdd(true)}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {expanded && children.length > 0 && (
        <div className="ml-4 border-l border-muted pl-2 mt-1">
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onUpdate={(updated) =>
                setChildren((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                )
              }
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={openAdd}
        setOpen={setOpenAdd}
        onSubmit={handleAdd}
      />
      <CategoryFormDialog
        open={openEdit}
        setOpen={setOpenEdit}
        onSubmit={handleEdit}
        defaultValues={node}
      />
    </div>
  );
}

export default function Page() {
  const [tree, setTree] = useState([]);
  const [openNewCatForm, setOpenNewCatForm] = useState(false);
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    return data.tree;
  };
  useEffect(() => {
    fetchCategories().then(setTree);
  }, []);

  const handleAdd = async (newCat) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCat,
        slug: newCat.name.toLowerCase().replace(/\s+/g, "-"),
      }),
    });
    const data = await res.json();
    if (data.success) {
      setTree((trees) => [data.category, ...trees]);
    } else showError(data.message ?? "Error in saving category");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-semibold mb-4 flex items-center gap-1">
          <TbBinaryTreeFilled /> Category Tree
        </h2>
        <Button onClick={() => setOpenNewCatForm((prev) => !prev)}>
          <Plus size={16} className="mr-2" /> Add Root Category
        </Button>
        <CategoryFormDialog
          open={openNewCatForm}
          setOpen={setOpenNewCatForm}
          onSubmit={handleAdd}
        />
      </div>
      <div className="w-full max-w-4xl">
        {tree.map((cat) => (
          <CategoryNode key={cat.id} node={cat} onUpdate={() => {}} />
        ))}
      </div>
    </div>
  );
}
