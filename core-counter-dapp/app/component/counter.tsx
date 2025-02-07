import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "@/lib/contract";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
export default function CounterDApp() {
  const [counter, setCounter] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(contractInstance);
          fetchCounter(contractInstance);
        } else {
          alert("No accounts found.");
        }
      } catch (error) {
        alert("Error connecting to wallet.");
        console.error(error);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const fetchCounter = async (contractInstance: ethers.Contract) => {
    if (contractInstance) {
      const value = await contractInstance.getCounter();
      setCounter(Number(value));
    }
  };

  const incrementCounter = async () => {
    if (contract) {
      const tx = await contract.addCounter();
      await tx.wait();
      fetchCounter(contract);
    }
  };

  const decrementCounter = async () => {
    if (contract) {
      const tx = await contract.subtractCounter();
      await tx.wait();
      fetchCounter(contract);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-4">Counter DApp</h1>
      {account ? (
        <p className="mb-2">Connected Account: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect Wallet
        </button>
      )}
      <div className="text-2xl font-semibold mb-4">
        Counter: {counter !== null ? counter : "Loading..."}
      </div>
      <div className="space-x-4">
        <button
          onClick={incrementCounter}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +
        </button>
        <button
          onClick={decrementCounter}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -
        </button>
      </div>
    </div>
  );
}
