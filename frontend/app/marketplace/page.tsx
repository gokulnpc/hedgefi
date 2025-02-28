"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "../components/site-header";
import { Footer } from "../components/Footer";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Twitter,
  Shield,
  TextIcon as Telegram,
  Clock,
  TrendingUp,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import GridBackground from "../components/GridBackground";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { MarketFilters } from "../components/MarketFilters";
import type { Chain, FilterOption, MemeToken } from "../components/types";
import Marquee from "react-fast-marquee";
import { AppLayout } from "../components/app-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTokenStore } from "../store/tokenStore";

const DEFAULT_TOKEN_IMAGE = "/placeholder.svg";
const DEFAULT_CHAIN_LOGO = "/chain-placeholder.svg";

const chains: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "bsc",
    name: "BSC",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    id: "solana",
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    id: "polygon",
    name: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
] as const;

const filterOptions: FilterOption[] = [
  { id: "latest", label: "Latest", icon: Clock },
  { id: "trending", label: "Trending", icon: TrendingUp },
] as const;

const mockTokens: MemeToken[] = [
  {
    name: "Doge Wisdom",
    symbol: "WISE",
    description: "Much wisdom, very insight, wow!",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: 0.41,
    fundingRaised: "0",
    chain: "ethereum",
  },
  {
    name: "Pepe Rare",
    symbol: "RARE",
    description: "The rarest Pepe in existence",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/017/618/pepefroggie.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: -9.74,
    fundingRaised: "0",
    chain: "solana",
  },
  {
    name: "Wojak Finance",
    symbol: "WOJAK",
    description: "He bought? Dump it.",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/031/671/cover1.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: -3.48,
    fundingRaised: "0",
    chain: "solana",
  },
  {
    name: "Cheems Bonk",
    symbol: "BONK",
    description: "The legendary Cheems brings good fortune",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/033/421/cover2.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: 6.83,
    fundingRaised: "0",
    chain: "bsc",
  },
  {
    name: "Gigachad Token",
    symbol: "CHAD",
    description: "Yes, I buy memecoins. How could you tell?",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: 12.45,
    fundingRaised: "0",
    chain: "avalanche",
  },
  {
    name: "Stonks Master",
    symbol: "STONK",
    description: "Only goes up! Financial genius!",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/029/959/Screen_Shot_2019-06-05_at_1.26.32_PM.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: 8.21,
    fundingRaised: "0",
    chain: "polygon",
  },
  {
    name: "Nyan Cat Classic",
    symbol: "NYAN",
    description: "Pop-tart cat traversing the galaxy",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/000/976/Nyan_Cat.jpg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: -5.67,
    fundingRaised: "0",
    chain: "ethereum",
  },
  {
    name: "This Is Fine",
    symbol: "FINE",
    description: "Everything is absolutely fine",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/018/012/this_is_fine.jpeg",
    price: "0.000033",
    marketCap: "7.3k",
    priceChange: 3.92,
    fundingRaised: "0",
    chain: "bsc",
  },
  {
    name: "Distracted BF",
    symbol: "SIMP",
    description: "When you see another meme coin pumping",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/023/732/damngina.jpg",
    price: "0.000045",
    marketCap: "8.1k",
    priceChange: 15.32,
    fundingRaised: "0",
    chain: "avalanche",
  },
  {
    name: "Moon Soon",
    symbol: "MOON",
    description: "To the moon! Any minute now...",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/022/444/hiltonmoon.jpg",
    price: "0.000028",
    marketCap: "5.2k",
    priceChange: -2.15,
    fundingRaised: "0",
    chain: "polygon",
  },
  {
    name: "Galaxy Brain",
    symbol: "BRAIN",
    description: "Big brain moves only",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/030/525/cover5.png",
    price: "0.000052",
    marketCap: "9.4k",
    priceChange: 7.84,
    fundingRaised: "0",
    chain: "ethereum",
  },
  {
    name: "Sad Pablo",
    symbol: "SAD",
    description: "When your portfolio is down bad",
    imageUrl:
      "https://i.kym-cdn.com/entries/icons/original/000/026/489/crying.jpg",
    price: "0.000019",
    marketCap: "3.5k",
    priceChange: -12.45,
    fundingRaised: "0",
    chain: "solana",
  },
];

const TokenCard = ({ token, index }: { token: MemeToken; index: number }) => {
  const needsMarquee = token.name.length > 15;
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group w-full"
    >
      <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10">
        {/* Image Container */}
        <Link href={`/token/${token.symbol.toLowerCase()}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-gray-900">
            {/* Use a div with background image as fallback for external images */}
            <div
              className="w-full h-full absolute inset-0"
              style={{
                backgroundImage: `url(${DEFAULT_TOKEN_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Next.js Image with error handling */}
            {!imageError && (
              <div className="w-full h-full relative">
                <Image
                  src={
                    token.imageUrl && token.imageUrl.startsWith("http")
                      ? token.imageUrl
                      : token.imageUrl || DEFAULT_TOKEN_IMAGE
                  }
                  alt={token.name}
                  width={400}
                  height={400}
                  className="object-cover"
                  priority={index < 4}
                  onError={() => setImageError(true)}
                  unoptimized={
                    !!(token.imageUrl && token.imageUrl.startsWith("http"))
                  }
                />
              </div>
            )}

            {/* Network Badge */}
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1.5 bg-black/90 rounded-full px-2.5 py-1 border border-white/10">
                {chains.map(
                  (chain) =>
                    chain.id === token.chain && (
                      <div key={chain.id} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-700 overflow-hidden">
                          <Image
                            src={DEFAULT_CHAIN_LOGO}
                            alt={chain.name}
                            width={14}
                            height={14}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                        <span className="text-[11px] font-medium text-white">
                          {chain.name}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Price Change Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-black/90 rounded-lg px-2.5 py-1 border border-white/10">
                <div className="flex items-center gap-1">
                  {token.priceChange > 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                  )}
                  <span
                    className={`text-[11px] font-medium ${
                      token.priceChange > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {Math.abs(token.priceChange).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium text-white">
                    {needsMarquee ? (
                      <div className="w-[120px] overflow-hidden">
                        <Marquee gradient={false} speed={20}>
                          <span>{token.name}</span>
                          <span className="mx-2">•</span>
                        </Marquee>
                      </div>
                    ) : (
                      token.name
                    )}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-mono"
                  >
                    ${token.symbol}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] font-mono bg-white/5 border-white/10"
                >
                  Rank #{index + 1}
                </Badge>
                {index < 3 && (
                  <Badge className="h-5 px-1.5 text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Trending
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium font-mono text-white">
                ${token.price}
              </div>
              <div className="text-[10px] text-gray-500">
                MC: ${token.marketCap}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[13px] text-gray-400 line-clamp-2">
            {token.description}
          </p>

          {/* Token Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-3 py-3 border-y border-white/10">
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5">Volume 24h</div>
              <div className="text-sm font-medium font-mono text-white">
                $1.2M
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5">Holders</div>
              <div className="text-sm font-medium font-mono text-white">
                2.1K
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors">
                <Globe className="h-3.5 w-3.5 text-gray-500 hover:text-white" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors">
                <Twitter className="h-3.5 w-3.5 text-gray-500 hover:text-white" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors">
                <Telegram className="h-3.5 w-3.5 text-gray-500 hover:text-white" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-green-400" />
              <span className="text-[10px] text-gray-500">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterOption["id"]>("latest");
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get tokens from store
  const storeTokens = useTokenStore((state) => state.tokens);

  // Combine mock tokens with store tokens
  const allTokens = useMemo(() => {
    // Convert mock tokens to match Token interface
    const convertedMockTokens = mockTokens.map((token) => ({
      ...token,
      id: token.symbol,
      volume24h: "$" + (Math.random() * 100000).toFixed(2),
      holders: (Math.random() * 1000).toFixed(0),
      launchDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      fundingRaised: "0",
      imageUrl: token.imageUrl || DEFAULT_TOKEN_IMAGE, // Use default placeholder
    }));

    // Ensure store tokens have valid imageUrl
    const validatedStoreTokens = storeTokens.map((token) => ({
      ...token,
      imageUrl: token.imageUrl || DEFAULT_TOKEN_IMAGE,
    }));

    // Combine and remove duplicates based on symbol
    const combined = [...convertedMockTokens, ...validatedStoreTokens];
    const uniqueTokens = Array.from(
      new Map(combined.map((token) => [token.symbol, token])).values()
    );

    return uniqueTokens;
  }, [storeTokens]);

  const filteredTokens = useMemo(() => {
    let filtered = allTokens.filter(
      (token) =>
        (token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedChain || token.chain === selectedChain.id)
    );

    if (activeFilter === "trending") {
      filtered = [...filtered].sort(
        (a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange)
      );
    } else {
      // For "latest", sort by launch date (newest first)
      filtered = [...filtered].sort((a, b) => {
        // First prioritize tokens from the store (user-created tokens)
        const aIsFromStore = storeTokens.some((token) => token.id === a.id);
        const bIsFromStore = storeTokens.some((token) => token.id === b.id);

        if (aIsFromStore && !bIsFromStore) return -1;
        if (!aIsFromStore && bIsFromStore) return 1;

        // Then sort by launch date
        return (
          new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
        );
      });
    }

    return filtered;
  }, [searchTerm, activeFilter, selectedChain, allTokens, storeTokens]);

  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
  const currentTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppLayout showFooter={false}>
      <GridBackground />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold">
                Meme Token{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Marketplace
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover and invest in the latest meme tokens
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tokens..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <MarketFilters
              chains={chains}
              filterOptions={filterOptions}
              selectedChain={selectedChain}
              activeFilter={activeFilter}
              onChainSelect={setSelectedChain}
              onFilterSelect={setActiveFilter}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {currentTokens.map((token, index) => (
              <TokenCard key={token.symbol} token={token} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center my-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;

                    // Show first page, last page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Show ellipsis for breaks in page numbers
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
