import {
  memo,
  useCallback,
} from "react";

import {
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";

const Alert = () => {
  // manages the alerts to make sure that look nice and fit the theme
  const toast = useToast();

  // replaces the default window.alert function
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
