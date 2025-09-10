import { Table, TableBody, TableCaption, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import React from "react";

// 定义表格列的配置
interface TableColumn {
  key: string;
  title: string;
  className?: string;
}

// 定义表格数据项的类型
interface TableDataItem {
  [key: string]: React.ReactNode;
}

// 定义组件的 props
interface MdxTableProps {
  columns: TableColumn[];
  data: TableDataItem[];
  caption?: string;
  className?: string;
  captionClassName?: string;
  headerRowClassName?: string;
  bodyRowClassName?: string;
  cellClassName?: string;
}

const MdxTable: React.FC<MdxTableProps> = ({
  columns,
  data,
  caption,
  className,
  captionClassName,
  headerRowClassName,
  bodyRowClassName,
  cellClassName,
}) => {
  return (
    <Table className={className}>
      {caption && <TableCaption className={captionClassName}>{caption}</TableCaption>}
      <TableHeader>
        <TableRow className={headerRowClassName}>
          {columns.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} className={bodyRowClassName}>
            {columns.map((column) => (
              <TableCell 
                key={column.key} 
                className={cellClassName}
              >
                {row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MdxTable;
