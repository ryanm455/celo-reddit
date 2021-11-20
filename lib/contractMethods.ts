import BigNumber from "bignumber.js";

import { ContractKit } from "@celo/contractkit";

import { postsFromArr } from "./contractResConv";
import { getContract } from "./getContract";

export const upVote = (
  kit: ContractKit,
  idx: number,
  commentIdx: number = -1
) =>
  getContract(kit)
    .methods.upVote(idx, commentIdx)
    .send({ from: kit.defaultAccount });
export const downVote = (
  kit: ContractKit,
  idx: number,
  commentIdx: number = -1
) =>
  getContract(kit)
    .methods.downVote(idx, commentIdx)
    .send({ from: kit.defaultAccount });
export const getVoteState = (
  kit: ContractKit,
  idx: number,
  commentIdx: number = -1
) => getContract(kit).methods.getVoteState(idx, commentIdx).call();
export const getPosts = async (kit: ContractKit, communityIdx: number) => {
  const postsIdx: number[] = await getContract(kit)
    .methods.getCommunityPosts(communityIdx)
    .call();

  return await postsFromArr(postsIdx, getContract(kit));
};
export const sendCUSD = async (
  kit: ContractKit,
  address: string,
  amount: number
) => {
  const _amount = new BigNumber(amount || 1).shiftedBy(18).toString(); // must be toString as for some reason in production it will fail
  const stableToken = await kit.contracts.getStableToken();
  const cUSDtx = await stableToken
    .transfer(address, _amount as unknown as number)
    .send({
      from: kit.defaultAccount,
      feeCurrency: stableToken.address,
    });

  await cUSDtx.waitReceipt();

  alert("Transfer succeeded! 🎉", "success");
};

export const checkAuth = (contractFeat: any, func: () => any) => () =>
  contractFeat
    ? func()
    : alert(
        "You must connect to wallet in order to read / write from the smart contract!",
        "warning"
      );
