import { useMemo } from "react";

import makeBlockie from "ethereum-blockies-base64";

import { Avatar } from "@chakra-ui/react";

const UserAvatar: React.FC<{ address?: string }> = ({ address }) => {
  // displays an avatar of the user
  const profile = useMemo(() => address && makeBlockie(address), [address]);

  return <Avatar name="?" size="sm" src={profile} />;
};

export default UserAvatar;
