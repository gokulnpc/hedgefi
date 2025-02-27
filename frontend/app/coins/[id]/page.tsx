"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  Activity,
  Users,
  MessageSquare,
  BarChart2,
  PieChart,
  Globe,
  Layers,
  Brain,
} from "lucide-react";
import { SiteHeader } from "@/app/components/site-header";
import { Footer } from "@/app/components/Footer";
import GridBackground from "@/app/components/GridBackground";
import { Input } from "@/components/ui/input";
import Marquee from "react-fast-marquee";

// Import the mock coin data
import { trendingCoins, type Coin } from "@/app/data/mockCoins";
import router from "next/router";

// Import the TopHolders component
import TopHolders, { mockHolders } from "../components/TopHolders";

// Types for enhanced features
type TimeRange = "5M" | "1H" | "4H" | "24H";

type VolumeData = {
  timeRange: TimeRange;
  buyVolume: number;
  sellVolume: number;
  netChange: number;
};

type TraderAnalytics = {
  totalTraders: number;
  activeTraders24h: number;
  avgTradeSize: number;
  topTrader: string;
};

type LiquidityData = {
  totalLiquidity: number;
  liquidityChange24h: number;
  topPool: string;
  poolCount: number;
};

const TradingViewWidget = dynamic(
  () => import("../components/trading-view-widget"),
  {
    ssr: false,
  }
);

const getTradingViewWidget = (pool_id: string) => {
  return (
    <iframe
      height="100%"
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/sui-network/pools/${pool_id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
      style={{ border: 0 }}
      allow="clipboard-write"
      allowFullScreen
    ></iframe>
  );
};

const timeRanges = ["6H", "1D", "7D", "30D"];

// Add this new component for the title
const TitleMarquee: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="w-full overflow-hidden">
      <Marquee
        gradient={false}
        speed={20}
        delay={2}
        play={true}
        direction="left"
        pauseOnHover={true}
      >
        <span className="text-3xl font-pixel text-green-400">{text}</span>
      </Marquee>
    </div>
  );
};

// Import the components
import MarketStatsTab from "../components/MarketStatsTab";
import TradersTab from "../components/TradersTab";
import LiquidityTab from "../components/LiquidityTab";
import BubbleMapTab from "../components/BubbleMapTab";
import ActiveWalletsTab from "../components/ActiveWalletsTab";
import CoinTrade from "../components/CoinTrade";
import CoinChat from "../components/CoinChat";

export default function CoinPage() {
  const { id } = useParams();
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  const balance = 500;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coinData, setCoinData] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [showChat, setShowChat] = useState(true);

  // Mock volume data
  const volumeData: VolumeData[] = [
    { timeRange: "5M", buyVolume: 1.4, sellVolume: 1.4, netChange: -2.07 },
    { timeRange: "1H", buyVolume: 7.8, sellVolume: 7.8, netChange: -2.03 },
    { timeRange: "4H", buyVolume: 15.2, sellVolume: 14.8, netChange: -1.69 },
    { timeRange: "24H", buyVolume: 45.6, sellVolume: 42.4, netChange: 8.04 },
  ];

  // Available timeframes
  const timeframes = ["6H", "12H", "1D", "3D", "7D", "30D"];

  useEffect(() => {
    // Check authentication status on client side
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");

    // Fetch coin data based on ID
    if (id) {
      // Handle case when id is an array
      const coinId = Array.isArray(id) ? id[0] : id.toString();

      // For now, we'll use the mock data
      // In a real app, you would fetch this from an API
      const coin = trendingCoins.find((coin) => coin.id === coinId);

      if (coin) {
        setCoinData(coin);
        setLoading(false);
      } else {
        // If coin not found, you could redirect to a 404 page
        // or show an error message
        setLoading(false);
      }
    }
  }, [id]);

  // Redirect if not authenticated for trading functionality
  const handleTradeAction = () => {
    if (!isAuthenticated) {
      router.push("/signin?redirect=" + encodeURIComponent(`/coins/${id}`));
      return;
    }
    // Handle trade action for authenticated users
  };

  const handlePercentageClick = (percentage: number) => {
    const newAmount = ((balance * percentage) / 100).toFixed(2);
    setAmount(newAmount);
    setTotal(newAmount);
  };

  // Mock market stats
  const marketStats = {
    price: "$0.00123",
    change24h: "+5.67%",
    volume24h: "$1,234,567",
    marketCap: "$12,345,678",
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <SiteHeader />

      <main className="flex-1 pt-20">
        <div className="container mx-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400/30"></div>
            </div>
          ) : coinData ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Left Section - Chart and Analytics */}
              <div className="col-span-9">
                {/* Chart Card */}
                <Card className="mb-6 border border-gray-400/30">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <span>{coinData.symbol}/USDT</span>
                      <span className="text-sm text-green-400">(+8.56%)</span>
                    </CardTitle>
                    <div className="flex gap-2">
                      {timeframes.map((timeframe) => (
                        <Button
                          key={timeframe}
                          variant={
                            selectedTimeframe === timeframe
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTimeframe(timeframe)}
                        >
                          {timeframe}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[600px]">
                    <TradingViewWidget symbol={coinData.symbol} />
                  </CardContent>
                </Card>

                {/* Analytics Tabs */}
                <Card className="border border-gray-400/30">
                  <CardContent className="p-4">
                    <Tabs defaultValue="market-stats">
                      <TabsList className="grid grid-cols-6 mb-4">
                        <TabsTrigger value="market-stats">
                          <Globe className="w-4 h-4 mr-2" />
                          Market Stats
                        </TabsTrigger>
                        <TabsTrigger value="holders">
                          <Users className="w-4 h-4 mr-2" />
                          Top Holders
                        </TabsTrigger>
                        <TabsTrigger value="traders">
                          <Activity className="w-4 h-4 mr-2" />
                          Traders
                        </TabsTrigger>
                        <TabsTrigger value="liquidity">
                          <Layers className="w-4 h-4 mr-2" />
                          Liquidity
                        </TabsTrigger>
                        <TabsTrigger value="bubble-map">
                          <PieChart className="w-4 h-4 mr-2" />
                          Bubble Map
                        </TabsTrigger>
                        <TabsTrigger value="wallets">
                          <Wallet className="w-4 h-4 mr-2" />
                          Active Wallets
                        </TabsTrigger>
                      </TabsList>

                      {/* Tab Content */}
                      <TabsContent value="market-stats">
                        <MarketStatsTab
                          coinData={coinData}
                          volumeData={volumeData}
                        />
                      </TabsContent>
                      <TabsContent value="holders">
                        <TopHolders holders={mockHolders} />
                      </TabsContent>
                      <TabsContent value="traders">
                        <TradersTab />
                      </TabsContent>
                      <TabsContent value="liquidity">
                        <LiquidityTab />
                      </TabsContent>
                      <TabsContent value="bubble-map">
                        <BubbleMapTab />
                      </TabsContent>
                      <TabsContent value="wallets">
                        <ActiveWalletsTab />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right Section - Trading/Chat Interface */}
              <div className="col-span-3 space-y-6">
                <Card className="border border-gray-400/30">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex gap-2">
                      <Button
                        variant={showChat ? "outline" : "default"}
                        size="sm"
                        onClick={() => setShowChat(false)}
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Trade
                      </Button>
                      <Button
                        variant={showChat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowChat(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showChat ? (
                      <CoinChat />
                    ) : (
                      <CoinTrade
                        symbol={coinData.symbol}
                        isAuthenticated={isAuthenticated}
                        handleTradeAction={handleTradeAction}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Coin not found</h2>
              <p className="mb-6">
                The coin you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
