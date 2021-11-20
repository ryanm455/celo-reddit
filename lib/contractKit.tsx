import {
  createContext,
  FC,
  useContext,
  useState,
} from "react";

import type { Contract as TContract } from "web3-eth-contract";

import { ContractKit } from "@celo/contractkit";

import { getContract } from "./getContract";

interface IContract {
  kit?: ContractKit;
  contract?: TContract;
  address?: string;
  connect: () => void;
}

let [kit, contract] = [
  undefined as unknown as ContractKit,
  undefined as unknown as TContract,
];

const Contract = createContext<IContract>({ connect: () => {} });

export const ContractProvider: FC = ({ children }) => {
  // Provider for the contract enables it to be accessed throughout the dapp
  const [address, setAddress] = useState<string>();

  const connect = async () => {
    // connecting to the celo blockchain
    // @ts-ignore
    const Web3 = await import("web3/dist/web3.min.js").then(w => w.default);
    const newKitFromWeb3 = await import("@celo/contractkit").then(
      c => c.newKitFromWeb3
    );

    if (window.celo) {
      try {
        await window.celo.enable();

        const web3 = new Web3(window.celo);
        kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        contract = getContract(kit);

        setAddress(kit.defaultAccount);
      } catch (error) {
        alert("Error", (error as any).toString());
      }
    } else {
      alert("CeloExtensionWallet not installed", "warning");
    }
  };

  return (
    <Contract.Provider value={{ connect, kit, contract, address }}>
      {children}
    </Contract.Provider>
  );
};

export const useContract = () => useContext(Contract);
