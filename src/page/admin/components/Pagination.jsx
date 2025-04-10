import React from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Pagination = ({ pagination, pageSize, onPageChange, onPageSizeChange }) => {
  return (
    <CardFooter className="border-t px-4 py-3">
      <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
          {pagination.totalItems} results
        </p>

        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.currentPage === 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardFooter>
  );
};

export default Pagination; 