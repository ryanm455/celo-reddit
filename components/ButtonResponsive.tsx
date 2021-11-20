import { forwardRef } from "react";

import { Box, Button } from "@chakra-ui/react";

type Props = {
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

const ButtonResponsive = (
  { children, icon, ...props }: Props & any,
  ref: any
) => (
  <Button
    leftIcon={icon}
    sx={{ "span.chakra-button__icon": { mr: { base: 0, sm: "0.5rem" } } }}
    aria-label={children}
    ref={ref}
    {...props}
  >
    {/* @ts-ignore */}
    <Box as="span" display={{ base: "none", sm: "block" }}>
      {children}
    </Box>
  </Button>
);

export default forwardRef<typeof Button, Props & any>(ButtonResponsive);
