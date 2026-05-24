"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const timeframes = ["1M", "3M", "1Y", "ALL"] as const;

// ── Stock data from CSV ──────────────────────────────────────────────────────
const allStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE/BSE", sector: "Energy", industry: "Oil & Gas - Diversified", marketCap: 1892000, price: 2798.50, high52w: 3217.90, low52w: 2220.30, pe: 26.4, pb: 2.3, eps: 106.0, divYield: 0.42, beta: 0.85, roe: 9.8, debtToEquity: 0.38, promoterHolding: 50.3 },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd", exchange: "NSE/BSE", sector: "Technology", industry: "IT Services & Consulting", marketCap: 1452000, price: 3940.00, high52w: 4592.25, low52w: 3311.00, pe: 28.1, pb: 13.5, eps: 140.2, divYield: 1.82, beta: 0.42, roe: 52.1, debtToEquity: 0.05, promoterHolding: 72.3 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Private Sector Bank", marketCap: 1248000, price: 1640.00, high52w: 1880.00, low52w: 1363.55, pe: 19.2, pb: 2.8, eps: 85.5, divYield: 1.22, beta: 0.78, roe: 16.5, debtToEquity: 0, promoterHolding: 25.5 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", exchange: "NSE/BSE", sector: "Communication Services", industry: "Telecom Services", marketCap: 906000, price: 1508.50, high52w: 1779.00, low52w: 1143.00, pe: 72.3, pb: 9.1, eps: 20.9, divYield: 0.53, beta: 0.94, roe: 24.2, debtToEquity: 2.14, promoterHolding: 55.8 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Private Sector Bank", marketCap: 884000, price: 1260.00, high52w: 1362.35, low52w: 970.05, pe: 18.2, pb: 3.1, eps: 69.2, divYield: 0.88, beta: 0.72, roe: 18.9, debtToEquity: 0, promoterHolding: 15.0 },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE/BSE", sector: "Technology", industry: "IT Services & Consulting", marketCap: 658000, price: 1588.00, high52w: 1975.50, low52w: 1358.35, pe: 24.6, pb: 8.2, eps: 64.5, divYield: 2.65, beta: 0.51, roe: 32.8, debtToEquity: 0.08, promoterHolding: 14.8 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", exchange: "NSE/BSE", sector: "Consumer Staples", industry: "Household & Personal Products", marketCap: 532000, price: 2265.00, high52w: 2974.25, low52w: 2176.65, pe: 52.3, pb: 11.8, eps: 43.3, divYield: 1.77, beta: 0.55, roe: 20.4, debtToEquity: 0.12, promoterHolding: 61.9 },
  { symbol: "ITC", name: "ITC Ltd", exchange: "NSE/BSE", sector: "Consumer Staples", industry: "Tobacco", marketCap: 534000, price: 425.00, high52w: 528.50, low52w: 397.30, pe: 27.4, pb: 7.2, eps: 15.5, divYield: 3.29, beta: 0.68, roe: 30.4, debtToEquity: 0.04, promoterHolding: 47.1 },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE/BSE", sector: "Financial Services", industry: "Public Sector Bank", marketCap: 716000, price: 802.00, high52w: 912.10, low52w: 620.60, pe: 9.8, pb: 1.8, eps: 81.9, divYield: 1.87, beta: 0.92, roe: 18.2, debtToEquity: 0, promoterHolding: 57.5 },
  { symbol: "LT", name: "Larsen & Toubro Ltd", exchange: "NSE/BSE", sector: "Industrials", industry: "Engineering & Construction", marketCap: 483000, price: 3440.00, high52w: 3963.25, low52w: 2900.00, pe: 35.2, pb: 5.4, eps: 97.8, divYield: 0.87, beta: 1.12, roe: 14.6, debtToEquity: 2.05, promoterHolding: 51.0 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Non-Banking Financial Company", marketCap: 434000, price: 7130.00, high52w: 8192.00, low52w: 6187.80, pe: 32.8, pb: 6.9, eps: 217.4, divYield: 0.45, beta: 1.34, roe: 22.5, debtToEquity: 3.85, promoterHolding: 54.7 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd", exchange: "NSE/BSE", sector: "Technology", industry: "IT Services & Consulting", marketCap: 456000, price: 1688.00, high52w: 2008.70, low52w: 1236.95, pe: 28.3, pb: 7.4, eps: 59.6, divYield: 4.14, beta: 0.48, roe: 24.2, debtToEquity: 0.09, promoterHolding: 60.8 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "Passenger Vehicles", marketCap: 388000, price: 12400.00, high52w: 13680.00, low52w: 9832.90, pe: 28.6, pb: 5.8, eps: 433.7, divYield: 1.21, beta: 0.82, roe: 20.8, debtToEquity: 0.01, promoterHolding: 56.2 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: 378000, price: 1575.00, high52w: 1960.50, low52w: 1367.65, pe: 40.2, pb: 6.3, eps: 39.2, divYield: 0.64, beta: 0.73, roe: 16.5, debtToEquity: 0.15, promoterHolding: 54.5 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Private Sector Bank", marketCap: 392000, price: 1978.00, high52w: 2201.55, low52w: 1544.25, pe: 22.4, pb: 3.6, eps: 88.3, divYield: 0.12, beta: 0.68, roe: 16.8, debtToEquity: 0, promoterHolding: 25.9 },
  { symbol: "TITAN", name: "Titan Company Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "Gems & Jewellery", marketCap: 280000, price: 3150.00, high52w: 3886.00, low52w: 2780.00, pe: 92.4, pb: 26.8, eps: 34.1, divYield: 0.36, beta: 0.88, roe: 32.2, debtToEquity: 0.06, promoterHolding: 52.9 },
  { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE/BSE", sector: "Technology", industry: "IT Services & Consulting", marketCap: 253000, price: 482.00, high52w: 605.00, low52w: 423.90, pe: 21.5, pb: 3.8, eps: 22.4, divYield: 0.21, beta: 0.55, roe: 17.4, debtToEquity: 0.05, promoterHolding: 72.9 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corporation Ltd", exchange: "NSE/BSE", sector: "Energy", industry: "Oil & Gas Exploration", marketCap: 342000, price: 270.00, high52w: 340.30, low52w: 213.00, pe: 8.2, pb: 1.1, eps: 32.9, divYield: 4.40, beta: 1.08, roe: 14.2, debtToEquity: 0.48, promoterHolding: 58.9 },
  { symbol: "NTPC", name: "NTPC Ltd", exchange: "NSE/BSE", sector: "Utilities", industry: "Power Generation", marketCap: 346000, price: 337.00, high52w: 448.45, low52w: 303.75, pe: 16.2, pb: 2.4, eps: 20.8, divYield: 2.31, beta: 0.92, roe: 14.2, debtToEquity: 1.88, promoterHolding: 51.1 },
  { symbol: "POWERGRID", name: "Power Grid Corporation of India", exchange: "NSE/BSE", sector: "Utilities", industry: "Power Transmission", marketCap: 279000, price: 299.00, high52w: 366.25, low52w: 258.30, pe: 17.8, pb: 3.2, eps: 16.8, divYield: 3.51, beta: 0.82, roe: 18.4, debtToEquity: 1.56, promoterHolding: 51.3 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Private Sector Bank", marketCap: 358000, price: 1160.00, high52w: 1339.65, low52w: 960.20, pe: 13.8, pb: 2.2, eps: 84.0, divYield: 0.09, beta: 0.80, roe: 18.0, debtToEquity: 0, promoterHolding: 8.2 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Paints", marketCap: 223000, price: 2320.00, high52w: 3395.00, low52w: 2190.00, pe: 52.8, pb: 15.2, eps: 43.9, divYield: 1.20, beta: 0.74, roe: 29.4, debtToEquity: 0.04, promoterHolding: 52.7 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Steel", marketCap: 207000, price: 844.00, high52w: 1063.55, low52w: 742.30, pe: 18.4, pb: 3.2, eps: 45.8, divYield: 1.18, beta: 1.42, roe: 18.8, debtToEquity: 1.22, promoterHolding: 44.8 },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Aluminium", marketCap: 136000, price: 607.00, high52w: 759.95, low52w: 500.65, pe: 12.8, pb: 1.8, eps: 47.4, divYield: 0.83, beta: 1.34, roe: 16.4, debtToEquity: 0.62, promoterHolding: 34.6 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "Passenger & Commercial Vehicles", marketCap: 278000, price: 733.00, high52w: 1179.00, low52w: 695.00, pe: 8.4, pb: 3.2, eps: 87.3, divYield: 0.42, beta: 1.52, roe: 37.2, debtToEquity: 1.68, promoterHolding: 42.6 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Steel", marketCap: 156000, price: 125.00, high52w: 186.95, low52w: 119.50, pe: 21.4, pb: 1.8, eps: 5.8, divYield: 3.20, beta: 1.62, roe: 8.6, debtToEquity: 0.92, promoterHolding: 33.9 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Cement", marketCap: 280000, price: 9680.00, high52w: 11974.90, low52w: 8706.20, pe: 42.4, pb: 6.2, eps: 228.4, divYield: 0.67, beta: 0.88, roe: 16.2, debtToEquity: 0.42, promoterHolding: 59.7 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd", exchange: "NSE/BSE", sector: "Consumer Staples", industry: "Food Products", marketCap: 224000, price: 2270.00, high52w: 2778.00, low52w: 2100.40, pe: 78.2, pb: 96.4, eps: 29.0, divYield: 1.32, beta: 0.62, roe: 134.8, debtToEquity: 0.04, promoterHolding: 62.8 },
  { symbol: "TECHM", name: "Tech Mahindra Ltd", exchange: "NSE/BSE", sector: "Technology", industry: "IT Services & Consulting", marketCap: 128000, price: 1300.00, high52w: 1786.35, low52w: 1140.00, pe: 38.4, pb: 4.2, eps: 33.8, divYield: 2.31, beta: 0.68, roe: 10.8, debtToEquity: 0.22, promoterHolding: 35.2 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: 128000, price: 1230.00, high52w: 1424.00, low52w: 1050.85, pe: 20.4, pb: 3.6, eps: 60.4, divYield: 0.65, beta: 0.62, roe: 18.6, debtToEquity: 0.22, promoterHolding: 26.7 },
  { symbol: "GRASIM", name: "Grasim Industries Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Diversified Materials", marketCap: 162000, price: 2640.00, high52w: 2990.45, low52w: 1930.00, pe: 22.4, pb: 2.4, eps: 117.8, divYield: 0.88, beta: 0.92, roe: 11.2, debtToEquity: 0.68, promoterHolding: 42.4 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Insurance & Financial Services", marketCap: 246000, price: 1940.00, high52w: 2174.50, low52w: 1419.00, pe: 38.4, pb: 6.8, eps: 50.5, divYield: 0.05, beta: 1.18, roe: 18.8, debtToEquity: 0, promoterHolding: 60.7 },
  { symbol: "CIPLA", name: "Cipla Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: 124000, price: 1528.00, high52w: 1702.00, low52w: 1296.00, pe: 26.2, pb: 4.8, eps: 58.3, divYield: 0.55, beta: 0.68, roe: 18.8, debtToEquity: 0.12, promoterHolding: 33.5 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "Motorcycles", marketCap: 126000, price: 4600.00, high52w: 5016.00, low52w: 3612.00, pe: 32.8, pb: 10.4, eps: 140.2, divYield: 1.30, beta: 0.82, roe: 32.6, debtToEquity: 0.04, promoterHolding: 49.4 },
  { symbol: "ADANIPORTS", name: "Adani Ports & Special Economic Zone Ltd", exchange: "NSE/BSE", sector: "Industrials", industry: "Ports & Shipping", marketCap: 254000, price: 1178.00, high52w: 1622.00, low52w: 1024.00, pe: 27.2, pb: 5.2, eps: 43.3, divYield: 0.42, beta: 1.18, roe: 21.2, debtToEquity: 0.92, promoterHolding: 65.8 },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "2 & 3 Wheelers", marketCap: 228000, price: 7980.00, high52w: 12249.00, low52w: 7200.00, pe: 30.2, pb: 8.4, eps: 264.2, divYield: 1.13, beta: 0.74, roe: 28.4, debtToEquity: 0.02, promoterHolding: 55.4 },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd", exchange: "NSE/BSE", sector: "Consumer Discretionary", industry: "2 Wheelers", marketCap: 94800, price: 4270.00, high52w: 6243.35, low52w: 3846.25, pe: 24.8, pb: 7.4, eps: 171.9, divYield: 3.27, beta: 0.82, roe: 30.2, debtToEquity: 0.15, promoterHolding: 34.6 },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Hospitals & Healthcare", marketCap: 82800, price: 5760.00, high52w: 7545.00, low52w: 5320.00, pe: 68.4, pb: 11.8, eps: 84.2, divYield: 0.34, beta: 0.84, roe: 18.2, debtToEquity: 0.52, promoterHolding: 28.9 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Pharmaceuticals & API", marketCap: 94200, price: 3540.00, high52w: 6022.15, low52w: 3288.00, pe: 52.4, pb: 7.8, eps: 67.5, divYield: 1.13, beta: 0.62, roe: 15.4, debtToEquity: 0.04, promoterHolding: 51.9 },
  { symbol: "SHREECEM", name: "Shree Cement Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Cement", marketCap: 89800, price: 25660.00, high52w: 30800.00, low52w: 23690.00, pe: 42.4, pb: 6.4, eps: 605.4, divYield: 0.44, beta: 0.74, roe: 16.4, debtToEquity: 0.24, promoterHolding: 60.6 },
  { symbol: "BPCL", name: "Bharat Petroleum Corporation Ltd", exchange: "NSE/BSE", sector: "Energy", industry: "Oil Refining & Marketing", marketCap: 137000, price: 315.00, high52w: 376.00, low52w: 240.60, pe: 9.4, pb: 2.2, eps: 33.5, divYield: 5.71, beta: 1.14, roe: 24.2, debtToEquity: 0.78, promoterHolding: 52.5 },
  { symbol: "COALINDIA", name: "Coal India Ltd", exchange: "NSE/BSE", sector: "Energy", industry: "Coal Mining", marketCap: 236000, price: 388.00, high52w: 543.55, low52w: 381.95, pe: 8.4, pb: 4.8, eps: 46.2, divYield: 5.15, beta: 0.82, roe: 62.4, debtToEquity: 0.28, promoterHolding: 66.1 },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Private Sector Bank", marketCap: 84200, price: 1072.00, high52w: 1694.50, low52w: 600.25, pe: 14.8, pb: 1.8, eps: 72.4, divYield: 1.87, beta: 0.86, roe: 12.4, debtToEquity: 0, promoterHolding: 16.2 },
  { symbol: "VEDL", name: "Vedanta Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Diversified Metals & Mining", marketCap: 116000, price: 394.00, high52w: 526.95, low52w: 376.00, pe: 12.2, pb: 4.4, eps: 32.2, divYield: 13.70, beta: 1.62, roe: 35.8, debtToEquity: 1.24, promoterHolding: 55.1 },
  { symbol: "HAVELLS", name: "Havells India Ltd", exchange: "NSE/BSE", sector: "Industrials", industry: "Electrical Equipment", marketCap: 88600, price: 1418.00, high52w: 2009.90, low52w: 1320.00, pe: 62.4, pb: 11.2, eps: 22.7, divYield: 0.62, beta: 0.78, roe: 18.8, debtToEquity: 0.08, promoterHolding: 61.1 },
  { symbol: "PIDILITIND", name: "Pidilite Industries Ltd", exchange: "NSE/BSE", sector: "Materials", industry: "Specialty Chemicals", marketCap: 120600, price: 2880.00, high52w: 3394.00, low52w: 2532.00, pe: 78.4, pb: 15.8, eps: 36.7, divYield: 0.62, beta: 0.72, roe: 22.8, debtToEquity: 0.12, promoterHolding: 70.4 },
  { symbol: "SIEMENS", name: "Siemens Ltd", exchange: "NSE/BSE", sector: "Industrials", industry: "Industrial Machinery", marketCap: 112400, price: 3160.00, high52w: 8272.70, low52w: 2868.00, pe: 74.2, pb: 14.2, eps: 42.6, divYield: 0.38, beta: 0.88, roe: 18.2, debtToEquity: 0.08, promoterHolding: 75.0 },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals Ltd", exchange: "NSE/BSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCap: 78800, price: 2320.00, high52w: 3614.00, low52w: 2208.00, pe: 48.4, pb: 9.8, eps: 47.9, divYield: 0.86, beta: 0.68, roe: 21.4, debtToEquity: 0.52, promoterHolding: 71.3 },
  { symbol: "MUTHOOTFIN", name: "Muthoot Finance Ltd", exchange: "NSE/BSE", sector: "Financial Services", industry: "Gold Financing NBFC", marketCap: 68800, price: 1724.00, high52w: 2311.20, low52w: 1358.85, pe: 16.8, pb: 3.6, eps: 102.6, divYield: 1.16, beta: 1.14, roe: 23.4, debtToEquity: 2.84, promoterHolding: 73.5 },
  { symbol: "DABUR", name: "Dabur India Ltd", exchange: "NSE/BSE", sector: "Consumer Staples", industry: "Personal Products & FMCG", marketCap: 82800, price: 468.00, high52w: 674.95, low52w: 454.85, pe: 48.4, pb: 12.8, eps: 9.7, divYield: 1.07, beta: 0.64, roe: 26.8, debtToEquity: 0.18, promoterHolding: 66.2 },
];

const sectorColors: Record<string, string> = {
  "Technology": "bg-blue-50 text-blue-700",
  "Financial Services": "bg-emerald-50 text-emerald-700",
  "Energy": "bg-orange-50 text-orange-700",
  "Consumer Staples": "bg-purple-50 text-purple-700",
  "Healthcare": "bg-rose-50 text-rose-700",
  "Consumer Discretionary": "bg-yellow-50 text-yellow-700",
  "Materials": "bg-slate-50 text-slate-700",
  "Industrials": "bg-indigo-50 text-indigo-700",
  "Utilities": "bg-teal-50 text-teal-700",
  "Communication Services": "bg-pink-50 text-pink-700",
};

const investmentData = [
  { name: "Ethereum", ticker: "ETH / USD", change: "+4.28%", holding: "3.402 ETH", value: "₹8,210.45", icon: "token", tag: "24H High", positive: true },
  { name: "Vanguard S&P 500", ticker: "VOO / ETF", change: "+1.12%", holding: "112.5 Shares", value: "₹48,920.10", icon: "apartment", tag: "Bullish", positive: true },
  { name: "Tesla Inc.", ticker: "TSLA / STOCKS", change: "-0.84%", holding: "45.0 Shares", value: "₹10,125.00", icon: "rocket_launch", tag: "Volatility: High", positive: false },
];

function getRiskRewardLabel(beta: number, roe: number, pe: number) {
  const reward = roe;
  const risk = beta * 10 + (pe > 40 ? 3 : pe > 25 ? 1.5 : 0);
  const ratio = reward / Math.max(risk, 1);
  if (ratio > 3) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500", pct: Math.min(ratio * 15, 100) };
  if (ratio > 2) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500", pct: Math.min(ratio * 20, 100) };
  if (ratio > 1) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500", pct: Math.min(ratio * 25, 100) };
  return { label: "High Risk", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500", pct: Math.min(ratio * 35, 100) };
}

export default function InvestOverview() {
  const router = useRouter();
  const [activeTimeframe, setActiveTimeframe] = useState<typeof timeframes[number]>("1M");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showInvestmentDetail, setShowInvestmentDetail] = useState<number | null>(null);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [buyForm, setBuyForm] = useState({ asset: "ETH", amount: "" });
  const [sellForm, setSellForm] = useState({ asset: "ETH", amount: "" });
  const [toast, setToast] = useState<string | null>(null);
  const [tipDismissed, setTipDismissed] = useState(false);

  // Stock search state
  const [stockSearch, setStockSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedStock, setSelectedStock] = useState<typeof allStocks[0] | null>(null);
  const [sortBy, setSortBy] = useState<"marketCap" | "price" | "divYield" | "pe">("marketCap");

  // Risk to Return Ratio — manually editable
  const [riskInput, setRiskInput] = useState("3");
  const [returnInput, setReturnInput] = useState("9");
  const [rtrNotes, setRtrNotes] = useState("");
  const [editingRTR, setEditingRTR] = useState(false);

  const sectors = ["All", ...Array.from(new Set(allStocks.map(s => s.sector)))];

  const filteredStocks = useMemo(() => {
    return allStocks
      .filter(s => {
        const q = stockSearch.toLowerCase();
        const matchesSearch = !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.industry.toLowerCase().includes(q);
        const matchesSector = selectedSector === "All" || s.sector === selectedSector;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [stockSearch, selectedSector, sortBy]);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleBuy() {
    if (!buyForm.amount.trim() || isNaN(parseFloat(buyForm.amount))) {
      showToastMsg("Please enter a valid amount");
      return;
    }
    showToastMsg(`✅ Order placed: Buy ₹${buyForm.amount} of ${buyForm.asset}`);
    setBuyForm({ asset: "ETH", amount: "" });
    setShowBuyModal(false);
  }

  function handleSell() {
    if (!sellForm.amount.trim() || isNaN(parseFloat(sellForm.amount))) {
      showToastMsg("Please enter a valid amount");
      return;
    }
    showToastMsg(`✅ Order placed: Sell ₹${sellForm.amount} of ${sellForm.asset}`);
    setSellForm({ asset: "ETH", amount: "" });
    setShowSellModal(false);
  }

  const balanceMap: Record<string, string> = {
    "1M": "₹1,24,592.80", "3M": "₹1,18,201.50", "1Y": "₹95,400.20", "ALL": "₹72,000.00",
  };
  const changeMap: Record<string, string> = {
    "1M": "+12.4% (₹14,201.12) this month",
    "3M": "+8.2% (₹8,940.55) this quarter",
    "1Y": "+38.6% (₹27,410.80) this year",
    "ALL": "+73.1% (₹52,592.80) all time",
  };

  const priceFromHigh = selectedStock ? ((selectedStock.price - selectedStock.low52w) / (selectedStock.high52w - selectedStock.low52w)) * 100 : 0;
  const rrInfo = selectedStock ? getRiskRewardLabel(selectedStock.beta, selectedStock.roe, selectedStock.pe) : null;

  return (
    <>
      <div className="p-container-padding max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-headline-xl text-on-surface mb-2 text-3xl">Portfolio Overview</h2>
            <p className="font-body-md text-outline">Track your financial journey and explore new growth opportunities.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSellModal(true)}
              className="flex items-center gap-2 bg-white border border-outline-variant/30 px-6 py-2.5 rounded-lg font-semibold text-[14px] text-primary hover:bg-surface-container-low active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">sell</span>
              Sell
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          {/* Chart */}
          <div className="col-span-8 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-semibold text-[12px] text-outline uppercase tracking-wider mb-1">Total Balance</p>
                <h3 className="font-display text-4xl text-on-surface">{balanceMap[activeTimeframe]}</h3>
                <div className="flex items-center gap-2 text-primary font-semibold text-[14px] mt-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>{changeMap[activeTimeframe]}</span>
                </div>
              </div>
              <div className="flex bg-surface-container rounded-lg p-1">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                      activeTimeframe === tf ? "bg-white shadow-sm text-primary" : "text-outline hover:text-primary"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[280px] w-full bg-gradient-to-b from-primary/10 to-transparent rounded-[12px] overflow-hidden flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
                <path d="M0,250 C100,230 200,260 300,180 C400,100 500,120 600,60 C700,20 800,40 800,40 V300 H0 Z" fill="url(#grad1)" />
                <path d="M0,250 C100,230 200,260 300,180 C400,100 500,120 600,60 C700,20 800,40 800,40" fill="transparent" stroke="#5442DB" strokeLinecap="round" strokeWidth="4" />
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#5442DB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5442DB" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-10 left-1/2 h-16 w-px bg-primary/50" />
              <div className="absolute bottom-28 left-[calc(50%-45px)] bg-primary text-white text-[10px] px-2 py-1 rounded-md font-bold">
                Peak: +18.2%
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="col-span-4 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(120,118,129,0.05)] border border-outline-variant/30 flex flex-col">
            <h4 className="font-headline-md text-xl text-on-surface mb-6">Asset Allocation</h4>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="relative flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[12px] border-primary border-r-primary/60 border-b-primary/30 border-t-primary/80 transform -rotate-45" />
                <div className="absolute flex flex-col items-center">
                  <span className="font-semibold text-[12px] text-outline">Diversification</span>
                  <span className="font-headline-lg text-primary text-2xl">8.2/10</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Stocks", pct: "64%", color: "bg-primary" },
                  { label: "Crypto", pct: "18%", color: "bg-primary/80" },
                  { label: "Bonds", pct: "12%", color: "bg-primary/60" },
                  { label: "Cash", pct: "6%", color: "bg-primary/30" },
                ].map(a => (
                  <div key={a.label} className="flex items-center justify-between cursor-pointer hover:bg-surface-container-low rounded-lg px-2 py-1 transition-colors" onClick={() => showToastMsg(`${a.label}: ${a.pct} of portfolio`)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${a.color}`} />
                      <span className="font-semibold text-[14px] text-on-surface">{a.label}</span>
                    </div>
                    <span className="font-semibold text-[14px] text-on-surface">{a.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Investments */}
          <div className="col-span-12 mt-4">
            <div className="flex items-center justify-between mb-6 px-2">
              <h4 className="font-headline-md text-xl text-on-surface">Active Investments</h4>
              <button onClick={() => setShowAllPositions(true)} className="text-primary font-semibold text-[14px] hover:underline">
                View All Positions
              </button>
            </div>
            <div className="grid grid-cols-3 gap-gutter">
              {investmentData.map((inv, i) => (
                <div
                  key={i}
                  onClick={() => setShowInvestmentDetail(i)}
                  className="bg-white p-5 rounded-[16px] border border-outline-variant/30 shadow-sm hover:shadow-[0_4px_20px_rgba(120,118,129,0.05)] transition-shadow group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">{inv.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[16px] text-on-surface">{inv.name}</p>
                        <p className="text-[12px] text-outline font-semibold">{inv.ticker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-[14px] ${inv.positive ? "text-primary" : "text-error"}`}>{inv.change}</p>
                      <p className="text-[10px] text-outline/80 font-bold uppercase tracking-widest">{inv.tag}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-t border-outline-variant/30 pt-4">
                    <div>
                      <p className="text-[12px] text-outline font-semibold">Holding</p>
                      <p className="font-headline-md text-[20px] text-on-surface">{inv.holding}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-outline font-semibold">Value</p>
                      <p className="font-semibold text-[16px] text-primary">{inv.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Risk to Return Ratio Box ───────────────────────────────────── */}
          <div className="col-span-12 mt-6">
            <div className="bg-white rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] overflow-hidden">
              <div className="p-6 border-b border-outline-variant/30 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">balance</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-xl text-on-surface">Risk to Return Ratio</h4>
                    <p className="text-[13px] text-outline mt-0.5">Define your personal risk appetite vs expected return</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingRTR(e => !e)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-[13px] transition-all ${
                    editingRTR
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(84,66,219,0.3)]"
                      : "bg-surface-container text-primary hover:bg-primary/10 border border-primary/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{editingRTR ? "check" : "edit"}</span>
                  {editingRTR ? "Save" : "Edit"}
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-12 gap-6 items-center">
                  {/* Risk input */}
                  <div className="col-span-3">
                    <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Risk (Loss Tolerance)</label>
                    {editingRTR ? (
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={riskInput}
                        onChange={e => setRiskInput(e.target.value)}
                        className="w-full border-2 border-primary/40 rounded-[12px] px-4 py-3 text-[22px] font-bold text-on-surface focus:outline-none focus:border-primary text-center bg-primary/5"
                      />
                    ) : (
                      <div className="risk-reward-box bg-red-50 border border-red-100 rounded-[12px] p-4 text-center">
                        <p className="text-[36px] font-black text-red-500 leading-none">{riskInput || "—"}</p>
                        <p className="text-[11px] text-red-400 font-semibold mt-1">units of risk</p>
                      </div>
                    )}
                  </div>

                  {/* Ratio display */}
                  <div className="col-span-6 flex flex-col items-center gap-4">
                    {/* Ratio bar */}
                    <div className="w-full">
                      <div className="flex justify-between text-[11px] font-bold text-outline mb-2">
                        <span className="text-red-500">RISK</span>
                        <span className="text-emerald-600">RETURN</span>
                      </div>
                      <div className="relative h-6 bg-surface-container rounded-full overflow-hidden flex">
                        {(() => {
                          const r = parseFloat(riskInput) || 1;
                          const ret = parseFloat(returnInput) || 1;
                          const total = r + ret;
                          const rPct = (r / total) * 100;
                          const retPct = (ret / total) * 100;
                          return (
                            <>
                              <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${rPct}%` }} />
                              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${retPct}%` }} />
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Big ratio number */}
                    <div className="text-center">
                      {(() => {
                        const r = parseFloat(riskInput) || 0;
                        const ret = parseFloat(returnInput) || 0;
                        const ratio = r > 0 ? (ret / r).toFixed(2) : "∞";
                        const isGood = parseFloat(ratio) >= 2;
                        return (
                          <>
                            <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-1">Ratio (Return ÷ Risk)</p>
                            <p className={`text-[48px] font-black leading-none ${
                              parseFloat(ratio) >= 3 ? "text-emerald-500" :
                              parseFloat(ratio) >= 2 ? "text-blue-500" :
                              parseFloat(ratio) >= 1 ? "text-amber-500" : "text-red-500"
                            }`}>{ratio}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold ${
                              parseFloat(ratio) >= 3 ? "bg-emerald-50 text-emerald-700" :
                              parseFloat(ratio) >= 2 ? "bg-blue-50 text-blue-700" :
                              parseFloat(ratio) >= 1 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                            }`}>
                              {parseFloat(ratio) >= 3 ? "🟢 Excellent" : parseFloat(ratio) >= 2 ? "🔵 Good" : parseFloat(ratio) >= 1 ? "🟡 Moderate" : "🔴 High Risk"}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Return input */}
                  <div className="col-span-3">
                    <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Expected Return</label>
                    {editingRTR ? (
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={returnInput}
                        onChange={e => setReturnInput(e.target.value)}
                        className="w-full border-2 border-emerald-400/60 rounded-[12px] px-4 py-3 text-[22px] font-bold text-on-surface focus:outline-none focus:border-emerald-500 text-center bg-emerald-50/50"
                      />
                    ) : (
                      <div className="risk-reward-box bg-emerald-50 border border-emerald-100 rounded-[12px] p-4 text-center">
                        <p className="text-[36px] font-black text-emerald-500 leading-none">{returnInput || "—"}</p>
                        <p className="text-[11px] text-emerald-500 font-semibold mt-1">units of return</p>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="col-span-12">
                    <label className="block text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Notes / Strategy</label>
                    {editingRTR ? (
                      <textarea
                        value={rtrNotes}
                        onChange={e => setRtrNotes(e.target.value)}
                        placeholder="e.g. Conservative approach — prefer dividend stocks with low beta. Target 3:1 return for every unit of risk taken."
                        className="w-full border border-outline-variant/40 rounded-[12px] px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary resize-none text-on-surface placeholder-outline"
                        rows={2}
                      />
                    ) : (
                      <div className="bg-surface-container/50 rounded-[12px] px-4 py-3 text-[14px] text-outline min-h-[52px] border border-outline-variant/20">
                        {rtrNotes || <span className="italic text-outline/60">No notes yet — click Edit to add your strategy.</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-6">
            <div className="bg-white rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] overflow-hidden">
              {/* Stock Explorer Header */}
              <div className="p-6 border-b border-outline-variant/30 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h4 className="font-headline-md text-xl text-on-surface">Stock Explorer</h4>
                    <p className="text-[13px] text-outline mt-0.5">{filteredStocks.length} stocks · NSE/BSE</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-outline">Sort by:</span>
                    {(["marketCap", "price", "divYield", "pe"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${sortBy === s ? "bg-primary text-white" : "bg-surface-container text-outline hover:text-primary"}`}
                      >
                        {s === "marketCap" ? "Market Cap" : s === "divYield" ? "Dividend" : s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                    <input
                      type="text"
                      placeholder="Search by symbol, company name, or industry..."
                      value={stockSearch}
                      onChange={e => setStockSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-outline-variant/40 rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-on-surface placeholder-outline transition-all"
                    />
                    {stockSearch && (
                      <button onClick={() => setStockSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    )}
                  </div>
                  {/* Sector filter */}
                  <select
                    value={selectedSector}
                    onChange={e => setSelectedSector(e.target.value)}
                    className="border border-outline-variant/40 rounded-[12px] px-4 py-2.5 text-[14px] font-semibold text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Two-panel layout: list + detail */}
              <div className="flex" style={{ minHeight: "480px" }}>
                {/* Stock List */}
                <div className="flex-1 overflow-y-auto stock-list-scroll" style={{ maxHeight: "580px" }}>
                  {filteredStocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <span className="material-symbols-outlined text-5xl text-outline mb-3">search_off</span>
                      <p className="font-semibold text-on-surface">No stocks found</p>
                      <p className="text-[13px] text-outline mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="sticky top-0 bg-surface-container/90 backdrop-blur-sm z-10">
                        <tr className="text-left">
                          <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Stock</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Price</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">52W Range</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">P/E</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Div Yield</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-outline uppercase tracking-wider text-right">Beta</th>
                          <th className="px-6 py-3 text-[11px] font-bold text-outline uppercase tracking-wider">Sector</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStocks.map(stock => {
                          const isSelected = selectedStock?.symbol === stock.symbol;
                          const pctFrom52wLow = ((stock.price - stock.low52w) / (stock.high52w - stock.low52w)) * 100;
                          return (
                            <tr
                              key={stock.symbol}
                              onClick={() => setSelectedStock(isSelected ? null : stock)}
                              className={`border-b border-outline-variant/20 cursor-pointer transition-all ${isSelected ? "bg-primary/8 border-l-4 border-l-primary" : "hover:bg-surface-container/50"}`}
                              style={isSelected ? { borderLeft: "3px solid #5442DB", backgroundColor: "rgba(84,66,219,0.04)" } : {}}
                            >
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center">
                                    <span className="font-bold text-primary text-[10px]">{stock.symbol.slice(0, 3)}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[14px] text-on-surface">{stock.symbol}</p>
                                    <p className="text-[11px] text-outline truncate max-w-[180px]">{stock.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <p className="font-bold text-[14px] text-on-surface">₹{stock.price.toLocaleString("en-IN")}</p>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <div className="w-20 h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${pctFrom52wLow}%` }} />
                                  </div>
                                  <p className="text-[10px] text-outline">{pctFrom52wLow.toFixed(0)}% from low</p>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span className={`font-semibold text-[13px] ${stock.pe < 15 ? "text-emerald-600" : stock.pe > 50 ? "text-red-600" : "text-on-surface"}`}>
                                  {stock.pe}x
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span className={`font-semibold text-[13px] ${stock.divYield > 3 ? "text-emerald-600" : "text-on-surface"}`}>
                                  {stock.divYield}%
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <span className={`font-semibold text-[13px] ${stock.beta > 1.3 ? "text-red-500" : stock.beta < 0.7 ? "text-emerald-600" : "text-on-surface"}`}>
                                  {stock.beta}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${sectorColors[stock.sector] ?? "bg-gray-50 text-gray-600"}`}>
                                  {stock.sector}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Stock Detail Panel */}
                {selectedStock && (
                  <div className="w-80 border-l border-outline-variant/30 flex-shrink-0 overflow-y-auto bg-gradient-to-b from-surface-container/30 to-white">
                    <div className="p-5 border-b border-outline-variant/20 flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center mb-2">
                          <span className="font-bold text-primary text-[11px]">{selectedStock.symbol.slice(0, 3)}</span>
                        </div>
                        <h5 className="font-bold text-[15px] text-on-surface">{selectedStock.symbol}</h5>
                        <p className="text-[11px] text-outline leading-tight mt-0.5">{selectedStock.name}</p>
                      </div>
                      <button onClick={() => setSelectedStock(null)} className="p-1.5 rounded-lg hover:bg-surface-container text-outline">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Price Info */}
                      <div className="bg-primary/5 rounded-[12px] p-4">
                        <p className="text-[11px] text-outline mb-1">Current Price</p>
                        <p className="font-bold text-2xl text-primary">₹{selectedStock.price.toLocaleString("en-IN")}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-outline mb-1">
                            <span>₹{selectedStock.low52w.toLocaleString("en-IN")}</span>
                            <span>52W Range</span>
                            <span>₹{selectedStock.high52w.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${priceFromHigh}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* ── Risk to Reward Ratio Box ── */}
                      {rrInfo && (
                        <div className={`risk-reward-box ${rrInfo.bg} border border-outline-variant/20 rounded-[12px] p-4`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-outline">balance</span>
                              <span className="text-[12px] font-bold text-outline uppercase tracking-wider">Risk to Reward</span>
                            </div>
                            <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${rrInfo.color} bg-white/60`}>{rrInfo.label}</span>
                          </div>
                          <div className="h-2.5 bg-white/60 rounded-full overflow-hidden mb-3">
                            <div className={`h-full ${rrInfo.bar} rounded-full transition-all duration-500`} style={{ width: `${rrInfo.pct}%` }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/60 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-outline uppercase font-bold mb-0.5">Risk (Beta)</p>
                              <p className={`font-bold text-[14px] ${selectedStock.beta > 1.2 ? "text-red-600" : "text-emerald-600"}`}>{selectedStock.beta}</p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-outline uppercase font-bold mb-0.5">ROE (Reward)</p>
                              <p className="font-bold text-[14px] text-primary">{selectedStock.roe}%</p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-outline uppercase font-bold mb-0.5">P/E Ratio</p>
                              <p className={`font-bold text-[14px] ${selectedStock.pe > 50 ? "text-red-600" : selectedStock.pe < 15 ? "text-emerald-600" : "text-on-surface"}`}>{selectedStock.pe}x</p>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-outline uppercase font-bold mb-0.5">Div Yield</p>
                              <p className="font-bold text-[14px] text-primary">{selectedStock.divYield}%</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Stats */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-outline uppercase tracking-wider">Key Metrics</p>
                        {[
                          { label: "Market Cap", value: `₹${(selectedStock.marketCap / 100000).toFixed(1)}L Cr` },
                          { label: "EPS", value: `₹${selectedStock.eps}` },
                          { label: "P/B Ratio", value: `${selectedStock.pb}x` },
                          { label: "Debt/Equity", value: selectedStock.debtToEquity.toString() },
                          { label: "Promoter Holding", value: `${selectedStock.promoterHolding}%` },
                          { label: "Industry", value: selectedStock.industry },
                        ].map(m => (
                          <div key={m.label} className="flex justify-between items-center py-1.5 border-b border-outline-variant/20 last:border-0">
                            <span className="text-[12px] text-outline">{m.label}</span>
                            <span className="text-[12px] font-semibold text-on-surface text-right max-w-[140px] truncate">{m.value}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => { setShowBuyModal(true); setSelectedStock(null); }}
                        className="w-full py-2.5 bg-primary text-white rounded-[10px] font-semibold text-[14px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all"
                      >
                        Buy {selectedStock.symbol}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tip Banner */}
          {!tipDismissed && (
            <div className="col-span-12 mt-6 relative h-56 rounded-[24px] overflow-hidden group">
              <img className="w-full h-full object-cover" alt="Investment tip banner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8yAKfHkJy_mkdY1jM7gbb1UL1EMr2dValWtGmwO6SnNLm4I36NuciqsiJI_xvJpsrdaABEdle-iV6FyZdA9qVMNWvzQkMYF_0gzOlBzWHDsAGnuBqkVfgNHethoqV-8EPLXIVln6SsgSlj6gaUCx2hHbEWghK-uArZ1zBYbMArYoynumv5FOeiV-T7tzTqgjUUiIYeiCK8xAuxN-BJSsXmhlt1xJWGsNvPa60HH-062lVVsPZ47aRw1SYy2UHz0YTPDaxQszl_UJk" />
              <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/90 to-transparent flex flex-col justify-center px-12 text-white">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">Investment Pro Tip</span>
                <h3 className="text-3xl font-display mb-4 max-w-md">Diversify your portfolio with ESG-compliant green energy bonds.</h3>
                <div className="flex gap-4">
                  <button onClick={() => { router.push("/dashboard"); showToastMsg("Opening ESG Bonds lesson..."); }} className="bg-white text-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-colors active:scale-95">
                    Start Lesson
                  </button>
                  <button onClick={() => setTipDismissed(true)} className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/30 transition-colors active:scale-95">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 px-10 py-8 bg-surface-container border-t border-outline-variant/30 -mx-10 -mb-10">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-outline uppercase tracking-widest">Portfolio Health</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-primary rounded-full" />
                  </div>
                  <span className="font-semibold text-[14px] text-primary">Excellent</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-outline uppercase tracking-widest">Learning Progress</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary/60 rounded-full" />
                  </div>
                  <span className="font-semibold text-[14px] text-on-surface">Level 4</span>
                </div>
              </div>
            </div>
            <div className="text-outline text-[12px] font-medium">
              © 2024 FINORAA Financial Corp. All investments carry risk.
            </div>
          </div>
        </footer>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowBuyModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Buy Assets</h3>
              <button onClick={() => setShowBuyModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Asset</label>
                <select value={buyForm.asset} onChange={e => setBuyForm(p => ({ ...p, asset: e.target.value }))} className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface">
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="VOO">Vanguard S&P 500 (VOO)</option>
                  <option value="TSLA">Tesla Inc. (TSLA)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="AAPL">Apple Inc. (AAPL)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Amount (₹)</label>
                <input type="number" value={buyForm.amount} onChange={e => setBuyForm(p => ({ ...p, amount: e.target.value }))} placeholder="Enter amount" className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none placeholder-outline text-on-surface" />
              </div>
              <button onClick={handleBuy} className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all mt-2">
                Place Buy Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSellModal(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">Sell Assets</h3>
              <button onClick={() => setShowSellModal(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Asset</label>
                <select value={sellForm.asset} onChange={e => setSellForm(p => ({ ...p, asset: e.target.value }))} className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none bg-white text-on-surface">
                  <option value="ETH">Ethereum (3.402 ETH)</option>
                  <option value="VOO">Vanguard S&P 500 (112.5 Shares)</option>
                  <option value="TSLA">Tesla Inc. (45 Shares)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[14px] text-outline mb-2">Amount (₹)</label>
                <input type="number" value={sellForm.amount} onChange={e => setSellForm(p => ({ ...p, amount: e.target.value }))} placeholder="Enter amount" className="w-full border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md focus:ring-2 focus:ring-primary outline-none placeholder-outline text-on-surface" />
              </div>
              <button onClick={handleSell} className="w-full py-3 bg-error text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(186,26,26,0.2)] active:scale-95 transition-all mt-2">
                Place Sell Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investment Detail Modal */}
      {showInvestmentDetail !== null && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowInvestmentDetail(null)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-md shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">{investmentData[showInvestmentDetail].name}</h3>
              <button onClick={() => setShowInvestmentDetail(null)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-[12px]">
                  <p className="text-[12px] font-semibold text-outline mb-1">Current Value</p>
                  <p className="font-headline-md text-primary">{investmentData[showInvestmentDetail].value}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-[12px]">
                  <p className="text-[12px] font-semibold text-outline mb-1">24h Change</p>
                  <p className={`font-headline-md ${investmentData[showInvestmentDetail].positive ? "text-primary" : "text-error"}`}>
                    {investmentData[showInvestmentDetail].change}
                  </p>
                </div>
              </div>
              <div className="p-4 border border-outline-variant/30 rounded-[12px]">
                <p className="text-[12px] font-semibold text-outline mb-1">Holdings</p>
                <p className="font-semibold text-[14px] text-on-surface">{investmentData[showInvestmentDetail].holding}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowInvestmentDetail(null); setShowBuyModal(true); }} className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold text-[16px] hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)] active:scale-95 transition-all">
                  Buy More
                </button>
                <button onClick={() => { setShowInvestmentDetail(null); setShowSellModal(true); }} className="flex-1 py-3 border border-error text-error rounded-lg font-semibold text-[16px] hover:bg-error/10 active:scale-95 transition-all">
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Positions Modal */}
      {showAllPositions && (
        <div className="fixed inset-0 bg-inverse-surface/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAllPositions(false)}>
          <div className="bg-white rounded-[16px] p-8 w-full max-w-2xl shadow-[0_12px_32px_rgba(120,118,129,0.08)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-on-surface text-xl">All Positions</h3>
              <button onClick={() => setShowAllPositions(false)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-outline">close</span>
              </button>
            </div>
            <div className="space-y-3">
              {[...investmentData,
                { name: "Bitcoin", ticker: "BTC / USD", change: "+2.14%", holding: "0.85 BTC", value: "₹28,900.00", icon: "currency_bitcoin", tag: "Stable", positive: true },
                { name: "Apple Inc.", ticker: "AAPL / STOCKS", change: "+0.67%", holding: "30 Shares", value: "₹5,250.00", icon: "phone_iphone", tag: "Steady", positive: true },
              ].map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-[12px] border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer" onClick={() => showToastMsg(`${inv.name}: ${inv.value} (${inv.change})`)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{inv.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[16px] text-on-surface">{inv.name}</p>
                      <p className="text-[12px] font-semibold text-outline">{inv.ticker}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[16px] text-on-surface">{inv.value}</p>
                    <p className={`text-[12px] font-semibold ${inv.positive ? "text-primary" : "text-error"}`}>{inv.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 max-w-md border border-outline-variant/20">
          <span className="material-symbols-outlined shrink-0 text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
