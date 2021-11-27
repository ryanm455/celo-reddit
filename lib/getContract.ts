import Metadata from "contract/artifacts/Deddit_metadata.json";
import type { Contract } from "web3-eth-contract";

import { ContractKit } from "@celo/contractkit";

let contract: any;

export const getContract = (kit: ContractKit): Contract => {
  // helper to get the contract
  if (!contract) {
    contract = new kit.web3.eth.Contract(
      Metadata as any,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    );
  }

  return contract;
};
