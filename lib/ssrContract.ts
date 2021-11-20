import Metadata from "contract/artifacts/Deddit_metadata.json";
import Web3 from "web3";

import { newKitFromWeb3 } from "@celo/contractkit";

export const ssrContract = async () => {
  const web3 = new Web3(process.env.CONTRACT_DEPLOYMENT_SERVER as string);

  const kit = newKitFromWeb3(web3 as any);

  const accounts = await kit.web3.eth.getAccounts();
  kit.defaultAccount = accounts[0];

  return new kit.web3.eth.Contract(
    Metadata.output.abi as any,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );
};
