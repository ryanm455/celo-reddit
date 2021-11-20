import type { UseToastOptions } from "@chakra-ui/react";

declare global {
  interface Window {
    celo: any;
    alert(description: string, status?: UseToastOptions["status"]): void;
  }

  function alert(description: string, status?: UseToastOptions["status"]): void;
}
