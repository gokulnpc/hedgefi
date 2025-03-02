import { ethers, BrowserProvider, Contract, Signer } from "ethers";
import { pinFileToIPFS, pinJSONToIPFS, unPinFromIPFS } from "@/app/lib/pinata";
import Factory from "../abi/Factory.json";
import NativeLiquidityPool from "../abi/NativeLiquidityPool.json";
import {config} from "../app/config/contract_addresses";

// Define TypeScript interfaces
interface TokenSale {
  token: string;
  name: string;
  creator: string;
  sold: any;
  raised: any;
  isOpen: boolean;
  metadataURI: string;
}

interface Token {
  token: string;
  name: string;
  creator: string;
  sold: any;
  raised: any;
  isOpen: boolean;
  image: string;
  description: string;
}

interface ContractObjects {
  provider: any;
  signer: any;
  factory: any;
  liquidityPool: any;
}

interface ConfigType {
  [key: string]: {
    factory: { address: string };
    nativeLiquidityPool: { address: string };
  };
}

const typedConfig: ConfigType = config;

/**
 * Initializes the Ethereum provider, signer, network, factory, and liquidity pool contract.
 */
async function loadFactoryContract(): Promise<ContractObjects> {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const chainId = network.chainId.toString();

  if (!typedConfig[chainId]) throw new Error("Unsupported network");

  const factory = new Contract(
    typedConfig[chainId].factory.address,
    Factory,
    signer
  );

  const liquidityPool = new Contract(
    typedConfig[chainId].nativeLiquidityPool.address,
    NativeLiquidityPool,
    signer
  );

  return { provider, signer, factory, liquidityPool };
}

/**
 * Swap ETH for tokens.
 */
export async function swapCoinforToken(token: TokenSale, amount: bigint): Promise<{ success: boolean }> {
  try {
    const { signer, liquidityPool } = await loadFactoryContract();

    const transaction = await liquidityPool.connect(signer).swapEthForToken(
      token.token,
      { value: amount }
    );

    const receipt = await transaction.wait();
    return { success: receipt.status === 1 };
  } catch (error) {
    console.error("Error swapping ETH for token:", error);
    return { success: false };
  }
}

/**
 * Swap tokens for ETH.
 */
export async function swapTokenforCoin(tokenSale: TokenSale, tokenAmount: bigint): Promise<{ success: boolean }> {
  try {
    const { signer, liquidityPool } = await loadFactoryContract();

    const transaction = await liquidityPool.connect(signer).swapTokenForEth(
      tokenSale.token,
      tokenAmount
    );

    const receipt = await transaction.wait();
    return { success: receipt.status === 1 };
  } catch (error) {
    console.error("Error swapping token for ETH:", error);
    return { success: false };
  }
}

/**
 * Create a new token.
 */
export async function createToken(metaData: any, image: File): Promise<{ success: boolean, imageURL?: string|null, error?: any }> {
  try {
    console.log("Uploading File to IPFS", "info", 1000);
    const imageIpfsHash = await pinFileToIPFS(image);

    console.log("Uploading metadata to IPFS", "info", 1000);
    const metadataURI = await pinJSONToIPFS({ ...metaData, imageURI: imageIpfsHash });

    const { factory, signer } = await loadFactoryContract();
    const fee = await factory.fee();

    const tx = await factory.connect(signer).create(
      metaData.name,
      metaData.ticker,
      metadataURI,
      { value: fee }
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      return { success: true, imageURL: imageIpfsHash };
    } else {
      if (imageIpfsHash) await unPinFromIPFS(imageIpfsHash);
      if(metadataURI) await unPinFromIPFS(metadataURI);
      return { success: false, error: "Transaction failed" };
    }
  } catch (error) {
    console.error("Error in createToken:", error);
    return { success: false, error };
  }
}

/**
 * Buy tokens.
 */
export async function buyToken(tokenSale: TokenSale, amount: bigint): Promise<{ success: boolean, error?: any }> {
  try {
    if (!tokenSale.isOpen) return { success: false };

    const { factory, signer } = await loadFactoryContract();

    const cost = await factory.getCost(tokenSale.sold);
    const totalCost = cost * amount;
    
    const transaction = await factory.connect(signer).buy(
      tokenSale.token,
      ethers.parseUnits(amount.toString(), 18),
      { value: totalCost }
    );

    const receipt = await transaction.wait();
    return { success: receipt.status === 1 };
  } catch (error) {
    console.error("Error buying token:", error);
    return { success: false, error };
  }
}

/**
 * Fetch all tokens.
 */
export async function getAllTokens(): Promise<Token[]> {
  const { factory } = await loadFactoryContract();
  const totalTokens = await factory.totalTokens();
  const tokens: Token[] = [];

  for (let i = 0; i < totalTokens; ++i) {
    const tokenSale: TokenSale = await factory.getTokenSale(i);
    const metadata = await fetchMetadata(tokenSale.metadataURI);

    tokens.push({
      token: tokenSale.token,
      name: tokenSale.name,
      creator: tokenSale.creator,
      sold: tokenSale.sold,
      raised: tokenSale.raised,
      isOpen: tokenSale.isOpen,
      image: metadata.imageURI,
      description: metadata.description
    });
  }

  return tokens.reverse();
}

/**
 * Fetch tokens based on their state.
 */
export async function getTokens(isOpen: boolean): Promise<Token[]> {
  const { factory } = await loadFactoryContract();
  const totalTokens = await factory.totalTokens();
  const tokens: Token[] = [];

  for (let i = 0; i < totalTokens; ++i) {
    const tokenSale: TokenSale = await factory.getTokenSale(i);
    if (tokenSale.isOpen === isOpen) {
      const metadata = await fetchMetadata(tokenSale.metadataURI);

      tokens.push({
        token: tokenSale.token,
        name: tokenSale.name,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen,
        image: metadata.imageURI,
        description: metadata.description
      });
    }
  }

  return tokens.reverse();
}

/**
 * Fetch metadata from IPFS.
 */
async function fetchMetadata(metadataURI: string): Promise<{ name: string; description: string; imageURI: string }> {
  if (!metadataURI) return { name: "Unknown", description: "", imageURI: "" };

  try {
    const response = await fetch(metadataURI);
    if (!response.ok) throw new Error("Failed to fetch metadata");
    return await response.json();
  } catch (error) {
    console.log(`Failed to fetch metadata for ${metadataURI}:`, error);
    return { name: "Unknown", description: "No description available", imageURI: "" };
  }
}
