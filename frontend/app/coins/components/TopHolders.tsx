import { Card, CardContent } from "@/components/ui/card";
import Marquee from "react-fast-marquee";

// Type definition for a holder
export type Holder = {
  rank: number;
  address: string;
  liquidityPercentage: number;
};

// Mock holders data that can be used as default
export const mockHolders: Holder[] = [
  { rank: 1, address: "0x1234...5678", liquidityPercentage: 15.5 },
  { rank: 2, address: "0x8765...4321", liquidityPercentage: 12.3 },
  { rank: 3, address: "0x9876...1234", liquidityPercentage: 8.7 },
  { rank: 4, address: "0x4567...8901", liquidityPercentage: 6.4 },
  { rank: 5, address: "0x3456...7890", liquidityPercentage: 5.2 },
  { rank: 6, address: "0x2345...6789", liquidityPercentage: 4.1 },
  { rank: 7, address: "0x7890...2345", liquidityPercentage: 3.8 },
  { rank: 8, address: "0x6789...3456", liquidityPercentage: 3.2 },
  { rank: 9, address: "0x5678...4567", liquidityPercentage: 2.9 },
  { rank: 10, address: "0x4321...5678", liquidityPercentage: 2.5 },
];

// Address marquee component
const AddressMarquee: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="w-[300px] bg-gray-800 rounded-lg px-2 py-1">
      <Marquee
        gradient={false}
        speed={20}
        delay={2}
        play={true}
        direction="left"
        pauseOnHover={true}
      >
        <span className="font-clean text-green-400">{text}</span>
      </Marquee>
    </div>
  );
};

// Stats card component
const StatsCard: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <Card className="border border-gray-400/30">
    <CardContent className="p-4">
      <h4 className="text-sm text-muted-foreground">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

// Main TopHolders component
const TopHolders: React.FC<{ holders?: Holder[] }> = ({
  holders = mockHolders,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatsCard title="Total Holders" value="32K" />
      <StatsCard title="Avg. Holdings" value="$2.3K" />
      <StatsCard title="Top 10 %" value="65.4%" />
    </div>
    <Card className="border border-gray-400/30">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Top Holders</h3>
        <div className="space-y-3">
          {holders.map((holder) => (
            <div
              key={holder.rank}
              className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-gray-400/30"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  #{holder.rank}
                </span>
                <AddressMarquee text={holder.address} />
              </div>
              <span className="text-sm font-bold">
                {holder.liquidityPercentage.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TopHolders;
