import { memo, useCallback } from "react";

import { useToast, UseToastOptions } from "@chakra-ui/react";

const Alert = () => {
  const toast = useToast();

  window.alert = useCallback(
    (description: string, status: UseToastOptions["status"] = "info") =>
      toast({
        title: status.charAt(0).toUpperCase() + status.slice(1),
        description,
        status,
        duration: 9000,
        isClosable: true,
      }),
    [toast]
  );

  return null;
};

export default memo(Alert);
