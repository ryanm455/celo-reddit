import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useContract } from "lib/contractKit";
import Link from "next/link";

import {
  MenuItem,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";

import CreateCommunityModal from "./modals/CreateCommunityModal";

const CommunityView = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, contract } = useContract();
  const [communities, setCommunities] = useState<(number | string)[][]>([]);
  const communitiesLen = useRef<number | null>(null);

  const getCommunities = useCallback(async () => {
    // dynamically adds communities to the list
    communitiesLen.current = parseInt(
      await contract!.methods.communitesLen().call()
    );

    const req: Promise<void>[] = [];
    for (let i = 0; i < (communitiesLen.current as number); i++) {
      const callback = (i: number) => (name: string) =>
        setCommunities(c => [...c, [name, i]]);
      req.push(contract!.methods.getCommunity(i).call().then(callback(i)));
    }

    await Promise.all(req);
  }, [contract]);

  useEffect(() => {
    // when connected to a wallet fetch the communities
    address &&
      communitiesLen.current !== communities.length &&
      getCommunities();
  }, [address]);

  return address ? (
    <>
      {communities.map(c => (
        <Link href={`/r/${c[1]}`} passHref key={c[1]}>
          <MenuItem>r/{c[0]}</MenuItem>
        </Link>
      ))}
      {communitiesLen.current !== communities.length && (
        <MenuItem>
          <Spinner />
        </MenuItem>
      )}
      <MenuItem mt={3} size="sm" onClick={onOpen}>
        Create
      </MenuItem>
      <CreateCommunityModal isOpen={isOpen} onClose={onClose} />
    </>
  ) : (
    <MenuItem>Cannot read from contract without connecting wallet.</MenuItem>
  );
};

export default CommunityView;
