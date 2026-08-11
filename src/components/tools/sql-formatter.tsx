"use client";

import { useState, useMemo } from "react";
import { Table2, Copy, Check } from "lucide-react";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return "";

    let sql = input.trim();

    // Uppercase keywords
    if (uppercase) {
      const keywords = [
        "select", "from", "where", "and", "or", "not", "in", "between",
        "like", "order", "by", "group", "having", "limit", "offset",
        "join", "inner", "left", "right", "outer", "full", "cross",
        "on", "as", "insert", "into", "values", "update", "set",
        "delete", "create", "table", "drop", "alter", "add", "column",
        "index", "view", "primary", "key", "foreign", "references",
        "null", "is", "exists", "case", "when", "then", "else", "end",
        "union", "all", "distinct", "asc", "desc", "count", "sum",
        "avg", "min", "max", "if", "begin", "commit", "rollback",
        "with", "recursive", "partition", "over", "rows", "range",
        "preceding", "following", "unbounded", "current", "row",
      ];
      for (const kw of keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        sql = sql.replace(regex, kw.toUpperCase());
      }
    }

    // Normalize whitespace
    sql = sql.replace(/\s+/g, " ");

    // Add newlines before major clauses
    const majorClauses = [
      "SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING",
      "LIMIT", "OFFSET", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
      "FULL JOIN", "CROSS JOIN", "UNION", "UNION ALL",
      "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
      "CREATE TABLE", "DROP TABLE", "ALTER TABLE",
    ];
    for (const clause of majorClauses) {
      sql = sql.replace(new RegExp(`\\s+${clause}\\b`, "gi"), `\n${clause.toUpperCase()}`);
    }

    // Indent after SELECT, SET, VALUES
    const indent = " ".repeat(parseInt(indentSize) || 2);
    const lines = sql.split("\n");
    const formattedLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isMainClause = majorClauses.some(c => trimmed.toUpperCase().startsWith(c.toUpperCase()));

      if (isMainClause) {
        formattedLines.push(trimmed);
        const nextKeyword = trimmed.toUpperCase().startsWith("SELECT")
          || trimmed.toUpperCase().startsWith("SET")
          || trimmed.toUpperCase().startsWith("VALUES");
        if (nextKeyword && formattedLines.length > 0) {
          // Subsequent lines should be indented
        }
      } else {
        formattedLines.push(indent + trimmed);
      }
    }

    return formattedLines.join("\n");
  }, [input, indentSize, uppercase]);

  const originalSize = new TextEncoder().encode(input).length;
  const formattedSize = new TextEncoder().encode(result).length;

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    {
      label: "SQL نمونه",
      value: "select u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = 1 and o.created_at >= '2024-01-01' group by u.id, u.name, u.email having count(o.id) > 5 order by order_count desc limit 10;",
    },
    {
      label: "Join چندتایی",
      value: "select p.name as product, c.name as category, s.name as supplier from products p inner join categories c on p.category_id = c.id inner join suppliers s on p.supplier_id = s.id where p.price > 1000 and c.active = 1 order by p.price asc;",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Table2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">فرمت‌کننده SQL</h2>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded border-border" />
          کلمات کلیدی بزرگ (Uppercase)
        </label>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span>فاصله:</span>
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndentSize(String(n))}
              className={`rounded-md border px-2 py-1 text-xs font-mono transition-colors ${
                indentSize === String(n) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">کد SQL ورودی</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="کد SQL خود را وارد کنید..."
          rows={5}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          dir="ltr"
        />
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">کد فرمت شده</label>
            <button onClick={copyResult} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "کپی شد!" : "کپی"}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            rows={Math.max(5, result.split("\n").length + 1)}
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-foreground font-mono text-sm"
            dir="ltr"
          />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>خطوط: {result.split("\n").length}</span>
            <span>حجم: {formattedSize} بایت</span>
          </div>
        </div>
      )}
    </div>
  );
}
