"use client";

import { useState } from "react";
import { Network, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  ipClass: string;
  cidr: number;
  wildcardMask: string;
}

const getIpClass = (firstOctet: number): string => {
  if (firstOctet >= 1 && firstOctet <= 126) return "A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D (Multicast)";
  return "E (Reserved)";
};

const calculateSubnet = (ipStr: string, cidrStr: string): SubnetResult | null => {
  const cidr = parseInt(cidrStr);
  if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;

  const octets = ipStr.split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) return null;

  const ipNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | ~maskNum) >>> 0;

  const numToIp = (n: number) => {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  };

  const firstHostNum = cidr < 31 ? (networkNum + 1) >>> 0 : networkNum;
  const lastHostNum = cidr < 31 ? (broadcastNum - 1) >>> 0 : broadcastNum;
  const usableHosts = cidr <= 30 ? Math.pow(2, 32 - cidr) - 2 : cidr === 31 ? 2 : 1;
  const wildcardNum = (~maskNum) >>> 0;

  return {
    networkAddress: numToIp(networkNum),
    broadcastAddress: numToIp(broadcastNum),
    subnetMask: numToIp(maskNum),
    firstHost: numToIp(firstHostNum),
    lastHost: numToIp(lastHostNum),
    usableHosts,
    ipClass: getIpClass(octets[0]),
    cidr,
    wildcardMask: numToIp(wildcardNum),
  };
};

export default function SubnetCalculator() {
  const [input, setInput] = useState("192.168.1.0");
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const parts = input.split("/");
    if (parts.length !== 2) {
      setError("لطفاً آدرس را به فرمت IP/CIDR وارد کنید (مثلاً 192.168.1.0/24)");
      return;
    }

    const res = calculateSubnet(parts[0], parts[1]);
    if (!res) {
      setError("آدرس IP یا CIDR نامعتبر است.");
      return;
    }
    setResult(res);
  };

  const toPersianDigits = (n: number) => n.toLocaleString("fa-IR");

  const fields = result
    ? [
        { label: "آدرس شبکه", value: result.networkAddress },
        { label: "آدرس برودکست", value: result.broadcastAddress },
        { label: "Subnet Mask", value: result.subnetMask },
        { label: "Wildcard Mask", value: result.wildcardMask },
        { label: "اولین هاست", value: result.firstHost },
        { label: "آخرین هاست", value: result.lastHost },
        { label: "تعداد هاست قابل استفاده", value: toPersianDigits(result.usableHosts) },
        { label: "کلاس IP", value: result.ipClass },
        { label: "CIDR", value: "/" + toPersianDigits(result.cidr) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر Subnet</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.0/24"
            dir="ltr"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
          />
          <button
            onClick={handleCalculate}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            محاسبه
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.label}
                className="rounded-lg border border-border bg-background p-3"
              >
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="mt-1 font-mono text-sm font-medium text-foreground" dir="ltr">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
