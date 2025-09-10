/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { compile } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types.js";
import * as runtime from "react/jsx-runtime";
import { Vega, MdxTable, rdkInit, Loading } from "./components";

interface MDXRuntimeProps {
  code: string;
  components?: MDXComponents;
}

function MDXRuntime({ code, components }: MDXRuntimeProps) {
  const [Comp, setComp] = useState<any | null>(null);

  useEffect(() => {
    async function run() {
      await rdkInit();
      const compiled = await compile(code, { outputFormat: "function-body" });
      const fn = new Function("React", "jsx", "jsxs", String(compiled));
      const { default: MDXContent } = fn(
        runtime,
        (runtime as any).jsx,
        (runtime as any).jsxs
      );
      setComp(() => MDXContent);
    }
    run();
  }, [code]);

  if (!Comp) return <Loading />;

  return (
    <MDXProvider components={components}>
      <Comp components={components} />
    </MDXProvider>
  );
}

export default function App() {
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "姓名" },
    { key: "email", title: "邮箱" },
    { key: "role", title: "角色" },
  ];

  const data = [
    { id: "1", name: "张三", email: "zhangsan@example.com", role: "开发者" },
    { id: "2", name: "李四", email: "lisi@example.com", role: "设计师" },
    { id: "3", name: "王五", email: "wangwu@example.com", role: "产品经理" },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    data: { url: "https://vega.github.io/vega-datasets/data/movies.json" },
    transform: [
      {
        filter: {
          and: [
            { field: "IMDB Rating", valid: true },
            { field: "Rotten Tomatoes Rating", valid: true },
          ],
        },
      },
    ],
    mark: "rect",
    encoding: {
      x: {
        bin: { maxbins: 60 },
        field: "IMDB Rating",
        type: "quantitative",
      },
      y: {
        bin: { maxbins: 40 },
        field: "Rotten Tomatoes Rating",
        type: "quantitative",
      },
      color: {
        aggregate: "count",
        type: "quantitative",
      },
    },
    config: {
      view: {
        stroke: "transparent",
      },
    },
  };
  const mdxSource = `
    # MLMD Report

    This is **runtime compiled** with TypeScript.

    <button onClick={() => alert("clicked")}>Click me</button>

    <MdxTable
            columns={${JSON.stringify(columns)}} 
            data={${JSON.stringify(data)}}  />

    <Vega spec={${JSON.stringify(spec)}} responsive={true} />

  `;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose lg:prose-xl max-w-none">
        <MDXRuntime code={mdxSource} components={{ Vega: Vega, MdxTable }} />
      </article>
    </div>
  );
}
