"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosAddCircleOutline } from "react-icons/io";

function Page() {
  const [merchants, setMerchants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData(page) {
      setIsLoading(true);
      try {
        let result = await fetch(`/api/merchants?page=${page}`);
        result = await result.json();
        if (result.success) {
          setMerchants(result.merchants);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        console.log("error: ", err);
      }
      setIsLoading(false);
    }
    fetchData(page);
  }, [page]);
  return (
    <div className="flex flex-col items-center flex-1 p-2">
      <div className="flex justify-between items-center gap-2 w-full">
        <Input placeholder="Search..." className="w-1/4" />
        <Button asChild className="flex items-center gap-1">
          <Link href="/merchants/new">
            <IoIosAddCircleOutline />
            <div>Add NetWork</div>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Form State</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td>{merchant.name}</td>
                  <td>{merchant.formState}</td>
                  <td>{new Date(merchant.dateCreated).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/merchants/${merchant.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Page;
